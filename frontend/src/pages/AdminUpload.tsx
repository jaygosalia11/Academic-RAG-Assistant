

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
  department: yup.string().required(),
  batch_year: yup.string().required(),
  semester_level: yup.string().required(),
  pdf_file: yup
    .mixed<FileList>()
    .required("Please select a PDF file")
    .test(
      "file",
      "Please select a PDF file",
      (value) => value instanceof FileList && value.length > 0
    )
    .test(
      "pdf",
      "Only PDF allowed",
      (value) =>
        !value ||
        value.length === 0 ||
        value[0].type === "application/pdf"
    ),
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
    console.log("SUBMIT TRIGGERED", data); // DEBUG

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
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 5 }}>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Upload Syllabus
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Upload syllabus PDFs for students
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          
          {/* Department */}
          <TextField
            select
            fullWidth
            label="Department"
            sx={{ mb: 3 }}
            defaultValue=""
            {...register("department")}
            error={!!errors.department}
            helperText={errors.department?.message}
          >
            {DEPARTMENTS.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </TextField>

          {/* Batch */}
          <TextField
            select
            fullWidth
            label="Batch Year"
            sx={{ mb: 3 }}
            defaultValue=""
            {...register("batch_year")}
            error={!!errors.batch_year}
            helperText={errors.batch_year?.message}
          >
            {BATCH_YEARS.map((b) => (
              <MenuItem key={b} value={b}>
                {b}
              </MenuItem>
            ))}
          </TextField>

          {/* Semester */}
          <TextField
            select
            fullWidth
            label="Semester"
            sx={{ mb: 3 }}
            defaultValue=""
            {...register("semester_level")}
            error={!!errors.semester_level}
            helperText={errors.semester_level?.message}
          >
            {SEMESTER_LEVELS.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>

          {/* FILE UPLOAD FIXED */}
          <Button
            component="label"
            variant="outlined"
            fullWidth
            startIcon={<UploadFileIcon />}
            sx={{ height: 60, mb: 1 }}
          >
            Choose PDF File

            <input
              hidden
              type="file"
              accept=".pdf"
              onChange={(e) => {
                if (e.target.files) {
                  setValue("pdf_file", e.target.files);
                }
              }}
            />
          </Button>

          {selectedFile && selectedFile.length > 0 && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              Selected: {selectedFile[0].name}
            </Typography>
          )}

          {errors.pdf_file && (
            <Typography color="error" variant="caption">
              {errors.pdf_file.message}
            </Typography>
          )}

          {/* SUBMIT */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 4, height: 50 }}
          >
            {loading ? <CircularProgress size={24} /> : "Upload Syllabus"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default AdminUpload;
