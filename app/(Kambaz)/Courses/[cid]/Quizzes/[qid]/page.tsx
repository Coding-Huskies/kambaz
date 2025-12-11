"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Button, Row, Col, Table } from "react-bootstrap";
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

      <Table bordered>
        <tbody>
          <tr>
            <td><strong>Quiz Type</strong></td>
            <td>{quiz.quizType?.replace(/_/g, " ")}</td>
          </tr>
          <tr>
            <td><strong>Points</strong></td>
            <td>{totalPoints}</td>
          </tr>
          <tr>
            <td><strong>Assignment Group</strong></td>
            <td>{quiz.assignmentGroup}</td>
          </tr>
          <tr>
            <td><strong>Shuffle Answers</strong></td>
            <td>{quiz.shuffleAnswers ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td><strong>Time Limit</strong></td>
            <td>{quiz.timeLimit} Minutes</td>
          </tr>
          <tr>
            <td><strong>Multiple Attempts</strong></td>
            <td>{quiz.multipleAttempts ? "Yes" : "No"}</td>
          </tr>
          {quiz.multipleAttempts && (
            <tr>
              <td><strong>How Many Attempts</strong></td>
              <td>{quiz.howManyAttempts}</td>
            </tr>
          )}
          <tr>
            <td><strong>Show Correct Answers</strong></td>
            <td>{quiz.showCorrectAnswers}</td>
          </tr>
          <tr>
            <td><strong>Access Code</strong></td>
            <td>{quiz.accessCode || "None"}</td>
          </tr>
          <tr>
            <td><strong>One Question at a Time</strong></td>
            <td>{quiz.oneQuestionAtATime ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td><strong>Webcam Required</strong></td>
            <td>{quiz.webcamRequired ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td><strong>Lock Questions After Answering</strong></td>
            <td>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</td>
          </tr>
        </tbody>
      </Table>

      <Table bordered>
        <thead>
          <tr>
            <th>Due</th>
            <th>For</th>
            <th>Available from</th>
            <th>Until</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formatDateToMonthDayYear(quiz.dueDate)}</td>
            <td>Everyone</td>
            <td>{formatDateToMonthDayYear(quiz.availableDate)}</td>
            <td>{formatDateToMonthDayYear(quiz.untilDate)}</td>
          </tr>
        </tbody>
      </Table>

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
