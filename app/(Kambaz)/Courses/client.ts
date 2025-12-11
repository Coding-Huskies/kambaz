/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const USERS_API = `${HTTP_SERVER}/api/users`;
const MODULES_API = `${HTTP_SERVER}/api/modules`;
const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;
const ENROLLMENTS_API = `${HTTP_SERVER}/api/enrollments`;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;
const ATTEMPTS_API = `${HTTP_SERVER}/api/attempts`;

export const deleteModule = async (courseId: string, moduleId: string) => {
 const response = await axios.delete(`${COURSES_API}/${courseId}/modules/${moduleId}`);
 return response.data;
};

export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};

export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(`${USERS_API}/current/courses/current/courses/`);
  return data;
};

export const createCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.post(`${USERS_API}/current/courses`, course);
  return data;
};
export const deleteCourse = async (id: string) => {
  const { data } = await axios.delete(`${COURSES_API}/${id}`);
  return data;
};
export const updateCourse = async (course: any) => {
  const { data } = await axios.put(`${COURSES_API}/${course._id}`, course);
  return data;
};

export const findModulesForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/modules`);
  return response.data;
};
export const createModuleForCourse = async (courseId: string, module: any) => {
  const response = await axios.post(
    `${COURSES_API}/${courseId}/modules`,
    module
  );
  return response.data;
};

export const updateModule = async (courseId: string, module: any) => {
  const { data } = await axios.put(`${COURSES_API}/${courseId}/modules/${module._id}`, module);
  return data;
};

export const findAssignmentsForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/assignments`);
  return response.data;
};

export const createAssignmentForCourse = async (courseId: string, assignment: any) => {
  const response = await axios.post(`${COURSES_API}/${courseId}/assignments`, assignment);
  return response.data;
};


export const updateAssignment = async (assignment: any) => {
  const { data } = await axios.put(`${ASSIGNMENTS_API}/${assignment._id}`, assignment);
  return data;
};

export const deleteAssignment = async (assignmentId: string) => {
  const response = await axios.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
  return response.data;
};

export const enrollInCourse = async (userId: string, courseId: string) => {
  const { data } = await axios.post(
    `${ENROLLMENTS_API}/users/${userId}/courses/${courseId}`
  );
  return data;
};

export const enrollIntoCourse = async (userId: string, courseId: string) => {
 const response = await axiosWithCredentials.post(`${USERS_API}/${userId}/courses/${courseId}`);
 return response.data;
};

export const unenrollFromTheCourse = async (userId: string, courseId: string) => {
 const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}/courses/${courseId}`);
 return response.data;
};

export const unenrollFromCourse = async (enrollmentId: string) => {
  const { data } = await axios.delete(
    `${ENROLLMENTS_API}/${enrollmentId}`
  );
  return data;
};

export const findUsersForCourse = async (courseId: string) => {
 const response = await axios.get(`${COURSES_API}/${courseId}/users`);
 return response.data;
};

export const findEnrollmentsForUser = async (userId: string) => {
  const { data } = await axios.get(
    `${ENROLLMENTS_API}/users/${userId}`
  );
  return data;
};

// Quiz CRUD operations
export const findQuizzesForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/quizzes`);
  return response.data;
};

export const findQuizById = async (quizId: string) => {
  const response = await axios.get(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

export const createQuizForCourse = async (courseId: string, quiz: any) => {
  const response = await axios.post(`${COURSES_API}/${courseId}/quizzes`, quiz);
  return response.data;
};

export const updateQuiz = async (quiz: any) => {
  const { data } = await axios.put(`${QUIZZES_API}/${quiz._id}`, quiz);
  return data;
};

export const deleteQuiz = async (quizId: string) => {
  const response = await axios.delete(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

export const publishQuiz = async (quizId: string) => {
  const response = await axios.put(`${QUIZZES_API}/${quizId}/publish`);
  return response.data;
};

export const unpublishQuiz = async (quizId: string) => {
  const response = await axios.put(`${QUIZZES_API}/${quizId}/unpublish`);
  return response.data;
};

// Question CRUD operations
export const addQuestion = async (quizId: string, question: any) => {
  const response = await axios.post(`${QUIZZES_API}/${quizId}/questions`, question);
  return response.data;
};

export const updateQuestion = async (quizId: string, questionId: string, question: any) => {
  const response = await axios.put(`${QUIZZES_API}/${quizId}/questions/${questionId}`, question);
  return response.data;
};

export const deleteQuestion = async (quizId: string, questionId: string) => {
  const response = await axios.delete(`${QUIZZES_API}/${quizId}/questions/${questionId}`);
  return response.data;
};

// Quiz Attempts operations
export const findAttemptsForQuiz = async (quizId: string, userId: string) => {
  const response = await axios.get(`${QUIZZES_API}/${quizId}/attempts?userId=${userId}`);
  return response.data;
};

export const findAttemptById = async (attemptId: string) => {
  const response = await axios.get(`${ATTEMPTS_API}/${attemptId}`);
  return response.data;
};

export const createAttempt = async (quizId: string, attempt: any) => {
  const response = await axios.post(`${QUIZZES_API}/${quizId}/attempts`, attempt);
  return response.data;
};

export const updateAttempt = async (attemptId: string, attempt: any) => {
  const response = await axios.put(`${ATTEMPTS_API}/${attemptId}`, attempt);
  return response.data;
};

export const getLatestAttempt = async (quizId: string, userId: string) => {
  const response = await axios.get(`${QUIZZES_API}/${quizId}/attempts/latest?userId=${userId}`);
  return response.data;
};