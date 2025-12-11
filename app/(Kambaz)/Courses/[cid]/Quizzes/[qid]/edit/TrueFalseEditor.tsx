"use client";

import { FormCheck } from "react-bootstrap";

export default function TrueFalseEditor({
  question,
  setQuestion,
}: {
  question: any;
  setQuestion: (question: any) => void;
}) {
  return (
    <div className="mb-3">
      <h6>Correct Answer</h6>
      <FormCheck
        type="radio"
        label="True"
        name="true-false"
        checked={question.correctAnswer === true}
        onChange={() => setQuestion({ ...question, correctAnswer: true })}
        className="mb-2"
      />
      <FormCheck
        type="radio"
        label="False"
        name="true-false"
        checked={question.correctAnswer === false}
        onChange={() => setQuestion({ ...question, correctAnswer: false })}
      />
    </div>
  );
}
