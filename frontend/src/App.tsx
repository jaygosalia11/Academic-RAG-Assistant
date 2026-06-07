
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import MainLayout from "./layout/MainLayout";

import AdminUpload from "./pages/AdminUpload";
import ChatPage from "./pages/ChatPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";

import { ToastContainer } from "react-toastify";
// @ts-ignore
import "react-toastify/dist/ReactToastify.css";

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

const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = localStorage.getItem("user");

  return user ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
      />

      <BrowserRouter>
        <MainLayout>
          <Routes>

            {/* Landing Page */}
            <Route
              path="/"
              element={<LandingPage />}
            />

            {/* Login */}
            <Route
              path="/login"
              element={<Login />}
            />

            {/* Register */}
            <Route
              path="/register"
              element={<Register />}
            />

            {/* Protected Chat */}
            <Route
              path="/chat"
              element={
                // <ProtectedRoute>
                  <ChatPage />
                //  </ProtectedRoute> 
              }
            />

            {/* Protected Admin */}
            <Route
              path="/admin"
              element={
                // <ProtectedRoute>
                  <AdminUpload />
              //  </ProtectedRoute>
              }
            />

          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;