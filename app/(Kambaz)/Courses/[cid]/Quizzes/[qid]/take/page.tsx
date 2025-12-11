"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Container,
  Button,
  Card,
  FormCheck,
  FormControl,
  Alert,
} from "react-bootstrap";
import * as client from "../../../../client";

export default function TakeQuiz() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [attemptCount, setAttemptCount] = useState(0);
  const [latestAttempt, setLatestAttempt] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { currentUser } = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.accountReducer
  );

  useEffect(() => {
    const fetchQuizAndAttempts = async () => {
      const quizData = await client.findQuizById(qid as string);
      setQuiz(quizData);

      if (currentUser) {
        const attempts = await client.findAttemptsForQuiz(
          qid as string,
          currentUser._id
        );
        setAttemptCount(attempts.length);

        if (attempts.length > 0) {
          setLatestAttempt(attempts[0]);
        }
      }
    };
    fetchQuizAndAttempts();
  }, [qid, currentUser]);

  if (!quiz) {
    return <Container>Loading...</Container>;
  }

  // Check if student can take the quiz
  const canTakeQuiz = () => {
    if (!quiz.multipleAttempts && attemptCount > 0) {
      return false;
    }
    if (quiz.multipleAttempts && attemptCount >= quiz.howManyAttempts) {
      return false;
    }
    return true;
  };

  // Check availability
  const now = new Date();
  const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
  const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

  if (availableDate && now < availableDate) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          This quiz is not available yet. It will be available on{" "}
          {availableDate.toLocaleString()}.
        </Alert>
        <Button onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
          Back to Quizzes
        </Button>
      </Container>
    );
  }

  if (untilDate && now > untilDate) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">This quiz is no longer available.</Alert>
        {latestAttempt && (
          <div>
            <h5>Your Last Attempt:</h5>
            <p>
              Score: {latestAttempt.score} /{" "}
              {quiz.questions?.reduce((sum: number, q: any) => sum + q.points, 0) || 0}{" "}
              points
            </p>
          </div>
        )}
        <Button onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
          Back to Quizzes
        </Button>
      </Container>
    );
  }

  if (!canTakeQuiz()) {
    return (
      <Container className="mt-4">
        <Alert variant="info">
          You have used all your attempts for this quiz.
          {latestAttempt && (
            <div className="mt-2">
              <strong>Your Last Score:</strong> {latestAttempt.score} /{" "}
              {quiz.questions?.reduce((sum: number, q: any) => sum + q.points, 0) || 0}{" "}
              points
            </div>
          )}
        </Alert>
        <Button onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
          Back to Quizzes
        </Button>
      </Container>
    );
  }

  const currentQuestion = quiz.questions?.[currentQuestionIndex];
  const totalQuestions = quiz.questions?.length || 0;

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    // Calculate score
    let totalScore = 0;
    const answersArray = quiz.questions.map((question: any) => {
      const userAnswer = answers[question._id];
      let isCorrect = false;

      if (question.type === "MULTIPLE_CHOICE") {
        const correctChoice = question.choices.find((c: any) => c.isCorrect);
        isCorrect = userAnswer === correctChoice?.text;
      } else if (question.type === "TRUE_FALSE") {
        isCorrect = userAnswer === question.correctAnswer;
      } else if (question.type === "FILL_IN_BLANK") {
        isCorrect = question.possibleAnswers.some(
          (ans: string) => ans.toLowerCase() === userAnswer?.toLowerCase()
        );
      }

      if (isCorrect) {
        totalScore += question.points;
      }

      return {
        questionId: question._id,
        answer: userAnswer,
      };
    });

    // Save attempt
    try {
      const attempt = {
        user: currentUser._id,
        course: cid,
        answers: answersArray,
        score: totalScore,
      };

      await client.createAttempt(qid as string, attempt);
      setLatestAttempt({ ...attempt, score: totalScore });
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Error submitting quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getTotalPoints = () => {
    return quiz.questions?.reduce((sum: number, q: any) => sum + q.points, 0) || 0;
  };

  if (showResults) {
    return (
      <Container className="mt-4">
        <Alert variant="success">
          <h4>Quiz Submitted Successfully!</h4>
          <p>
            Your score: {latestAttempt.score} / {getTotalPoints()} points
          </p>
          <p>
            Attempt {attemptCount + 1} of {quiz.howManyAttempts}
          </p>
        </Alert>

        {quiz.showCorrectAnswers === "Immediately" && (
          <div className="mt-4">
            <h5>Question Results:</h5>
            {quiz.questions.map((question: any, index: number) => {
              const userAnswer = answers[question._id];
              let isCorrect = false;
              let correctAnswer = "";

              if (question.type === "MULTIPLE_CHOICE") {
                const correctChoice = question.choices.find((c: any) => c.isCorrect);
                correctAnswer = correctChoice?.text || "";
                isCorrect = userAnswer === correctAnswer;
              } else if (question.type === "TRUE_FALSE") {
                correctAnswer = question.correctAnswer ? "True" : "False";
                isCorrect = userAnswer === question.correctAnswer;
              } else if (question.type === "FILL_IN_BLANK") {
                correctAnswer = question.possibleAnswers.join(", ");
                isCorrect = question.possibleAnswers.some(
                  (ans: string) => ans.toLowerCase() === userAnswer?.toLowerCase()
                );
              }

              return (
                <Card
                  key={question._id}
                  className="mb-3"
                  border={isCorrect ? "success" : "danger"}
                >
                  <Card.Body>
                    <h6>
                      Question {index + 1}: {question.title} ({question.points} pts)
                    </h6>
                    <p>{question.question}</p>
                    <div className={isCorrect ? "text-success" : "text-danger"}>
                      <strong>Your answer:</strong>{" "}
                      {userAnswer?.toString() || "Not answered"}
                    </div>
                    {!isCorrect && (
                      <div className="text-success">
                        <strong>Correct answer:</strong> {correctAnswer}
                      </div>
                    )}
                    <div className="mt-2">
                      <strong>Points earned:</strong>{" "}
                      {isCorrect ? question.points : 0} / {question.points}
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        )}

        <Button onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
          Back to Quizzes
        </Button>
      </Container>
    );
  }

  if (!currentQuestion) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">This quiz has no questions.</Alert>
        <Button onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
          Back to Quizzes
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>{quiz.title}</h3>
        <div className="text-end">
          <div className="text-muted">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
          <div className="text-muted small">
            Attempt {attemptCount + 1} of {quiz.howManyAttempts}
          </div>
        </div>
      </div>

      <Alert variant="info">
        <div className="d-flex justify-content-between">
          <span>
            <strong>Time Limit:</strong> {quiz.timeLimit} minutes
          </span>
          <span>
            <strong>Total Points:</strong> {getTotalPoints()}
          </span>
        </div>
      </Alert>

      <Card className="mb-4">
        <Card.Body>
          <h5>
            {currentQuestion.title} ({currentQuestion.points} pts)
          </h5>
          <p>{currentQuestion.question}</p>

          {currentQuestion.type === "MULTIPLE_CHOICE" && (
            <div>
              {currentQuestion.choices.map((choice: any, index: number) => (
                <FormCheck
                  key={index}
                  type="radio"
                  label={choice.text}
                  name={`question-${currentQuestion._id}`}
                  checked={answers[currentQuestion._id] === choice.text}
                  onChange={() =>
                    handleAnswerChange(currentQuestion._id, choice.text)
                  }
                  className="mb-2"
                />
              ))}
            </div>
          )}

          {currentQuestion.type === "TRUE_FALSE" && (
            <div>
              <FormCheck
                type="radio"
                label="True"
                name={`question-${currentQuestion._id}`}
                checked={answers[currentQuestion._id] === true}
                onChange={() => handleAnswerChange(currentQuestion._id, true)}
                className="mb-2"
              />
              <FormCheck
                type="radio"
                label="False"
                name={`question-${currentQuestion._id}`}
                checked={answers[currentQuestion._id] === false}
                onChange={() => handleAnswerChange(currentQuestion._id, false)}
              />
            </div>
          )}

          {currentQuestion.type === "FILL_IN_BLANK" && (
            <FormControl
              type="text"
              placeholder="Type your answer here"
              value={answers[currentQuestion._id] || ""}
              onChange={(e) =>
                handleAnswerChange(currentQuestion._id, e.target.value)
              }
            />
          )}
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-between">
        <Button
          variant="secondary"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 || submitting}
        >
          Previous
        </Button>
        <div>
          {currentQuestionIndex < totalQuestions - 1 ? (
            <Button variant="primary" onClick={handleNext} disabled={submitting}>
              Next
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          )}
        </div>
      </div>

      {quiz.questions && quiz.questions.length > 1 && !quiz.oneQuestionAtATime && (
        <div className="mt-4">
          <h6>Questions:</h6>
          <div className="d-flex flex-wrap gap-2">
            {quiz.questions.map((q: any, index: number) => (
              <Button
                key={q._id}
                variant={
                  currentQuestionIndex === index
                    ? "primary"
                    : answers[q._id]
                    ? "success"
                    : "outline-secondary"
                }
                size="sm"
                onClick={() => setCurrentQuestionIndex(index)}
                disabled={submitting}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
