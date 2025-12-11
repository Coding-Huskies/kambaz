"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Button, Card, Form, FormCheck, FormControl, Alert } from "react-bootstrap";
import * as client from "../../../../client";

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      const quizData = await client.findQuizById(qid as string);
      setQuiz(quizData);
    };
    fetchQuiz();
  }, [qid]);

  if (!quiz) {
    return <Container>Loading...</Container>;
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

  const handleSubmit = () => {
    // Calculate score
    let totalScore = 0;
    quiz.questions.forEach((question: any) => {
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
    });

    setScore(totalScore);
    setShowResults(true);
  };

  const getTotalPoints = () => {
    return quiz.questions?.reduce((sum: number, q: any) => sum + q.points, 0) || 0;
  };

  if (showResults) {
    return (
      <Container className="mt-4">
        <Alert variant="success">
          <h4>Quiz Preview Complete</h4>
          <p>
            Your score: {score} / {getTotalPoints()} points
          </p>
        </Alert>
        <div className="mt-4">
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
              <Card key={question._id} className="mb-3">
                <Card.Body>
                  <h5>Question {index + 1}: {question.title}</h5>
                  <p>{question.question}</p>
                  <div className={isCorrect ? "text-success" : "text-danger"}>
                    <strong>Your answer:</strong> {userAnswer?.toString() || "Not answered"}
                  </div>
                  {!isCorrect && (
                    <div className="text-success">
                      <strong>Correct answer:</strong> {correctAnswer}
                    </div>
                  )}
                  <div className="mt-2">
                    <strong>Points:</strong> {isCorrect ? question.points : 0} / {question.points}
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
        <Button variant="primary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)}>
          Edit Quiz
        </Button>
      </Container>
    );
  }

  if (!currentQuestion) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          This quiz has no questions yet. Please add questions to preview.
        </Alert>
        <Button onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)}>
          Edit Quiz
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>{quiz.title}</h3>
        <span className="text-muted">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
      </div>

      <Alert variant="info">
        <strong>This is a preview of the quiz.</strong> Your answers will not be saved.
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
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <div>
          {currentQuestionIndex < totalQuestions - 1 ? (
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button variant="success" onClick={handleSubmit}>
              Submit Quiz
            </Button>
          )}
        </div>
      </div>

      {quiz.questions && quiz.questions.length > 1 && (
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
