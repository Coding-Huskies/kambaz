"use client";

import { useParams, useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa6";
import { IoEllipsisVertical } from "react-icons/io5";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function QuizControls() {
  const { cid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.accountReducer
  );

  const isFaculty = currentUser?.role === "FACULTY";

  return (
    isFaculty && (
      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="danger"
          id="wd-add-quiz"
          className="me-2"
          onClick={() => router.push(`/Courses/${cid}/Quizzes/new/edit`)}
        >
          <FaPlus className="me-2" />
          Quiz
        </Button>
        <Button variant="secondary" id="wd-quiz-options">
          <IoEllipsisVertical />
        </Button>
      </div>
    )
  );
}
