"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Tabs, Tab } from "react-bootstrap";
import * as client from "../../../../client";
import QuizDetailsEditor from "./QuizDetailsEditor";
import QuizQuestionsEditor from "./QuizQuestionsEditor";

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (qid && qid !== "new") {
        try {
          const quizData = await client.findQuizById(qid as string);
          setQuiz(quizData);
        } catch (error) {
          console.error("Error fetching quiz:", error);
        }
      } else {
        // New quiz with default values
        setQuiz({
          _id: "new",
          course: cid,
          title: "Unnamed Quiz",
          description: "",
          quizType: "GRADED_QUIZ",
          points: 0,
          assignmentGroup: "QUIZZES",
          shuffleAnswers: true,
          timeLimit: 20,
          multipleAttempts: false,
          howManyAttempts: 1,
          showCorrectAnswers: "Immediately",
          accessCode: "",
          oneQuestionAtATime: true,
          webcamRequired: false,
          lockQuestionsAfterAnswering: false,
          dueDate: "",
          availableDate: "",
          untilDate: "",
          published: false,
          questions: [],
        });
      }
      setLoading(false);
    };
    fetchQuiz();
  }, [qid, cid]);

  const handleSave = async (quizData: any, navigate: boolean = true) => {
    try {
      if (qid === "new") {
        const newQuiz = await client.createQuizForCourse(cid as string, quizData);
        setQuiz(newQuiz);
        if (navigate) {
          router.push(`/Courses/${cid}/Quizzes/${newQuiz._id}/edit`);
        }
        return newQuiz;
      } else {
        await client.updateQuiz({ ...quizData, _id: qid });
        setQuiz(quizData);
        if (navigate) {
          router.push(`/Courses/${cid}/Quizzes`);
        }
        return quizData;
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
      throw error;
    }
  };

  const handleSaveAndPublish = async (quizData: any) => {
    try {
      const savedQuiz = await handleSave(quizData, false);
      await client.publishQuiz(savedQuiz._id);
      router.push(`/Courses/${cid}/Quizzes`);
    } catch (error) {
      console.error("Error saving and publishing quiz:", error);
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Quizzes`);
  };

  if (loading) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>
          {qid === "new" ? "Create Quiz" : "Edit Quiz"}
          <span className="text-muted ms-3 fs-6">
            Points {quiz?.questions?.reduce((sum: number, q: any) => sum + (q.points || 0), 0) || 0}
          </span>
        </h3>
        <div>
          {quiz?.published ? (
            <span className="badge bg-success">Published</span>
          ) : (
            <span className="badge bg-secondary">Not Published</span>
          )}
        </div>
      </div>

      <Tabs
        id="quiz-editor-tabs"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || "details")}
        className="mb-3"
      >
        <Tab eventKey="details" title="Details">
          <QuizDetailsEditor
            quiz={quiz}
            onSave={handleSave}
            onSaveAndPublish={handleSaveAndPublish}
            onCancel={handleCancel}
          />
        </Tab>
        <Tab eventKey="questions" title="Questions">
          <QuizQuestionsEditor
            quiz={quiz}
            setQuiz={setQuiz}
            onSave={handleSave}
            onSaveAndPublish={handleSaveAndPublish}
            onCancel={handleCancel}
          />
        </Tab>
      </Tabs>
    </Container>
  );
}
