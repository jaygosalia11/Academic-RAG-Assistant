

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const uploadSyllabus = (formData: FormData) => {
  return API.post("/admin/upload-syllabus", formData);
};

export const chatQuery = (payload: {
  session_id: string;
  question: string;
  department: string;
  batch_year: string;
  semester_level: string;
}) => {
  return API.post("/chat", payload);
};

export const getChatHistory = (sessionId: string) => {
  return API.get(`/chat-history/${sessionId}`);
};

export const getSessions = () => {
  return API.get("/chat-sessions");
};

export const createSession = (session_id: string) => {
  return API.post("/chat-session/create", { session_id });
};