import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SchoolIcon from "@mui/icons-material/School";

import { getAllMarksheets, getColleges } from "../services/api";

type MarksheetRow = {
  document_id: number;
  student_id: number;
  college_id: number;
  student_name: string;
  email: string;
  department: string;
  batch: string;
  semester: number;
  academic_year: string;
  file_path: string;
  status: string;
  uploaded_at: string;
};

type College = {
  id: number;
  college_name: string;
};

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  COMPLETED: { color: "#6ee7b7", bg: "rgba(16,185,129,0.15)" },
  PROCESSING: { color: "#fcd34d", bg: "rgba(245,158,11,0.15)" },
  FAILED: { color: "#f87171", bg: "rgba(239,68,68,0.15)" },
};

function MarksheetHistory() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<MarksheetRow[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  const collegeName = (id: number) =>
    colleges.find((c) => c.id === id)?.college_name ?? `College #${id}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [marksheetsRes, collegesRes]: [any, any] = await Promise.all([
          getAllMarksheets(),
          getColleges(),
        ]);
        setRows(marksheetsRes.data?.data ?? []);
        setColleges(collegesRes.data?.data ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns: GridColDef<MarksheetRow>[] = [
    { field: "document_id", headerName: "ID", width: 70 },
    { field: "student_name", headerName: "Student", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 180 },
    {
      field: "college_id",
      headerName: "College",
      flex: 1,
      minWidth: 200,
      valueGetter: (value) => collegeName(value as number),
    },
    { field: "department", headerName: "Department", width: 120 },
    { field: "batch", headerName: "Batch", width: 120 },
    { field: "semester", headerName: "Sem", width: 70 },
    { field: "academic_year", headerName: "Academic Year", width: 130 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => {
        const style = STATUS_STYLES[params.value as string] ?? {
          color: "rgba(255,255,255,0.6)",
          bg: "rgba(255,255,255,0.08)",
        };
        return (
          <Chip
            label={params.value}
            size="small"
            sx={{
              color: style.color,
              background: style.bg,
              fontWeight: 600,
              fontSize: "0.72rem",
              border: `1px solid ${style.color}33`,
            }}
          />
        );
      },
    },
    {
      field: "uploaded_at",
      headerName: "Uploaded At",
      width: 180,
      valueGetter: (value) => new Date(value as string).toLocaleString(),
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)",
        px: { xs: 2, sm: 4 },
        py: 4,
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
 
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <IconButton
            onClick={() => navigate("/admin/marksheet")}
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
              Marksheet Upload History
            </Typography>
            <Typography sx={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)" }}>
              All marksheets uploaded so far
            </Typography>
          </Box>
        </Box>


        <Paper
          elevation={0}
          sx={{
            borderRadius: "16px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 320 }}>
              <CircularProgress size={28} sx={{ color: "rgba(255,255,255,0.5)" }} />
            </Box>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row.document_id}
              autoHeight
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
              sx={{
                border: "none",
                color: "#e0e7ff",
                "& .MuiDataGrid-columnHeaders": {
                  background: "rgba(255,255,255,0.04)",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                },
                "& .MuiDataGrid-row:hover": {
                  background: "rgba(16,185,129,0.06)",
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                },
                "& .MuiTablePagination-root": {
                  color: "rgba(255,255,255,0.6)",
                },
                "& .MuiDataGrid-sortIcon, & .MuiDataGrid-menuIconButton": {
                  color: "rgba(255,255,255,0.5)",
                },
                "& .MuiDataGrid-overlay": {
                  background: "transparent",
                },
              }}
            />
          )}

          {!loading && rows.length === 0 && (
            <Typography sx={{ textAlign: "center", color: "rgba(255,255,255,0.4)", py: 4 }}>
              No marksheets uploaded yet.
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default MarksheetHistory;