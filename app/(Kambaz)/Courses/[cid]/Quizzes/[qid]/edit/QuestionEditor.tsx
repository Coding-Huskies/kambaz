"use client";

import { useState } from "react";
import { Form, Button, FormControl, FormLabel, FormSelect } from "react-bootstrap";
import MultipleChoiceEditor from "./MultipleChoiceEditor";
import TrueFalseEditor from "./TrueFalseEditor";
import FillInBlankEditor from "./FillInBlankEditor";

export default function QuestionEditor({
  question,
  onSave,
  onCancel,
}: {
  question: any;
  onSave: (question: any) => void;
  onCancel: () => void;
}) {
  const [questionState, setQuestionState] = useState(question);

  const handleTypeChange = (newType: string) => {
    let updatedQuestion = { ...questionState, type: newType };

    // Reset type-specific fields when changing type
    if (newType === "MULTIPLE_CHOICE") {
      updatedQuestion = {
        ...updatedQuestion,
        choices: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
        correctAnswer: undefined,
        possibleAnswers: undefined,
      };
    } else if (newType === "TRUE_FALSE") {
      updatedQuestion = {
        ...updatedQuestion,
        correctAnswer: true,
        choices: undefined,
        possibleAnswers: undefined,
      };
    } else if (newType === "FILL_IN_BLANK") {
      updatedQuestion = {
        ...updatedQuestion,
        possibleAnswers: [""],
        choices: undefined,
        correctAnswer: undefined,
      };
    }

    setQuestionState(updatedQuestion);
  };

  const handleSave = () => {
    onSave(questionState);
  };

  return (
    <div className="border p-3 rounded">
      <Form>
        <div className="mb-3">
          <FormLabel>Question Type</FormLabel>
          <FormSelect
            value={questionState.type}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True/False</option>
            <option value="FILL_IN_BLANK">Fill in the Blank</option>
          </FormSelect>
        </div>

        <div className="mb-3">
          <FormLabel>Title</FormLabel>
          <FormControl
            type="text"
            value={questionState.title}
            onChange={(e) =>
              setQuestionState({ ...questionState, title: e.target.value })
            }
          />
        </div>

        <div className="mb-3">
          <FormLabel>Points</FormLabel>
          <FormControl
            type="number"
            value={questionState.points}
            onChange={(e) =>
              setQuestionState({
                ...questionState,
                points: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="mb-3">
          <FormLabel>Question</FormLabel>
          <FormControl
            as="textarea"
            rows={3}
            value={questionState.question}
            onChange={(e) =>
              setQuestionState({ ...questionState, question: e.target.value })
            }
          />
        </div>

        {questionState.type === "MULTIPLE_CHOICE" && (
          <MultipleChoiceEditor
            question={questionState}
            setQuestion={setQuestionState}
          />
        )}

        {questionState.type === "TRUE_FALSE" && (
          <TrueFalseEditor
            question={questionState}
            setQuestion={setQuestionState}
          />
        )}

        {questionState.type === "FILL_IN_BLANK" && (
          <FillInBlankEditor
            question={questionState}
            setQuestion={setQuestionState}
          />
        )}

        <div className="text-end mt-3">
          <Button variant="secondary" className="me-2" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSave}>
            Update Question
          </Button>
        </div>
      </Form>
    </div>
  );
}
