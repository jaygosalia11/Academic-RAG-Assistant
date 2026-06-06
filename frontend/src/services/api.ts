

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const uploadSyllabus = (formData: FormData) => {
  return API.post("/admin/upload-syllabus", formData);
};


export const createSession = (
  session_id: string,
  user_id: number
) => {
  return API.post("/chat-session/create", {
    session_id,
    user_id,
  });
};

export const getSessions = (userId: number) => {
  return API.get(`/chat-sessions/${userId}`);
};

export const chatQuery = (payload: {
  session_id: string;
  question: string;
  department: string;
  batch_year: string;
  semester_level: string;
  user_id: number;
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
  department: string;
  batch: string;
  semester: string;
}) => {
  return API.post("/auth/register", payload);
};

export const loginUser = (payload: {
  email: string;
  password: string;
}) => {
  return API.post("/auth/login", payload);
};