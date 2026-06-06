

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const uploadSyllabus = (formData: FormData) => {
  return API.post("/admin/upload-syllabus", formData);
};


export const createSession = (session_id: string) => {
  return API.post("/chat-session/create", { session_id });
};

export const getSessions = () => {
  return API.get("/chat-sessions");
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


// AUTH APIs
export const registerUser = (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  return API.post("/auth/register", payload);
};

export const loginUser = (payload: {
  email: string;
  password: string;
}) => {
  return API.post("/auth/login", payload);
};