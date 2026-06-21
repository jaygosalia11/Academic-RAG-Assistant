
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import SchoolIcon from "@mui/icons-material/School";
import HistoryIcon from "@mui/icons-material/History";

import { uploadMarksheet } from "../services/api";
import { COLLEGES } from "../constants/academic";

type FormDataType = {
  student_id: number;
  semester: number;
  college_id: number;
  academic_year: string;
  pdf_file: FileList;
};

const schema = yup.object({
  student_id: yup
    .number()
    .typeError("Student ID is required")
    .required("Student ID is required")
    .positive("Student ID must be a positive number")
    .integer("Student ID must be a whole number"),
  semester: yup
    .number()
    .typeError("Semester is required")
    .required("Semester is required")
    .positive("Semester must be a positive number")
    .integer("Semester must be a whole number"),
  college_id: yup
    .number()
    .typeError("College is required")
    .required("College is required"),
  academic_year: yup.string().required("Academic year is required"),
  pdf_file: yup
    .mixed<FileList>()
    .required("Please select a PDF file")
    .test("file", "Please select a PDF file", (value) => value instanceof FileList && value.length > 0)
    .test("pdf", "Only PDF allowed", (value) => !value || value.length === 0 || value[0].type === "application/pdf"),
});

function AdminMarksheetUpload() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

const isAdmin = user.role === "ADMIN";
const collegeId = user.college_id || "";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormDataType>({
    resolver: yupResolver(schema),
  defaultValues: {
    college_id: collegeId,
  },
});

  const selectedFile = watch("pdf_file");

  useEffect(() => {
  if (isAdmin && collegeId) {
    setValue("college_id", collegeId);
  }
}, [isAdmin, collegeId, setValue]);

  const onSubmit = async (data: FormDataType) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("student_id", String(data.student_id));
      formData.append("semester", String(data.semester));
      formData.append("college_id", String(data.college_id));
      formData.append("academic_year", data.academic_year);
      formData.append("pdf_file", data.pdf_file[0]);
      await uploadMarksheet(formData);
      alert("Upload successful ✔");
      reset();
    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

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
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          width: "100%",
          maxWidth: 520,
          borderRadius: "16px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: "10px",
            background: "linear-gradient(135deg, #10b981, #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <SchoolIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#fff", letterSpacing: "-0.3px" }}>
            AcademIQ
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: "#fff", mb: 0.5 }}>
              Upload Marksheet
            </Typography>
            <Typography sx={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)" }}>
              Upload semester marksheet PDFs for students
            </Typography>
          </Box>

          <Button
            size="small"
            startIcon={<HistoryIcon sx={{ fontSize: 18 }} />}
            onClick={() => navigate("/admin/marksheet/history")}
            sx={{
              flexShrink: 0,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.65)",
              borderRadius: "8px",
              px: 1.5,
              "&:hover": { color: "#fff", background: "rgba(16,185,129,0.1)" },
            }}
          >
            History
          </Button>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>

          {/* Student ID */}
          <TextField
            fullWidth
            type="number"
            label="Student ID"
            {...register("student_id")}
            error={!!errors.student_id}
            helperText={errors.student_id?.message}
            sx={{ mb: 2, ...inputSx }}
          />

          {/* Semester */}
          <TextField
            fullWidth
            type="number"
            label="Semester"
            {...register("semester")}
            error={!!errors.semester}
            helperText={errors.semester?.message}
            sx={{ mb: 2, ...inputSx }}
          />

   
          <TextField
  select
  fullWidth
  label="College"
  {...register("college_id")}
  value={watch("college_id") || ""}
  disabled={isAdmin}
  error={!!errors.college_id}
  helperText={
    errors.college_id?.message ||
    (isAdmin ? "Assigned college" : "")
  }
  sx={{ mb: 2, ...inputSx }}
>
  {COLLEGES.map((c) => (
    <MenuItem
      key={c.id}
      value={c.id}
      sx={menuItemSx}
    >
      {c.college_name}
    </MenuItem>
  ))}
</TextField>

          <TextField
            fullWidth
            label="Academic Year"
            placeholder="e.g. 2023-2024"
            {...register("academic_year")}
            error={!!errors.academic_year}
            helperText={errors.academic_year?.message}
            sx={{ mb: 2, ...inputSx }}
          />


          <Button
            component="label"
            variant="outlined"
            fullWidth
            startIcon={<UploadFileIcon />}
            sx={{
              height: 52,
              mb: 1,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.9rem",
              borderColor: "rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.6)",
              "&:hover": {
                borderColor: "rgba(16,185,129,0.5)",
                background: "rgba(16,185,129,0.05)",
                color: "#fff",
              },
            }}
          >
            Choose PDF File
            <input
              hidden
              type="file"
              accept=".pdf"
              onChange={(e) => {
                if (e.target.files) setValue("pdf_file", e.target.files);
              }}
            />
          </Button>

          {selectedFile && selectedFile.length > 0 && (
            <Typography sx={{ fontSize: "0.8rem", color: "#6ee7b7", mb: 0.5 }}>
              📄 {selectedFile[0].name}
            </Typography>
          )}

          {errors.pdf_file && (
            <Typography sx={{ fontSize: "0.75rem", color: "#f87171", mb: 1 }}>
              {errors.pdf_file.message}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.4,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              background: "linear-gradient(135deg, #10b981, #059669)",
              boxShadow: "0 4px 16px rgba(16,185,129,0.35)",
              "&:hover": {
                background: "linear-gradient(135deg, #34d399, #10b981)",
                boxShadow: "0 6px 20px rgba(16,185,129,0.45)",
              },
              "&:disabled": { background: "rgba(16,185,129,0.2)", color: "rgba(255,255,255,0.3)" },
            }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: "rgba(255,255,255,0.6)" }} /> : "Upload Marksheet"}
          </Button>
        </Box>
      </Paper>
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
  "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
  "& .MuiSelect-icon": { color: "rgba(255,255,255,0.4)" },
};

const menuItemSx = {
  background: "#1a1a2e",
  color: "#fff",
  "&:hover": { background: "rgba(16,185,129,0.15)" },
  "&.Mui-selected": { background: "rgba(16,185,129,0.2)" },
};

export default AdminMarksheetUpload;