import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const uploadSyllabus = (formData: FormData) => {
  return API.post("/admin/upload-syllabus", formData);
};

export const chatQuery = (
  payload: {
    session_id: string;
    question: string;
    department: string;
    batch_year: string;
    semester_level: string;
  }
) => {
  return API.post("/chat", payload);
};