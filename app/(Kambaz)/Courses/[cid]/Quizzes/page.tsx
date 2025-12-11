"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { Container, ListGroup, Badge, Modal, Button } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { MdQuiz } from "react-icons/md";
import { setQuizzes, deleteQuiz as deleteQuizAction, publishQuiz as publishQuizAction, unpublishQuiz as unpublishQuizAction } from "./reducer";
import * as client from "../../client";
import QuizControls from "./QuizControls";
import QuizControlButtons from "./QuizControlButtons";

const formatDateToMonthDayYear = (dateString: string) => {
  if (!dateString) return "No date set";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getAvailabilityStatus = (quiz: any) => {
  const now = new Date();
  const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
  const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

  if (availableDate && now < availableDate) {
    return `Not available until ${formatDateToMonthDayYear(quiz.availableDate)}`;
  }
  if (untilDate && now > untilDate) {
    return "Closed";
  }
  return "Available";
};

export default function Quizzes() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string>("");

  const { quizzes } = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.quizzesReducer
  );

  const { currentUser } = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.accountReducer
  );

  const isFaculty = currentUser?.role === "FACULTY";
  const isStudent = currentUser?.role === "STUDENT";

  const fetchQuizzes = async () => {
    const quizzes = await client.findQuizzesForCourse(cid as string);
    dispatch(setQuizzes(quizzes));
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDeleteQuiz = async () => {
    await client.deleteQuiz(quizToDelete);
    dispatch(deleteQuizAction({ _id: quizToDelete }));
    setShowDeleteModal(false);
    setQuizToDelete("");
  };

  const handlePublishQuiz = async (quizId: string) => {
    await client.publishQuiz(quizId);
    dispatch(publishQuizAction(quizId));
  };

  const handleUnpublishQuiz = async (quizId: string) => {
    await client.unpublishQuiz(quizId);
    dispatch(unpublishQuizAction(quizId));
  };

  const handleEditQuiz = (quizId: string) => {
    router.push(`/Courses/${cid}/Quizzes/${quizId}/edit`);
  };

  // Filter quizzes based on user role
  const displayedQuizzes = isStudent
    ? quizzes.filter((quiz: any) => quiz.published && quiz.course === cid)
    : quizzes.filter((quiz: any) => quiz.course === cid);

  return (
    <Container id="wd-quizzes">
      <QuizControls />
      {displayedQuizzes.length === 0 ? (
        <div className="text-center p-5">
          <h4>No quizzes available</h4>
          {isFaculty && <p>Click the + Quiz button to create a new quiz</p>}
        </div>
      ) : (
        <ListGroup className="rounded-0">
          <ListGroup.Item className="p-0 mb-5 fs-5 border-gray">
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" /> QUIZZES
            </div>
            <ListGroup className="wd-quiz-list rounded-0">
              {displayedQuizzes.map((quiz: any) => {
                const totalPoints = quiz.questions?.reduce(
                  (sum: number, q: any) => sum + (q.points || 0),
                  0
                ) || 0;
                const questionCount = quiz.questions?.length || 0;

                return (
                  <ListGroup.Item key={quiz._id} className="wd-quiz-item p-3 ps-1">
                    <div className="d-flex align-items-center">
                      <BsGripVertical className="me-2 fs-3" />
                      <MdQuiz className="me-2 fs-3 text-success" />
                      <div className="flex-grow-1 p-1">
                        <Link
                          href={
                            isFaculty
                              ? `/Courses/${cid}/Quizzes/${quiz._id}`
                              : `/Courses/${cid}/Quizzes/${quiz._id}/take`
                          }
                          className="text-decoration-none text-dark fw-bold fs-5"
                        >
                          {quiz.title}
                        </Link>
                        <div className="mt-1">
                          <span className="text-muted me-2">
                            {getAvailabilityStatus(quiz)}
                          </span>
                          {quiz.dueDate && (
                            <>
                              | <strong>Due</strong> {formatDateToMonthDayYear(quiz.dueDate)}
                            </>
                          )}
                          {" | "}
                          {totalPoints} pts | {questionCount} {questionCount === 1 ? "Question" : "Questions"}
                        </div>
                      </div>
                      {isFaculty && (
                        <QuizControlButtons
                          quizId={quiz._id}
                          published={quiz.published}
                          onEdit={handleEditQuiz}
                          onDelete={(id) => {
                            setQuizToDelete(id);
                            setShowDeleteModal(true);
                          }}
                          onPublish={handlePublishQuiz}
                          onUnpublish={handleUnpublishQuiz}
                        />
                      )}
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </ListGroup.Item>
        </ListGroup>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this quiz? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteQuiz}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
