

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
  college_id: number;

}) => {
  return API.post("/auth/register", payload);
};

export const loginUser = (payload: {
  email: string;
  password: string;
}) => {
  return API.post("/auth/login", payload);
};

export const uploadMarksheet = (formData: FormData) => {
  return API.post("/admin/upload-marksheet", formData);
};


export const getAllMarksheets = () => {
  return API.get("/admin/marksheets");
};


export const getStudentMarksheet = (
  studentId: number,
  semester: number
) => {
  return API.get(`/students/${studentId}/marksheets/${semester}`);
};


export const getDashboardSummary = (collegeId: number) => {
  return API.get(`/admin/dashboard/summary/${collegeId}`);
};

export const getColleges = () => {
  return API.get("/colleges");
};


export const getTotalCredits = (studentId: number) => {
  return API.get(`/students/${studentId}/total-credits`);
};


export const getCreditsHistory = (studentId: number) => {
  return API.get(`/students/${studentId}/credits-history`);
};

export const getSgpiHistory = (studentId: number) => {
  return API.get(`/students/${studentId}/sgpi-history`);
};