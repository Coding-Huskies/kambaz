"use client";

import { IoEllipsisVertical } from "react-icons/io5";
import { FaCheckCircle, FaBan } from "react-icons/fa";
import { Dropdown } from "react-bootstrap";

export default function QuizControlButtons({
  quizId,
  published,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  onCopy,
}: {
  quizId: string;
  published: boolean;
  onEdit: (quizId: string) => void;
  onDelete: (quizId: string) => void;
  onPublish: (quizId: string) => void;
  onUnpublish: (quizId: string) => void;
  onCopy: (quizId: string) => void;
}) {
  return (
    <div className="d-flex align-items-center gap-2">
      {published ? (
        <FaCheckCircle
          className="text-success fs-5"
          style={{ cursor: "pointer" }}
          onClick={() => onUnpublish(quizId)}
          title="Published - Click to unpublish"
        />
      ) : (
        <FaBan
          className="text-muted fs-5"
          style={{ cursor: "pointer" }}
          onClick={() => onPublish(quizId)}
          title="Unpublished - Click to publish"
        />
      )}
      <Dropdown>
        <Dropdown.Toggle
          variant="link"
          className="text-dark p-0 border-0"
          style={{ boxShadow: "none" }}
        >
          <IoEllipsisVertical className="fs-4" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => onEdit(quizId)}>Edit</Dropdown.Item>
          <Dropdown.Item onClick={() => onCopy(quizId)}>Copy</Dropdown.Item>
          <Dropdown.Item onClick={() => onDelete(quizId)}>Delete</Dropdown.Item>
          <Dropdown.Item onClick={() => (published ? onUnpublish(quizId) : onPublish(quizId))}>
            {published ? "Unpublish" : "Publish"}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
