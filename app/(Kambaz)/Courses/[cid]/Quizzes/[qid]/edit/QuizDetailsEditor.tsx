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
        onChange={(e) => setQuizState({ ...quizState, title: e.target.value })}
        className="mb-3"
      />

      <FormLabel htmlFor="quiz-description">
        Quiz Instructions/Description
      </FormLabel>
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
        <FormLabel column sm={3}>
          Quiz Type
        </FormLabel>
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
        <FormLabel column sm={3}>
          Assignment Group
        </FormLabel>
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
      <div className="border rounded p-3">
        <FormCheck
          type="checkbox"
          label="Shuffle Answers"
          checked={quizState.shuffleAnswers}
          onChange={(e) =>
            setQuizState({ ...quizState, shuffleAnswers: e.target.checked })
          }
          className="mb-2"
        />

        <div className="mb-2 d-flex align-items-center">
          <FormCheck
            type="checkbox"
            label="Time Limit"
            checked={quizState.timeLimitEnabled}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setQuizState({
                ...quizState,
                timeLimitEnabled: isChecked,
                timeLimit: isChecked ? 20 : quizState.timeLimit,
              });
            }}
            className="me-3"
          />
          {quizState.timeLimitEnabled && (
            <div className="d-flex align-items-center">
              <FormControl
                type="number"
                value={quizState.timeLimit}
                onChange={(e) =>
                  setQuizState({
                    ...quizState,
                    timeLimit: Number(e.target.value),
                  })
                }
                style={{ width: "80px" }}
                className="me-2"
              />
              <span>Minutes</span>
            </div>
          )}
        </div>

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
            <FormLabel column sm={3}>
              How Many Attempts
            </FormLabel>
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
          <FormLabel column sm={3}>
            Show Correct Answers
          </FormLabel>
          <Col sm={9}>
            <FormSelect
              value={quizState.showCorrectAnswersOption || "Immediately"}
              onChange={(e) =>
                setQuizState({
                  ...quizState,
                  showCorrectAnswersOption: e.target.value,
                  showCorrectAnswers:
                    e.target.value === "Immediately"
                      ? "Immediately"
                      : quizState.showCorrectAnswers,
                })
              }
              className="mb-2"
            >
              <option value="Immediately">Immediately</option>
              <option value="CustomDate">On a specific date</option>
            </FormSelect>
            {quizState.showCorrectAnswersOption === "CustomDate" && (
              <FormControl
                type="datetime-local"
                value={quizState.showCorrectAnswers}
                onChange={(e) =>
                  setQuizState({
                    ...quizState,
                    showCorrectAnswers: e.target.value,
                  })
                }
              />
            )}
          </Col>
        </Row>

        <Row className="mb-3">
          <FormLabel column sm={3}>
            Access Code
          </FormLabel>
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

        <Row className="mb-3">
          <FormLabel column sm={4}>
            One Question at a Time
          </FormLabel>
          <Col sm={8}>
            <div className="d-flex gap-3">
              <FormCheck
                type="radio"
                label="Yes"
                name="oneQuestionAtATime"
                checked={quizState.oneQuestionAtATime === true}
                onChange={() =>
                  setQuizState({ ...quizState, oneQuestionAtATime: true })
                }
              />
              <FormCheck
                type="radio"
                label="No"
                name="oneQuestionAtATime"
                checked={quizState.oneQuestionAtATime === false}
                onChange={() =>
                  setQuizState({ ...quizState, oneQuestionAtATime: false })
                }
              />
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <FormLabel column sm={4}>
            Webcam Required
          </FormLabel>
          <Col sm={8}>
            <div className="d-flex gap-3">
              <FormCheck
                type="radio"
                label="Yes"
                name="webcamRequired"
                checked={quizState.webcamRequired === true}
                onChange={() =>
                  setQuizState({ ...quizState, webcamRequired: true })
                }
              />
              <FormCheck
                type="radio"
                label="No"
                name="webcamRequired"
                checked={quizState.webcamRequired === false}
                onChange={() =>
                  setQuizState({ ...quizState, webcamRequired: false })
                }
              />
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <FormLabel column sm={4}>
            Lock Questions After Answering
          </FormLabel>
          <Col sm={8}>
            <div className="d-flex gap-3">
              <FormCheck
                type="radio"
                label="Yes"
                name="lockQuestionsAfterAnswering"
                checked={quizState.lockQuestionsAfterAnswering === true}
                onChange={() =>
                  setQuizState({
                    ...quizState,
                    lockQuestionsAfterAnswering: true,
                  })
                }
              />
              <FormCheck
                type="radio"
                label="No"
                name="lockQuestionsAfterAnswering"
                checked={quizState.lockQuestionsAfterAnswering === false}
                onChange={() =>
                  setQuizState({
                    ...quizState,
                    lockQuestionsAfterAnswering: false,
                  })
                }
              />
            </div>
          </Col>
        </Row>
      </div>

      <br />

      <Row className="mb-3">
        <FormLabel column sm={3}>
          Assign
        </FormLabel>
        <Col sm={9}>
          <div className="border rounded p-3">
            <div className="mb-3">
              <FormLabel>
                <strong>Due</strong>
              </FormLabel>
              <FormControl
                type="datetime-local"
                value={quizState.dueDate}
                onChange={(e) =>
                  setQuizState({ ...quizState, dueDate: e.target.value })
                }
              />
            </div>

            <Row>
              <Col sm={6}>
                <FormLabel>
                  <strong>Available from</strong>
                </FormLabel>
                <FormControl
                  type="datetime-local"
                  value={quizState.availableDate}
                  onChange={(e) =>
                    setQuizState({
                      ...quizState,
                      availableDate: e.target.value,
                    })
                  }
                />
              </Col>
              <Col sm={6}>
                <FormLabel>
                  <strong>Until</strong>
                </FormLabel>
                <FormControl
                  type="datetime-local"
                  value={quizState.untilDate}
                  onChange={(e) =>
                    setQuizState({ ...quizState, untilDate: e.target.value })
                  }
                />
              </Col>
            </Row>
          </div>
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
