
import React, { useEffect, useState } from "react";
import {
  Box, Paper, Typography, TextField, Button,
  IconButton, InputAdornment, MenuItem, Autocomplete,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SchoolIcon from "@mui/icons-material/School";
import { registerUser, getColleges } from "../services/api";
import { toast } from "react-toastify";
// @ts-ignore
import "react-toastify/dist/ReactToastify.css";
import { DEPARTMENTS, BATCH_YEARS, SEMESTER_LEVELS } from "../constants/academic";

type College = {
  id: number;
  college_name: string;
};

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Min 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  department: yup.string().required("Department is required"),
  batch_year: yup.string().required("Batch year is required"),
  semester_level: yup.string().required("Semester is required"),
  college_id: yup
    .number()
    .typeError("College is required")
    .required("College is required"),
});

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  department: string;
  batch_year: string;
  semester_level: string;
  college_id: number;
};

const Register = () => {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [colleges, setColleges] = useState<College[]>([]);
  const [collegesLoading, setCollegesLoading] = useState(false);

  useEffect(() => {
    const fetchColleges = async () => {
      setCollegesLoading(true);
      try {
        const res = await getColleges();
        setColleges(res.data?.data ?? []);
      } catch (err) {
        console.error("Failed to fetch colleges", err);
      } finally {
        setCollegesLoading(false);
      }
    };
    fetchColleges();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        department: data.department,
        batch: data.batch_year,
        semester: data.semester_level,
        college_id: data.college_id,
      });

      console.log("Register success:", res.data);
      toast.success(res.data.message, { position: "top-right", autoClose: 2500 });

      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      console.error("Register failed", err);
      alert("Registration failed");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)", px: 2, py: 4 }}>
      <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, width: "100%", maxWidth: 420, borderRadius: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>

        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: "10px", background: "linear-gradient(135deg, #10b981, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <SchoolIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#fff", letterSpacing: "-0.3px" }}>
            AcademIQ
          </Typography>
        </Box>

        <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: "#fff", mb: 0.5 }}>
          Create account
        </Typography>
        <Typography sx={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", mb: 3 }}>
          Join AcademIQ today
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>

          <TextField fullWidth label="Full Name" {...register("name")} error={!!errors.name} helperText={errors.name?.message} sx={{ mb: 2, ...inputSx }} />

          <TextField fullWidth label="Email" type="email" {...register("email")} error={!!errors.email} helperText={errors.email?.message} sx={{ mb: 2, ...inputSx }} />

          <TextField fullWidth label="Password" type={showPwd ? "text" : "password"} {...register("password")} error={!!errors.password} helperText={errors.password?.message} sx={{ mb: 2, ...inputSx }}
            slotProps={{ input: { endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPwd(!showPwd)} edge="end" sx={{ color: "rgba(255,255,255,0.4)", "&:hover": { color: "#fff" } }}>{showPwd ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment>) } }}
          />

          <TextField fullWidth label="Confirm Password" type={showConfirm ? "text" : "password"} {...register("confirmPassword")} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} sx={{ mb: 2, ...inputSx }}
            slotProps={{ input: { endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end" sx={{ color: "rgba(255,255,255,0.4)", "&:hover": { color: "#fff" } }}>{showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment>) } }}
          />

          {/* College - searchable autocomplete */}
          <Controller
            name="college_id"
            control={control}
            defaultValue={undefined}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                options={colleges}
                loading={collegesLoading}
                getOptionLabel={(option) => option.college_name ?? ""}
                isOptionEqualToValue={(option, val) => option.id === val.id}
                value={colleges.find((c) => c.id === value) ?? null}
                onChange={(_, newValue) => onChange(newValue ? newValue.id : undefined)}
                sx={{ mb: 2, ...inputSx }}
                slotProps={{
                  paper: {
                    sx: {
                      background: "#1a1a2e",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.1)",
                      "& .MuiAutocomplete-option": {
                        "&:hover": { background: "rgba(16,185,129,0.15)" },
                        '&[aria-selected="true"]': { background: "rgba(16,185,129,0.2)" },
                      },
                    },
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="College"
                    placeholder="Search college..."
                    error={!!errors.college_id}
                    helperText={errors.college_id?.message}
                  />
                )}
              />
            )}
          />

          {/* Department */}
          <TextField select fullWidth label="Department" defaultValue="" {...register("department")} error={!!errors.department} helperText={errors.department?.message} sx={{ mb: 2, ...inputSx }}>
            {DEPARTMENTS.map((d) => <MenuItem key={d} value={d} sx={menuItemSx}>{d}</MenuItem>)}
          </TextField>

          {/* Batch Year */}
          <TextField select fullWidth label="Batch Year" defaultValue="" {...register("batch_year")} error={!!errors.batch_year} helperText={errors.batch_year?.message} sx={{ mb: 2, ...inputSx }}>
            {BATCH_YEARS.map((b) => <MenuItem key={b} value={b} sx={menuItemSx}>{b}</MenuItem>)}
          </TextField>

          {/* Semester */}
          <TextField select fullWidth label="Semester" defaultValue="" {...register("semester_level")} error={!!errors.semester_level} helperText={errors.semester_level?.message} sx={{ mb: 3, ...inputSx }}>
            {SEMESTER_LEVELS.map((s) => <MenuItem key={s} value={s} sx={menuItemSx}>{s}</MenuItem>)}
          </TextField>

          <Button fullWidth variant="contained" type="submit" sx={{ py: 1.4, borderRadius: "10px", textTransform: "none", fontWeight: 600, fontSize: "0.95rem", background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 4px 16px rgba(16,185,129,0.35)", "&:hover": { background: "linear-gradient(135deg, #34d399, #10b981)", boxShadow: "0 6px 20px rgba(16,185,129,0.45)" } }}>
            Create Account
          </Button>
        </form>

        <Typography sx={{ mt: 2.5, fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
          Already have an account?{" "}
          <Box component="span" onClick={() => navigate("/login")} sx={{ color: "#6ee7b7", fontWeight: 600, cursor: "pointer", "&:hover": { color: "#a7f3d0" } }}>
            Sign in
          </Box>
        </Typography>
      </Paper>
    </Box>
  );
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px", color: "#fff", background: "rgba(255,255,255,0.04)",
    "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
    "&:hover fieldset": { borderColor: "rgba(16,185,129,0.5)" },
    "&.Mui-focused fieldset": { borderColor: "#10b981" },
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.4)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#6ee7b7" },
  "& .MuiFormHelperText-root": { fontSize: "0.75rem" },
  "& .MuiSelect-icon": { color: "rgba(255,255,255,0.4)" },
  "& .MuiAutocomplete-clearIndicator, & .MuiAutocomplete-popupIndicator": { color: "rgba(255,255,255,0.4)" },
};

const menuItemSx = {
  background: "#1a1a2e", color: "#fff",
  "&:hover": { background: "rgba(16,185,129,0.15)" },
  "&.Mui-selected": { background: "rgba(16,185,129,0.2)" },
};

export default Register;