"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Container, Button, Card, Alert, Row, Col } from "react-bootstrap";
import * as client from "../../../../client";

export default function StudentQuizPreview() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [latestAttempt, setLatestAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useSelector((state: any) => state.accountReducer);

  useEffect(() => {
    const fetchQuizAndAttempts = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizAndAttempts();
  }, [qid, currentUser]);

  if (loading) {
    return <Container className="mt-4">Loading...</Container>;
  }

  if (!quiz) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Quiz not found.</Alert>
        <Button onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
          Back to Quizzes
        </Button>
      </Container>
    );
  }

  const totalPoints =
    quiz.questions?.reduce(
      (sum: number, q: any) => sum + (q.points || 0),
      0
    ) || 0;
  const questionCount = quiz.questions?.length || 0;

  // Calculate available attempts
  const maxAttempts = quiz.multipleAttempts ? quiz.howManyAttempts : 1;
  const remainingAttempts = maxAttempts - attemptCount;

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

  // Check availability dates
  const now = new Date();
  const availableDate = quiz.availableDate
    ? new Date(quiz.availableDate)
    : null;
  const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

  const isNotYetAvailable = !!(availableDate && now < availableDate);
  const isClosed = !!(untilDate && now > untilDate);

  const formatQuizType = (type: string) => {
    if (!type) return "N/A";
    return type.replace(/_/g, " ");
  };

  const formatAssignmentGroup = (group: string) => {
    if (!group) return "N/A";
    return group.replace(/_/g, " ");
  };

  const handleTakeQuiz = () => {
    router.push(`/Courses/${cid}/Quizzes/${qid}/take`);
  };

  // Helper to get user's answer for a question from the latest attempt
  const getUserAnswer = (questionId: string) => {
    if (!latestAttempt?.answers) return null;
    const answerObj = latestAttempt.answers.find(
      (a: any) => a.questionId === questionId
    );
    return answerObj?.answer;
  };

  // Check if showing correct answers is enabled
  const showCorrectAnswers =
    quiz.showCorrectAnswersOption === "Immediately" ||
    quiz.showCorrectAnswers === "Immediately";

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h3" className="bg-light">
          {quiz.title}
        </Card.Header>
        <Card.Body>
          {/* Quiz Description */}
          {quiz.description && (
            <div className="mb-4">
              <h5>Description</h5>
              <p className="text-muted">{quiz.description}</p>
            </div>
          )}

          {/* Quiz Details */}
          <Row className="mb-3">
            <Col md={6}>
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td className="text-end fw-bold" style={{ width: "50%" }}>
                      Quiz Type:
                    </td>
                    <td>{formatQuizType(quiz.quizType)}</td>
                  </tr>
                  <tr>
                    <td className="text-end fw-bold">Assignment Group:</td>
                    <td>{formatAssignmentGroup(quiz.assignmentGroup)}</td>
                  </tr>
                  <tr>
                    <td className="text-end fw-bold">Points:</td>
                    <td>{totalPoints}</td>
                  </tr>
                  <tr>
                    <td className="text-end fw-bold">Number of Questions:</td>
                    <td>{questionCount}</td>
                  </tr>
                </tbody>
              </table>
            </Col>
            <Col md={6}>
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td className="text-end fw-bold" style={{ width: "50%" }}>
                      Time Limit:
                    </td>
                    <td>{quiz.timeLimit} Minutes</td>
                  </tr>
                  <tr>
                    <td className="text-end fw-bold">Allowed Attempts:</td>
                    <td>{maxAttempts}</td>
                  </tr>
                  <tr>
                    <td className="text-end fw-bold">Attempts Used:</td>
                    <td>{attemptCount}</td>
                  </tr>
                  <tr>
                    <td className="text-end fw-bold">Remaining Attempts:</td>
                    <td>{remainingAttempts > 0 ? remainingAttempts : 0}</td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>

          {/* Latest Attempt Results */}
          {latestAttempt && (
            <div className="mb-4">
              <Alert variant="success">
                <h5>Your Latest Attempt</h5>
                <p className="mb-1">
                  <strong>Score:</strong> {latestAttempt.score} / {totalPoints}{" "}
                  points
                </p>
                <p className="mb-0">
                  <strong>Attempt:</strong> {attemptCount} of {maxAttempts}
                </p>
              </Alert>

              {/* Show Question Results if enabled */}
              {showCorrectAnswers && quiz.questions && (
                <div className="mt-3">
                  <h5>Question Results:</h5>
                  {quiz.questions.map((question: any, index: number) => {
                    const userAnswer = getUserAnswer(question._id);
                    let isCorrect = false;
                    let correctAnswer = "";

                    if (question.type === "MULTIPLE_CHOICE") {
                      const correctChoice = question.choices?.find(
                        (c: any) => c.isCorrect
                      );
                      correctAnswer = correctChoice?.text || "";
                      isCorrect = userAnswer === correctAnswer;
                    } else if (question.type === "TRUE_FALSE") {
                      correctAnswer = question.correctAnswer ? "True" : "False";
                      isCorrect = userAnswer === question.correctAnswer;
                    } else if (question.type === "FILL_IN_BLANK") {
                      correctAnswer = question.possibleAnswers?.join(", ") || "";
                      isCorrect = question.possibleAnswers?.some(
                        (ans: string) =>
                          ans.toLowerCase() === userAnswer?.toLowerCase()
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
                            Question {index + 1}: {question.title} (
                            {question.points} pts)
                          </h6>
                          <p>{question.question}</p>
                          <div
                            className={isCorrect ? "text-success" : "text-danger"}
                          >
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
            </div>
          )}

          {/* Availability Messages */}
          {isNotYetAvailable && (
            <Alert variant="warning">
              This quiz is not available yet. It will be available on{" "}
              {availableDate?.toLocaleString()}.
            </Alert>
          )}

          {isClosed && (
            <Alert variant="danger">
              This quiz is no longer available. It closed on{" "}
              {untilDate?.toLocaleString()}.
            </Alert>
          )}

          {!canTakeQuiz() && !isClosed && !isNotYetAvailable && (
            <Alert variant="info">
              You have used all your attempts for this quiz.
            </Alert>
          )}

          {/* Take Quiz Button */}
          <div className="text-center mt-4">
            <Button
              variant="danger"
              size="lg"
              onClick={handleTakeQuiz}
              disabled={!canTakeQuiz() || isNotYetAvailable || isClosed}
            >
              {attemptCount > 0 && canTakeQuiz() ? "Take New Attempt" : "Take Quiz"}
            </Button>
            <div className="text-muted small mt-2">
              {canTakeQuiz() && !isNotYetAvailable && !isClosed && (
                <>Starting the quiz will use one of your attempts.</>
              )}
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-3">
            <Button
              variant="outline-secondary"
              onClick={() => router.push(`/Courses/${cid}/Quizzes`)}
            >
              Back to Quizzes
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
