
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SchoolIcon from "@mui/icons-material/School";
import { loginUser } from "../services/api";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Min 6 characters").required("Password is required"),
});

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

const onSubmit = async (data: FormData) => {
  try {
    const res = await loginUser({
      email: data.email,
      password: data.password,
    });

    console.log("Login success:", res.data);

localStorage.setItem(
  "user",
  JSON.stringify(res.data.user)
);

    navigate("/chat");
  } catch (err) {
    console.error("Login failed", err);
    alert("Invalid credentials");
  }
};

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)",
        px: 2,
        py: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          width: "100%",
          maxWidth: 420,
          borderRadius: "16px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #10b981, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SchoolIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>

          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#fff",
              letterSpacing: "-0.3px",
            }}
          >
            AcademIQ
          </Typography>
        </Box>

        {/* Heading */}
        <Typography
          sx={{ fontWeight: 700, fontSize: "1.5rem", color: "#fff", mb: 0.5 }}
        >
          Welcome back
        </Typography>

        <Typography
          sx={{
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.45)",
            mb: 3,
          }}
        >
          Sign in to continue
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* EMAIL */}
          <TextField
            fullWidth
            label="Email"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 2, ...inputSx }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPwd ? "text" : "password"}
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{ mb: 3, ...inputSx }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPwd(!showPwd)}
                      edge="end"
                      sx={{
                        color: "rgba(255,255,255,0.4)",
                        "&:hover": { color: "#fff" },
                      }}
                    >
                      {showPwd ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

     
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              py: 1.4,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
              "&:hover": {
                background: "linear-gradient(135deg, #818cf8, #6366f1)",
                boxShadow: "0 6px 20px rgba(99,102,241,0.45)",
              },
            }}
          >
            Sign In
          </Button>
        </form>

 
        <Typography
          sx={{
            mt: 2.5,
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.4)",
            textAlign: "center",
          }}
        >
          No account?{" "}
          <Box
            component="span"
            onClick={() => navigate("/register")}
            sx={{
              color: "#6ee7b7",
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": { color: "#a7f3d0" },
            }}
          >
            Create one
          </Box>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;


const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    color: "#fff",
    background: "rgba(255,255,255,0.04)",
    "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
    "&:hover fieldset": { borderColor: "rgba(99,102,241,0.5)" },
    "&.Mui-focused fieldset": { borderColor: "#6366f1" },
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.4)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#818cf8" },
  "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
};