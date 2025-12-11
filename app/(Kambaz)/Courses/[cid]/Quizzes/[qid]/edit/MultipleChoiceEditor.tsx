"use client";

import { Button, FormControl, FormCheck } from "react-bootstrap";
import { FaTrash, FaPlus } from "react-icons/fa6";

export default function MultipleChoiceEditor({
  question,
  setQuestion,
}: {
  question: any;
  setQuestion: (question: any) => void;
}) {
  const handleAddChoice = () => {
    const newChoices = [
      ...question.choices,
      { text: "", isCorrect: false },
    ];
    setQuestion({ ...question, choices: newChoices });
  };

  const handleRemoveChoice = (index: number) => {
    const newChoices = question.choices.filter((_: any, i: number) => i !== index);
    setQuestion({ ...question, choices: newChoices });
  };

  const handleChoiceTextChange = (index: number, text: string) => {
    const newChoices = question.choices.map((choice: any, i: number) =>
      i === index ? { ...choice, text } : choice
    );
    setQuestion({ ...question, choices: newChoices });
  };

  const handleCorrectChange = (index: number) => {
    const newChoices = question.choices.map((choice: any, i: number) => ({
      ...choice,
      isCorrect: i === index,
    }));
    setQuestion({ ...question, choices: newChoices });
  };

  return (
    <div className="mb-3">
      <h6>Choices</h6>
      <p className="text-muted small">Select the correct answer by clicking the radio button</p>

      {question.choices.map((choice: any, index: number) => (
        <div key={index} className="d-flex align-items-center mb-2">
          <FormCheck
            type="radio"
            name="correct-answer"
            checked={choice.isCorrect}
            onChange={() => handleCorrectChange(index)}
            className="me-2"
          />
          <FormControl
            type="text"
            placeholder={`Choice ${index + 1}`}
            value={choice.text}
            onChange={(e) => handleChoiceTextChange(index, e.target.value)}
            className="me-2"
          />
          {question.choices.length > 2 && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleRemoveChoice(index)}
            >
              <FaTrash />
            </Button>
          )}
        </div>
      ))}

      <Button variant="outline-primary" size="sm" onClick={handleAddChoice}>
        <FaPlus className="me-2" />
        Add Another Answer
      </Button>
    </div>
  );
}
