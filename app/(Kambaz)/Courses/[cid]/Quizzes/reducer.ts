import { createSlice } from "@reduxjs/toolkit";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initialState: { quizzes: any[] } = {
  quizzes: [],
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes(state, action) {
      state.quizzes = action.payload;
    },
    addQuiz(state, action) {
      state.quizzes.push(action.payload);
    },
    updateQuiz(state, action) {
      const index = state.quizzes.findIndex(
        (quiz) => quiz._id === action.payload._id
      );
      if (index !== -1) {
        state.quizzes[index] = action.payload;
      }
    },
    deleteQuiz(state, action) {
      state.quizzes = state.quizzes.filter(
        (quiz) => quiz._id !== action.payload._id
      );
    },
    publishQuiz(state, action) {
      const index = state.quizzes.findIndex(
        (quiz) => quiz._id === action.payload
      );
      if (index !== -1) {
        state.quizzes[index].published = true;
      }
    },
    unpublishQuiz(state, action) {
      const index = state.quizzes.findIndex(
        (quiz) => quiz._id === action.payload
      );
      if (index !== -1) {
        state.quizzes[index].published = false;
      }
    },
  },
});

export const {
  setQuizzes,
  addQuiz,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
  unpublishQuiz,
} = quizzesSlice.actions;

export default quizzesSlice.reducer;
