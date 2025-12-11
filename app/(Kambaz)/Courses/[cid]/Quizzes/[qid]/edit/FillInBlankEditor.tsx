"use client";

import { Button, FormControl } from "react-bootstrap";
import { FaTrash, FaPlus } from "react-icons/fa6";

export default function FillInBlankEditor({
  question,
  setQuestion,
}: {
  question: any;
  setQuestion: (question: any) => void;
}) {
  const handleAddAnswer = () => {
    const newAnswers = [...question.possibleAnswers, ""];
    setQuestion({ ...question, possibleAnswers: newAnswers });
  };

  const handleRemoveAnswer = (index: number) => {
    const newAnswers = question.possibleAnswers.filter(
      (_: string, i: number) => i !== index
    );
    setQuestion({ ...question, possibleAnswers: newAnswers });
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = question.possibleAnswers.map((answer: string, i: number) =>
      i === index ? value : answer
    );
    setQuestion({ ...question, possibleAnswers: newAnswers });
  };

  return (
    <div className="mb-3">
      <h6>Possible Correct Answers</h6>
      <p className="text-muted small">
        Add all possible correct answers (case-insensitive matching)
      </p>

      {question.possibleAnswers.map((answer: string, index: number) => (
        <div key={index} className="d-flex align-items-center mb-2">
          <FormControl
            type="text"
            placeholder={`Possible answer ${index + 1}`}
            value={answer}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            className="me-2"
          />
          {question.possibleAnswers.length > 1 && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleRemoveAnswer(index)}
            >
              <FaTrash />
            </Button>
          )}
        </div>
      ))}

      <Button variant="outline-primary" size="sm" onClick={handleAddAnswer}>
        <FaPlus className="me-2" />
        Add Another Answer
      </Button>
    </div>
  );
}
