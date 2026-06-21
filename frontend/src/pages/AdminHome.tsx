import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const AdminHome: React.FC = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: "Upload Syllabus",
      desc: "Upload syllabus PDFs for a department, batch year, and semester.",
      icon: <MenuBookIcon sx={{ fontSize: 22 }} />,
      path: "/admin/syllabus",
      accent: "#6366f1",
    },
    {
      title: "Upload Marksheet",
      desc: "Upload a student's semester marksheet PDF for a college.",
      icon: <AssessmentIcon sx={{ fontSize: 22 }} />,
      path: "/admin/marksheet",
      accent: "#10b981",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)",
        px: 2,
        py: 4,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 520 }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4, justifyContent: "center" }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: "10px",
            background: "linear-gradient(135deg, #6366f1, #10b981)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <SchoolIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#fff", letterSpacing: "-0.3px" }}>
            AcademIQ
          </Typography>
        </Box>

        <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: "#fff", mb: 0.5, textAlign: "center" }}>
          Admin Panel
        </Typography>
        <Typography sx={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", mb: 4, textAlign: "center" }}>
          Choose what you'd like to upload
        </Typography>

        {options.map((opt) => (
          <Paper
            key={opt.path}
            elevation={0}
            onClick={() => navigate(opt.path)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2.5,
              mb: 2,
              cursor: "pointer",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              transition: "all 0.2s ease",
              "&:hover": {
                background: "rgba(255,255,255,0.08)",
                borderColor: opt.accent,
                transform: "translateY(-1px)",
              },
            }}
          >
            <Box sx={{
              width: 44, height: 44, borderRadius: "10px",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              background: `${opt.accent}22`,
              color: opt.accent,
            }}>
              {opt.icon}
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 600, fontSize: "1rem", color: "#fff", mb: 0.3 }}>
                {opt.title}
              </Typography>
              <Typography sx={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                {opt.desc}
              </Typography>
            </Box>

            <ChevronRightIcon sx={{ color: "rgba(255,255,255,0.3)" }} />
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default AdminHome;