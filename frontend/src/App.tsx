import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import MainLayout from "./layout/MainLayout";

import ChatPage from "./pages/ChatPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";

import { ToastContainer } from "react-toastify";
// @ts-ignore
import "react-toastify/dist/ReactToastify.css";
import AdminHome from "./pages/AdminHome";
import AdminSyllabusUpload from "./pages/AdminSyllabusUpload";
import MarksheetHistory from "./pages/MarksheetHistory";
import AdminMarksheetUpload from "./pages/AdminMarksheetUpload";

import StudentHome from "./pages/StudentHome";

import StudentProgress from "./pages/StudentProgress";
import StudentReport from "./pages/StudentReport";


const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#6366f1" },
    background: {
      paper: "#0f1629",
      default: "#0a0e1a",
    },
    text: {
      primary: "#e0e7ff",
      secondary: "rgba(165,180,252,0.55)",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#0f1629",
          border: "1px solid rgba(165,180,252,0.1)",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#111827 !important",
          border: "1px solid rgba(99,102,241,0.2)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: "#e0e7ff",
          "&:hover": {
            backgroundColor: "rgba(99,102,241,0.15)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(99,102,241,0.2)",
            "&:hover": {
              backgroundColor: "rgba(99,102,241,0.25)",
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "#e0e7ff",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(165,180,252,0.2)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(99,102,241,0.5)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#6366f1",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "rgba(165,180,252,0.5)",
          "&.Mui-focused": {
            color: "#818cf8",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: "rgba(165,180,252,0.5)",
        },
      },
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem("user");

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const userString = localStorage.getItem("user");

  if (!userString) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userString);

  return user.role === "ADMIN" ? (
    <>{children}</>
  ) : (
    <Navigate to="/student" replace />
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/chat" element={<ChatPage />} />

            <Route
              path="/student"
              element={
                <ProtectedRoute>
                  <StudentHome />
                </ProtectedRoute>
              }
            />

             <Route
              path="/student/report"
              element={
                // <ProtectedRoute>
                  <StudentReport/>
              //  </ProtectedRoute>
              }
            />


             <Route
              path="/student/progress"
              element={
                // <ProtectedRoute>
                  <StudentProgress />
              //  </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminHome />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/syllabus"
              element={
                <AdminRoute>
                  <AdminSyllabusUpload />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/marksheet"
              element={
                <AdminRoute>
                  <AdminMarksheetUpload />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/marksheet/history"
              element={
                <AdminRoute>
                  <MarksheetHistory />
                </AdminRoute>
              }
            />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
