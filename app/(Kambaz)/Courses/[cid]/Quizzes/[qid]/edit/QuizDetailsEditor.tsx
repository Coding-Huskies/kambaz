"use client";

import { useState } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  FormControl,
  FormLabel,
  FormSelect,
  FormCheck,
} from "react-bootstrap";

export default function QuizDetailsEditor({
  quiz,
  onSave,
  onSaveAndPublish,
  onCancel,
}: {
  quiz: any;
  onSave: (quiz: any) => void;
  onSaveAndPublish: (quiz: any) => void;
  onCancel: () => void;
}) {
  const [quizState, setQuizState] = useState(quiz);

  const handleSubmit = (action: "save" | "saveAndPublish") => {
    if (action === "save") {
      onSave(quizState);
    } else {
      onSaveAndPublish(quizState);
    }
  };

  return (
    <Form>
      <FormLabel htmlFor="quiz-title">Quiz Title</FormLabel>
      <FormControl
        id="quiz-title"
        type="text"
        value={quizState.title}
        onChange={(e) =>
          setQuizState({ ...quizState, title: e.target.value })
        }
        className="mb-3"
      />

      <FormLabel htmlFor="quiz-description">Quiz Instructions/Description</FormLabel>
      <FormControl
        id="quiz-description"
        as="textarea"
        rows={4}
        value={quizState.description}
        onChange={(e) =>
          setQuizState({ ...quizState, description: e.target.value })
        }
        className="mb-3"
      />

      <Row className="mb-3">
        <FormLabel column sm={3}>Quiz Type</FormLabel>
        <Col sm={9}>
          <FormSelect
            value={quizState.quizType}
            onChange={(e) =>
              setQuizState({ ...quizState, quizType: e.target.value })
            }
          >
            <option value="GRADED_QUIZ">Graded Quiz</option>
            <option value="PRACTICE_QUIZ">Practice Quiz</option>
            <option value="GRADED_SURVEY">Graded Survey</option>
            <option value="UNGRADED_SURVEY">Ungraded Survey</option>
          </FormSelect>
        </Col>
      </Row>

      <Row className="mb-3">
        <FormLabel column sm={3}>Assignment Group</FormLabel>
        <Col sm={9}>
          <FormSelect
            value={quizState.assignmentGroup}
            onChange={(e) =>
              setQuizState({ ...quizState, assignmentGroup: e.target.value })
            }
          >
            <option value="QUIZZES">Quizzes</option>
            <option value="EXAMS">Exams</option>
            <option value="ASSIGNMENTS">Assignments</option>
            <option value="PROJECT">Project</option>
          </FormSelect>
        </Col>
      </Row>

      <h5 className="mt-4">Options</h5>

      <FormCheck
        type="checkbox"
        label="Shuffle Answers"
        checked={quizState.shuffleAnswers}
        onChange={(e) =>
          setQuizState({ ...quizState, shuffleAnswers: e.target.checked })
        }
        className="mb-2"
      />

      <Row className="mb-3">
        <FormLabel column sm={3}>Time Limit (Minutes)</FormLabel>
        <Col sm={9}>
          <FormControl
            type="number"
            value={quizState.timeLimit}
            onChange={(e) =>
              setQuizState({ ...quizState, timeLimit: Number(e.target.value) })
            }
          />
        </Col>
      </Row>

      <FormCheck
        type="checkbox"
        label="Allow Multiple Attempts"
        checked={quizState.multipleAttempts}
        onChange={(e) =>
          setQuizState({ ...quizState, multipleAttempts: e.target.checked })
        }
        className="mb-2"
      />

      {quizState.multipleAttempts && (
        <Row className="mb-3">
          <FormLabel column sm={3}>How Many Attempts</FormLabel>
          <Col sm={9}>
            <FormControl
              type="number"
              value={quizState.howManyAttempts}
              onChange={(e) =>
                setQuizState({
                  ...quizState,
                  howManyAttempts: Number(e.target.value),
                })
              }
            />
          </Col>
        </Row>
      )}

      <Row className="mb-3">
        <FormLabel column sm={3}>Show Correct Answers</FormLabel>
        <Col sm={9}>
          <FormControl
            type="text"
            value={quizState.showCorrectAnswers}
            onChange={(e) =>
              setQuizState({ ...quizState, showCorrectAnswers: e.target.value })
            }
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <FormLabel column sm={3}>Access Code</FormLabel>
        <Col sm={9}>
          <FormControl
            type="text"
            value={quizState.accessCode}
            onChange={(e) =>
              setQuizState({ ...quizState, accessCode: e.target.value })
            }
          />
        </Col>
      </Row>

      <FormCheck
        type="checkbox"
        label="One Question at a Time"
        checked={quizState.oneQuestionAtATime}
        onChange={(e) =>
          setQuizState({ ...quizState, oneQuestionAtATime: e.target.checked })
        }
        className="mb-2"
      />

      <FormCheck
        type="checkbox"
        label="Webcam Required"
        checked={quizState.webcamRequired}
        onChange={(e) =>
          setQuizState({ ...quizState, webcamRequired: e.target.checked })
        }
        className="mb-2"
      />

      <FormCheck
        type="checkbox"
        label="Lock Questions After Answering"
        checked={quizState.lockQuestionsAfterAnswering}
        onChange={(e) =>
          setQuizState({
            ...quizState,
            lockQuestionsAfterAnswering: e.target.checked,
          })
        }
        className="mb-3"
      />

      <h5 className="mt-4">Assign</h5>

      <Row className="mb-3">
        <FormLabel column sm={3}>Due</FormLabel>
        <Col sm={9}>
          <FormControl
            type="datetime-local"
            value={quizState.dueDate}
            onChange={(e) =>
              setQuizState({ ...quizState, dueDate: e.target.value })
            }
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <FormLabel column sm={3}>Available from</FormLabel>
        <Col sm={9}>
          <FormControl
            type="datetime-local"
            value={quizState.availableDate}
            onChange={(e) =>
              setQuizState({ ...quizState, availableDate: e.target.value })
            }
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <FormLabel column sm={3}>Until</FormLabel>
        <Col sm={9}>
          <FormControl
            type="datetime-local"
            value={quizState.untilDate}
            onChange={(e) =>
              setQuizState({ ...quizState, untilDate: e.target.value })
            }
          />
        </Col>
      </Row>

      <hr />

      <div className="text-end">
        <Button variant="secondary" className="me-2" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          className="me-2"
          onClick={() => handleSubmit("save")}
        >
          Save
        </Button>
        <Button
          variant="success"
          onClick={() => handleSubmit("saveAndPublish")}
        >
          Save & Publish
        </Button>
      </div>
    </Form>
  );
}
