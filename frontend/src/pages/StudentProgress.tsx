import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, IconButton, CircularProgress } from "@mui/material";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

import { getSgpiHistory, getTotalCredits, getCreditsHistory } from "../services/api";

type SgpiPoint = { semester: number; sgpi: number };
type CreditsPoint = { semester: number; credits_earned: number };

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
const romanise = (n: number) => ROMAN[n - 1] ?? `${n}`;

const getStudentId = (): number | null => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}").id ?? null;
  } catch {
    return null;
  }
};

const cardSx = {
  borderRadius: "14px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  backdropFilter: "blur(10px)",
};

const tooltipStyle = {
  background: "#1a1a2e",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  fontSize: 13,
  color: "#fff",
};

const axisProps = {
  tick: { fill: "rgba(255,255,255,0.45)", fontSize: 12 },
  tickLine: false,
};

// ---------- Small reusable pieces ----------

function StatCard({ label, value, icon, accent }: { label: string; value: string | number; icon: React.ReactNode; accent: string }) {
  return (
    <Paper elevation={0} sx={{ ...cardSx, p: 2.2 }}>
      <Box sx={{
        width: 32, height: 32, borderRadius: "8px", mb: 1.2,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `${accent}22`, color: accent,
      }}>
        {icon}
      </Box>
      <Typography sx={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", mt: 0.4 }}>
        {label}
      </Typography>
    </Paper>
  );
}

function ChartCard({ title, height, children }: { title: string; height: number; children: React.ReactNode }) {
  return (
    <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2, sm: 3 } }}>
      <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", color: "#fff", mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

function PageHeader({ title, subtitle, onBack }: { title: string; subtitle: string; onBack: () => void }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
      <IconButton
        onClick={onBack}
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
          {title}
        </Typography>
        <Typography sx={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)" }}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
}

// ---------- Main component ----------

type StudentProgressProps = {
  /** When true, renders without its own full-page background/header — used inside StudentReportHub */
  embedded?: boolean;
};

function StudentProgress({ embedded = false }: StudentProgressProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sgpiPoints, setSgpiPoints] = useState<SgpiPoint[]>([]);
  const [creditsPoints, setCreditsPoints] = useState<CreditsPoint[]>([]);
  const [totalCredits, setTotalCredits] = useState<number | null>(null);

  useEffect(() => {
    const studentId = getStudentId();
    if (!studentId) {
      setLoading(false);
      return;
    }

    const sortBySemester = (a: { semester: number }, b: { semester: number }) => a.semester - b.semester;

    const loadProgress = async () => {
      try {
        const sgpiRes = await getSgpiHistory(studentId);
        setSgpiPoints((sgpiRes.data?.data ?? []).sort(sortBySemester));

        const creditsRes = await getCreditsHistory(studentId);
        setCreditsPoints((creditsRes.data?.data ?? []).sort(sortBySemester));

        const totalRes = await getTotalCredits(studentId);
        setTotalCredits(totalRes.data?.total_credits_earned ?? null);
      } catch (err) {
        console.error(err);
        setSgpiPoints([]);
        setCreditsPoints([]);
        setTotalCredits(null);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  const hasData = sgpiPoints.length > 0;
  const sgpiValues = sgpiPoints.map((p) => p.sgpi);
  const latest = hasData ? sgpiValues[sgpiValues.length - 1] : null;
  const highest = hasData ? Math.max(...sgpiValues) : null;
  const average = hasData ? sgpiValues.reduce((sum, v) => sum + v, 0) / sgpiValues.length : null;

  const sgpiChartData = sgpiPoints.map((p) => ({ ...p, label: romanise(p.semester) }));
  const creditsChartData = creditsPoints.map((p) => ({ ...p, label: romanise(p.semester) }));

  const stats = [
    { label: "Latest SGPI", value: latest?.toFixed(2) ?? "—", icon: <TrendingUpIcon sx={{ fontSize: 20 }} />, accent: "#10b981" },
    { label: "Highest SGPI", value: highest?.toFixed(2) ?? "—", icon: <EmojiEventsIcon sx={{ fontSize: 20 }} />, accent: "#6366f1" },
    { label: "Average SGPI", value: average?.toFixed(2) ?? "—", icon: <EqualizerIcon sx={{ fontSize: 20 }} />, accent: "#f59e0b" },
    { label: "Semesters Recorded", value: sgpiPoints.length || "—", icon: <EventAvailableIcon sx={{ fontSize: 20 }} />, accent: "#ec4899" },
    { label: "Total Credits Earned", value: totalCredits ?? "—", icon: <WorkspacePremiumIcon sx={{ fontSize: 20 }} />, accent: "#06b6d4" },
  ];

  // ----- Body content (stat cards + charts, or loading/empty states) -----

  let body: React.ReactNode;

  if (loading) {
    body = (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress size={28} sx={{ color: "rgba(255,255,255,0.5)" }} />
      </Box>
    );
  } else if (!hasData) {
    body = (
      <Paper elevation={0} sx={{ ...cardSx, p: 6, textAlign: "center" }}>
        <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.95rem" }}>
          No Data Available
        </Typography>
      </Paper>
    );
  } else {
    body = (
      <>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)", md: "repeat(5, 1fr)" },
            gap: 2,
            mb: 3,
          }}
        >
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </Box>

        <Box sx={{ mb: 3 }}>
          <ChartCard title="SGPI over time" height={280}>
            <AreaChart data={sgpiChartData} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="sgpiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="label" {...axisProps} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
              <YAxis domain={[0, 10]} {...axisProps} axisLine={false} width={32} />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                formatter={(value) => [Number(value).toFixed(2), "SGPI"]}
                labelFormatter={(label) => `Semester ${label}`}
              />
              <Area
                type="monotone"
                dataKey="sgpi"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#sgpiGradient)"
                dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#34d399" }}
              />
            </AreaChart>
          </ChartCard>
        </Box>

        {creditsChartData.length > 0 && (
          <ChartCard title="Credits earned per semester" height={260}>
            <BarChart data={creditsChartData} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="label" {...axisProps} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
              <YAxis {...axisProps} axisLine={false} width={32} />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                formatter={(value) => [Number(value), "Credits"]}
                labelFormatter={(label) => `Semester ${label}`}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Bar dataKey="credits_earned" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={42} />
            </BarChart>
          </ChartCard>
        )}
      </>
    );
  }

  if (embedded) return <Box>{body}</Box>;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)",
        px: { xs: 2, sm: 4 },
        py: 4,
      }}
    >
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        <PageHeader
          title="Your Progress"
          subtitle="SGPI trend across semesters"
          onBack={() => navigate("/student")}
        />
        {body}
      </Box>
    </Box>
  );
}

export default StudentProgress;