"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Button, Row, Col } from "react-bootstrap";
import * as client from "../../../client";

const formatDateToMonthDayYear = (dateString: string) => {
  if (!dateString) return "Not set";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (qid && qid !== "new") {
        const quizData = await client.findQuizById(qid as string);
        setQuiz(quizData);
      }
    };
    fetchQuiz();
  }, [qid]);

  if (!quiz) {
    return <Container>Loading...</Container>;
  }

  const totalPoints = quiz.questions?.reduce(
    (sum: number, q: any) => sum + (q.points || 0),
    0
  ) || 0;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{quiz.title}</h2>
        <div>
          <Button
            variant="secondary"
            className="me-2"
            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/preview`)}
          >
            Preview
          </Button>
          <Button
            variant="primary"
            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)}
          >
            Edit
          </Button>
        </div>
      </div>

      <div className="">
        <Row className="border-bottom p-2">
          <Col sm={4} className="text-end"><strong>Quiz Type</strong></Col>
          <Col sm={8}>{quiz.quizType?.replace(/_/g, " ")}</Col>
        </Row>
        <Row className="border-bottom p-2">
          <Col sm={4} className="text-end"><strong>Points</strong></Col>
          <Col sm={8}>{totalPoints}</Col>
        </Row>
        <Row className="border-bottom p-2">
          <Col sm={4} className="text-end"><strong>Assignment Group</strong></Col>
          <Col sm={8}>{quiz.assignmentGroup}</Col>
        </Row>
        <Row className="border-bottom p-2">
          <Col sm={4} className="text-end"><strong>Shuffle Answers</strong></Col>
          <Col sm={8}>{quiz.shuffleAnswers ? "Yes" : "No"}</Col>
        </Row>
        <Row className="border-bottom p-2">
          <Col sm={4} className="text-end"><strong>Time Limit</strong></Col>
          <Col sm={8}>{quiz.timeLimit} Minutes</Col>
        </Row>
        <Row className="border-bottom p-2">
          <Col sm={4} className="text-end"><strong>Multiple Attempts</strong></Col>
          <Col sm={8}>{quiz.multipleAttempts ? "Yes" : "No"}</Col>
        </Row>
        {quiz.multipleAttempts && (
          <Row className="border-bottom p-2">
            <Col sm={4} className="text-end"><strong>How Many Attempts</strong></Col>
            <Col sm={8}>{quiz.howManyAttempts}</Col>
          </Row>
        )}
        <Row className="border-bottom p-2">
          <Col sm={4} className="text-end"><strong>Show Correct Answers</strong></Col>
          <Col sm={8}>{quiz.showCorrectAnswers}</Col>
        </Row>
        <Row className="border-bottom p-2">
          <Col sm={4} className="text-end"><strong>Access Code</strong></Col>
          <Col sm={8}>{quiz.accessCode || "None"}</Col>
        </Row>
        <Row className="border-bottom p-2">
          <Col sm={4} className="text-end"><strong>One Question at a Time</strong></Col>
          <Col sm={8}>{quiz.oneQuestionAtATime ? "Yes" : "No"}</Col>
        </Row>
        <Row className="border-bottom p-2">
          <Col sm={4} className="text-end"><strong>Webcam Required</strong></Col>
          <Col sm={8}>{quiz.webcamRequired ? "Yes" : "No"}</Col>
        </Row>
        <Row className="p-2">
          <Col sm={4} className="text-end"><strong>Lock Questions After Answering</strong></Col>
          <Col sm={8}>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</Col>
        </Row>
      </div>

      <div className="mt-3">
        <Row className="border-bottom border-dark p-2">
          <Col sm={3}><strong>Due</strong></Col>
          <Col sm={3}><strong>For</strong></Col>
          <Col sm={3}><strong>Available from</strong></Col>
          <Col sm={3}><strong>Until</strong></Col>
        </Row>
        <Row className="p-2">
          <Col sm={3}>{formatDateToMonthDayYear(quiz.dueDate)}</Col>
          <Col sm={3}>Everyone</Col>
          <Col sm={3}>{formatDateToMonthDayYear(quiz.availableDate)}</Col>
          <Col sm={3}>{formatDateToMonthDayYear(quiz.untilDate)}</Col>
        </Row>
      </div>

      <div className="mt-3">
        <h4>Questions ({quiz.questions?.length || 0})</h4>
        {quiz.questions && quiz.questions.length > 0 ? (
          quiz.questions.map((question: any, index: number) => (
            <div key={question._id} className="border p-3 mb-2">
              <strong>Question {index + 1}</strong>: {question.title} ({question.points} pts)
            </div>
          ))
        ) : (
          <p>No questions added yet</p>
        )}
      </div>
    </Container>
  );
}
