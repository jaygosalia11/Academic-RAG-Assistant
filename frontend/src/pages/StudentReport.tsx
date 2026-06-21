import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SchoolIcon from "@mui/icons-material/School";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { getStudentMarksheet } from "../services/api";
import { SEMESTERS } from "../constants/academic";

type Subject = {
  course_code: string;
  course_name: string;
  course_credits: number;
  credit_earned: number;
  cmulg: number;
};

type MarksheetData = {
  student_id: number;
  semester: number;
  seat_number: string;
  student_name: string;
  programme_name: string;
  exam_month: string;
  sgpi: number;
  percentage_marks: number;
  subjects: Subject[];
};

const getStudentId = (): number | null => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.id ?? null;
  } catch {
    return null;
  }
};

function StudentReport() {
  const navigate = useNavigate();
  const [semester, setSemester] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [report, setReport] = useState<MarksheetData | null>(null);

  const handleSemesterChange = async (value: number) => {
    setSemester(value);
    setReport(null);
    setFetched(false);

    const studentId = getStudentId();
    if (!studentId || !value) return;

    setLoading(true);
    try {
      const res = await getStudentMarksheet(studentId, value);
      setReport(res.data ?? null);
    } catch (err) {
      console.error(err);
      setReport(null);
    } finally {
      setLoading(false);
      setFetched(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)",
        px: { xs: 2, sm: 4 },
        py: 4,
      }}
    >
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <IconButton
            onClick={() => navigate("/student")}
            sx={{
              color: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "10px",
              "&:hover": { color: "#fff", borderColor: "#10b981", background: "rgba(16,185,129,0.08)" },
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>

          <Box sx={{
            width: 36, height: 36, borderRadius: "10px",
            background: "linear-gradient(135deg, #10b981, #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <SchoolIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "1.3rem", color: "#fff", letterSpacing: "-0.3px" }}>
              Semester Report
            </Typography>
            <Typography sx={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)" }}>
              View your marksheet for any semester
            </Typography>
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: "16px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Semester dropdown */}
          <TextField
            select
            label="Semester"
            value={semester}
            onChange={(e) => handleSemesterChange(Number(e.target.value))}
            sx={{ mb: 3, width: { xs: "100%", sm: 240 }, ...inputSx }}
          >
            {SEMESTERS.map((s) => (
              <MenuItem key={s.value} value={s.value} sx={menuItemSx}>{s.label}</MenuItem>
            ))}
          </TextField>
          {/* Loading */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={28} sx={{ color: "rgba(255,255,255,0.5)" }} />
            </Box>
          )}

          {/* No data */}
          {!loading && fetched && !report && (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.95rem" }}>
                No Data Available
              </Typography>
            </Box>
          )}

          {/* Empty state before any selection */}
          {!loading && !fetched && (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.9rem" }}>
                Select a semester to view your report.
              </Typography>
            </Box>
          )}

          {/* Report */}
          {!loading && report && (
            <>
              {/* Read-only details */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                  mb: 3,
                }}
              >
                <TextField label="Student Name" value={report.student_name} disabled fullWidth sx={readOnlySx} />
                <TextField label="Seat Number" value={report.seat_number} disabled fullWidth sx={readOnlySx} />
                <TextField label="Programme" value={report.programme_name} disabled fullWidth sx={readOnlySx} />
                <TextField label="Exam Month" value={report.exam_month} disabled fullWidth sx={readOnlySx} />
                <TextField label="SGPI" value={report.sgpi} disabled fullWidth sx={readOnlySx} />
                <TextField label="Percentage" value={`${report.percentage_marks}%`} disabled fullWidth sx={readOnlySx} />
              </Box>

              {/* Subjects table */}
              <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", color: "#fff", mb: 1.5 }}>
                Subjects
              </Typography>

              <TableContainer
                sx={{
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  overflow: "hidden",
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ background: "rgba(255,255,255,0.04)" }}>
                      <TableCell sx={headCellSx}>Course Code</TableCell>
                      <TableCell sx={headCellSx}>Course Name</TableCell>
                      <TableCell sx={headCellSx} align="center">Credits</TableCell>
                      <TableCell sx={headCellSx} align="center">Credits Earned</TableCell>
                      <TableCell sx={headCellSx} align="center">CMULG</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {report.subjects.map((sub) => (
                      <TableRow
                        key={sub.course_code}
                        sx={{
                          "&:hover": { background: "rgba(16,185,129,0.06)" },
                          "&:last-child td": { borderBottom: 0 },
                        }}
                      >
                        <TableCell sx={bodyCellSx}>{sub.course_code}</TableCell>
                        <TableCell sx={bodyCellSx}>{sub.course_name}</TableCell>
                        <TableCell sx={bodyCellSx} align="center">{sub.course_credits}</TableCell>
                        <TableCell sx={bodyCellSx} align="center">{sub.credit_earned}</TableCell>
                        <TableCell sx={bodyCellSx} align="center">{sub.cmulg}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* AI generated note */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, mt: 2.5 }}>
                <InfoOutlinedIcon sx={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }} />
                <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>
                  This report is AI-generated and may contain inaccuracies.
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    color: "#fff",
    background: "rgba(255,255,255,0.04)",
    "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
    "&:hover fieldset": { borderColor: "rgba(16,185,129,0.5)" },
    "&.Mui-focused fieldset": { borderColor: "#10b981" },
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.4)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#6ee7b7" },
  "& .MuiSelect-icon": { color: "rgba(255,255,255,0.4)" },
};

const readOnlySx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    color: "rgba(255,255,255,0.8)",
    background: "rgba(255,255,255,0.03)",
    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.35)" },
  "& .Mui-disabled": { WebkitTextFillColor: "rgba(255,255,255,0.8) !important" },
};

const menuItemSx = {
  background: "#1a1a2e",
  color: "#fff",
  "&:hover": { background: "rgba(16,185,129,0.15)" },
  "&.Mui-selected": { background: "rgba(16,185,129,0.2)" },
};

const headCellSx = {
  color: "rgba(255,255,255,0.55)",
  fontWeight: 600,
  fontSize: "0.78rem",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
};

const bodyCellSx = {
  color: "rgba(255,255,255,0.85)",
  fontSize: "0.82rem",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};

export default StudentReport;