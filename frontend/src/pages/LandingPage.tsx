import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)",
      color: "#fff",
    }}>

  
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: { xs: 3, sm: 6 },
        py: 2.5,
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{
            width: 32, height: 32, borderRadius: "8px",
            background: "linear-gradient(135deg, #6366f1, #10b981)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <SchoolIcon sx={{ color: "#fff", fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#fff" }}>
            AcademIQ
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate("/login")}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              borderColor: "rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.75)",
              px: 2,
              "&:hover": { borderColor: "#6366f1", color: "#fff", background: "rgba(99,102,241,0.1)" },
            }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate("/register")}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              px: 2,
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
              "&:hover": { background: "linear-gradient(135deg, #818cf8, #6366f1)" },
            }}
          >
            Register
          </Button>
        </Box>
      </Box>

      {/* Hero */}
      <Box sx={{
        maxWidth: 680,
        mx: "auto",
        px: { xs: 3, sm: 4 },
        pt: { xs: 8, sm: 12 },
        pb: 6,
        textAlign: "center",
      }}>
        <Typography sx={{
          fontWeight: 800,
          fontSize: { xs: "2.2rem", sm: "3rem" },
          lineHeight: 1.15,
          letterSpacing: "-1px",
          mb: 2,
        }}>
          Your Smart Academic Advisor 🎓
        </Typography>

        <Typography sx={{
          fontSize: { xs: "1rem", sm: "1.1rem" },
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.8,
          mb: 6,
        }}>
          Get instant answers from your syllabus, course materials, and academic resources — powered by AI.
        </Typography>

        {/* Feature cards */}
        {[
          { emoji: "📚", title: "Syllabus Search", desc: "Ask anything about your syllabus and get pinpoint answers instantly." },
          { emoji: "🤖", title: "AI-Powered Answers", desc: "Powered by local AI — your academic data stays private and secure." },
          { emoji: "🎯", title: "Department Filtered", desc: "Filter by department, batch year, and semester for accurate results." },
          { emoji: "💬", title: "Chat History", desc: "All your previous conversations saved and easy to revisit anytime." },
        ].map((f) => (
          <Box key={f.title} sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 2,
            mb: 3,
            p: 2.5,
            borderRadius: "12px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            textAlign: "left",
          }}>
            <Typography sx={{ fontSize: "1.6rem", lineHeight: 1, mt: 0.2 }}>{f.emoji}</Typography>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", color: "#fff", mb: 0.4 }}>
                {f.title}
              </Typography>
              <Typography sx={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                {f.desc}
              </Typography>
            </Box>
          </Box>
        ))}

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/register")}
          sx={{
            mt: 2,
            px: 5,
            py: 1.5,
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
            "&:hover": {
              background: "linear-gradient(135deg, #818cf8, #6366f1)",
              boxShadow: "0 6px 24px rgba(99,102,241,0.5)",
            },
          }}
        >
          Get Started →
        </Button>
      </Box>
    </Box>
  );
};

export default LandingPage;