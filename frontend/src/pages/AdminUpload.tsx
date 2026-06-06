
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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

import { uploadSyllabus } from "../services/api";
import {
  DEPARTMENTS,
  BATCH_YEARS,
  SEMESTER_LEVELS,
} from "../constants/academic";

type FormDataType = {
  department: string;
  batch_year: string;
  semester_level: string;
  pdf_file: FileList;
};

const schema = yup.object({
  department: yup.string().required("Department is required"),
  batch_year: yup.string().required("Batch year is required"),
  semester_level: yup.string().required("Semester is required"),
  pdf_file: yup
    .mixed<FileList>()
    .required("Please select a PDF file")
    .test("file", "Please select a PDF file", (value) => value instanceof FileList && value.length > 0)
    .test("pdf", "Only PDF allowed", (value) => !value || value.length === 0 || value[0].type === "application/pdf"),
});

function AdminUpload() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormDataType>({
    resolver: yupResolver(schema),
  });

  const selectedFile = watch("pdf_file");

  const onSubmit = async (data: FormDataType) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("department", data.department);
      formData.append("batch_year", data.batch_year);
      formData.append("semester_level", data.semester_level);
      formData.append("pdf_file", data.pdf_file[0]);
      await uploadSyllabus(formData);
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

        <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: "#fff", mb: 0.5 }}>
          Upload Syllabus
        </Typography>
        <Typography sx={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", mb: 3 }}>
          Upload syllabus PDFs for students
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>

          {/* Department */}
          <TextField
            select
            fullWidth
            label="Department"
            defaultValue=""
            {...register("department")}
            error={!!errors.department}
            helperText={errors.department?.message}
            sx={{ mb: 2, ...inputSx }}
          >
            {DEPARTMENTS.map((d) => (
              <MenuItem key={d} value={d} sx={menuItemSx}>{d}</MenuItem>
            ))}
          </TextField>

          {/* Batch Year */}
          <TextField
            select
            fullWidth
            label="Batch Year"
            defaultValue=""
            {...register("batch_year")}
            error={!!errors.batch_year}
            helperText={errors.batch_year?.message}
            sx={{ mb: 2, ...inputSx }}
          >
            {BATCH_YEARS.map((b) => (
              <MenuItem key={b} value={b} sx={menuItemSx}>{b}</MenuItem>
            ))}
          </TextField>

          {/* Semester */}
          <TextField
            select
            fullWidth
            label="Semester"
            defaultValue=""
            {...register("semester_level")}
            error={!!errors.semester_level}
            helperText={errors.semester_level?.message}
            sx={{ mb: 2, ...inputSx }}
          >
            {SEMESTER_LEVELS.map((s) => (
              <MenuItem key={s} value={s} sx={menuItemSx}>{s}</MenuItem>
            ))}
          </TextField>

          {/* File Upload */}
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

          {/* Submit */}
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
            {loading ? <CircularProgress size={22} sx={{ color: "rgba(255,255,255,0.6)" }} /> : "Upload Syllabus"}
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

export default AdminUpload;