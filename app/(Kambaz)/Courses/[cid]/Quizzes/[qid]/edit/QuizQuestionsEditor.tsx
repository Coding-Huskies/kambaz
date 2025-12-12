"use client";

import { useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import QuestionEditor from "./QuestionEditor";
import * as client from "../../../../client";
import { useParams } from "next/navigation";

export default function QuizQuestionsEditor({
  quiz,
  setQuiz,
  onSave,
  onSaveAndPublish,
  onCancel,
}: {
  quiz: any;
  setQuiz: (quiz: any) => void;
  onSave: (quiz: any) => void;
  onSaveAndPublish: (quiz: any) => void;
  onCancel: () => void;
}) {
  const { qid } = useParams();
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );

  const totalPoints =
    quiz.questions?.reduce((sum: number, q: any) => sum + (q.points || 0), 0) ||
    0;

  const handleAddQuestion = () => {
    const newQuestion = {
      _id: `temp-${Date.now()}`,
      type: "MULTIPLE_CHOICE",
      title: "New Question",
      points: 1,
      question: "",
      choices: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    };
    setQuiz({
      ...quiz,
      questions: [...(quiz.questions || []), newQuestion],
    });
    setEditingQuestionId(newQuestion._id);
  };

  const handleSaveQuestion = async (question: any) => {
    try {
      if (qid !== "new") {
        if (question._id.startsWith("temp-")) {
          // New question - remove temp ID before saving
          const { _id, ...questionWithoutId } = question;
          const savedQuestion = await client.addQuestion(
            qid as string,
            questionWithoutId
          );
          const updatedQuestions = quiz.questions.map((q: any) =>
            q._id === question._id ? savedQuestion : q
          );
          setQuiz({ ...quiz, questions: updatedQuestions });
        } else {
          // Existing question
          await client.updateQuestion(qid as string, question._id, question);
          const updatedQuestions = quiz.questions.map((q: any) =>
            q._id === question._id ? question : q
          );
          setQuiz({ ...quiz, questions: updatedQuestions });
        }
      } else {
        // Quiz not saved yet
        const updatedQuestions = quiz.questions.map((q: any) =>
          q._id === question._id ? question : q
        );
        setQuiz({ ...quiz, questions: updatedQuestions });
      }
      setEditingQuestionId(null);
    } catch (error) {
      console.error("Error saving question:", error);
      alert("Error saving question. Please try again.");
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      if (qid !== "new" && !questionId.startsWith("temp-")) {
        await client.deleteQuestion(qid as string, questionId);
      }
      const updatedQuestions = quiz.questions.filter(
        (q: any) => q._id !== questionId
      );
      setQuiz({ ...quiz, questions: updatedQuestions });
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
  };

  const handleQuestionChange = (updatedQuestion: any) => {
    // Update the question in the quiz state as user edits it
    const updatedQuestions = quiz.questions.map((q: any) =>
      q._id === updatedQuestion._id ? updatedQuestion : q
    );
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Points: {totalPoints}</h5>
      </div>

      {quiz.questions && quiz.questions.length > 0 ? (
        <ListGroup className="mb-4">
          {quiz.questions.map((question: any, index: number) => (
            <ListGroup.Item key={question._id} className="p-3">
              {editingQuestionId === question._id ? (
                <QuestionEditor
                  question={question}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
                  onChange={handleQuestionChange}
                />
              ) : (
                <div>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h6>
                        Question {index + 1}: {question.title}
                      </h6>
                      <p className="mb-1">
                        <strong>Type:</strong>{" "}
                        {question.type.replace(/_/g, " ")}
                      </p>
                      <p className="mb-1">
                        <strong>Points:</strong> {question.points}
                      </p>
                    </div>
                    <div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => setEditingQuestionId(question._id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <div className="text-center p-5 border rounded">
          <p>No questions added yet</p>
          <p className="text-muted">Click "New Question" to add a question</p>
        </div>
      )}

      <div className="d-flex justify-content-center align-items-center mb-3 mt-3">
        <Button variant="primary" onClick={handleAddQuestion}>
          <FaPlus className="me-2" />
          New Question
        </Button>
      </div>

      <hr />

      <div className="text-end">
        <Button variant="secondary" className="me-2" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" className="me-2" onClick={() => onSave(quiz)}>
          Save
        </Button>
        <Button variant="success" onClick={() => onSaveAndPublish(quiz)}>
          Save & Publish
        </Button>
      </div>
    </div>
  );
}
