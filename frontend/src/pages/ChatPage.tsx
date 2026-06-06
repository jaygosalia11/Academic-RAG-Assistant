import {
  useState,
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import { getSessionId } from "../utils/session";
import CircularProgress from "@mui/material/CircularProgress";

import AcademicFilters from "../components/AcademicFilters";
import MessageBubble from "../components/MessageBubble";
import ChatInput from "../components/ChatInput";

import {
  chatQuery,
  getChatHistory,
  getSessions,
  createSession
} from "../services/api";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const ChatPage = () => {
  const navigate = useNavigate();

  // const [department, setDepartment] = useState("");
  // const [batchYear, setBatchYear] = useState("");
  // const [semesterLevel, setSemesterLevel] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    loadHistory();
    loadSessions();
  }, []);

  const addMessage = (role: "user" | "assistant", text: string) => {
    setMessages((prev) => [...prev, { role, text }]);
  };

  const loadHistory = async () => {
    setPageLoading(true);
    try {
      const sessionId = getSessionId();
      const response = await getChatHistory(sessionId);
      const history = response.data.messages || [];
      const formattedMessages = history.map(
        ([role, text]: [string, string]) => ({ role, text })
      );
      setMessages(formattedMessages);
    } catch (error) {
      console.error("History load failed:", error);
      setMessages([]);
    } finally {
      setPageLoading(false);
    }
  };

  const loadSessions = async () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    const res = await getSessions(
      user.id
    );

    const data = res.data;

    setSessions(data.sessions);

    if (
      !activeSession &&
      data.sessions.length > 0
    ) {
      setActiveSession(
        data.sessions[0].id
      );
    }
  } catch (err) {
    console.error(err);
  }
};
  const loadSession = async (sessionId: string) => {
    setActiveSession(sessionId);
    localStorage.setItem("session_id", sessionId);
    setPageLoading(true);
    try {
      const res = await getChatHistory(sessionId);
      const history = res.data.messages || [];
      const formatted = history.map(([role, text]: any) => ({ role, text }));
      setMessages(formatted);
    } catch (err) {
      console.error("Session load failed:", err);
      setMessages([]);
    } finally {
      setPageLoading(false);
    }
  };

  const handleNewChat = async () => {

  const newId = crypto.randomUUID();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  try {

    await createSession(
      newId,
      user.id
    );

  } catch (err) {

    console.error(
      "Failed to register new session on backend:",
      err
    );
  }

  localStorage.setItem(
    "session_id",
    newId
  );

  setActiveSession(newId);

  setMessages([]);

  loadSessions();
};

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("session_id");
    navigate("/login");
  };

  const handleSend = async () => {
    if (!query.trim()) return;

    const currentQuestion = query;
    addMessage("user", currentQuestion);
    setQuery("");
    setLoading(true);
const user = JSON.parse(localStorage.getItem("user") || "{}");
    try {
    
      const response = await chatQuery({
        session_id: getSessionId(),
        question: currentQuestion,
        department: user.department,
        batch_year: user.batch_year,
        semester_level: user.semester_level,
        user_id: user.id,
      });
      addMessage("assistant", response.data.answer);
    } catch (error) {
      console.error(error);
      addMessage("assistant", "Something went wrong while generating the response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(145deg, #0a0e1a 0%, #0d1425 40%, #0a1020 70%, #080c18 100%)",
        "&::before": {
          content: '""', position: "fixed", inset: 0,
          backgroundImage: `linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)`,
          backgroundSize: "48px 48px", zIndex: 0, pointerEvents: "none",
        },
        "&::after": {
          content: '""', position: "fixed", inset: 0,
          background: `
            radial-gradient(ellipse 80% 50% at 15% 10%, rgba(99,102,241,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 85% 20%, rgba(139,92,246,0.14) 0%, transparent 55%),
            radial-gradient(ellipse 50% 60% at 50% 90%, rgba(59,130,246,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 10% 80%, rgba(168,85,247,0.08) 0%, transparent 50%)
          `,
          zIndex: 0, pointerEvents: "none",
        },
      }}
    >
      {/* Noise overlay */}
      <Box sx={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.022, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }} />

      {/* Hamburger — top left */}
      <Box onClick={() => setDrawerOpen(true)} sx={{ position: "fixed", top: 16, left: 16, zIndex: 10, cursor: "pointer", width: 40, height: 40, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "rgba(165,180,252,0.9)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(165,180,252,0.12)", backdropFilter: "blur(12px)", transition: "all 0.2s ease", "&:hover": { background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.35)" } }}>
        ☰
      </Box>

      {/* Logout — top right */}
      <IconButton onClick={handleLogout} title="Logout" sx={{ position: "fixed", top: 12, right: 16, zIndex: 10, color: "rgba(165,180,252,0.6)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(165,180,252,0.12)", backdropFilter: "blur(12px)", "&:hover": { background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.35)", color: "#f87171" }, transition: "all 0.2s ease" }}>
        <LogoutIcon fontSize="small" />
      </IconButton>

      {/* Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)} slotProps={{ paper: { sx: { width: 280, background: "rgba(10,14,26,0.97)", backdropFilter: "blur(24px)", color: "white", borderRight: "1px solid rgba(165,180,252,0.1)", boxShadow: "4px 0 32px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", "&::-webkit-scrollbar": { width: "4px" }, "&::-webkit-scrollbar-track": { background: "transparent" }, "&::-webkit-scrollbar-thumb": { background: "rgba(99,102,241,0.3)", borderRadius: "10px" } } } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: "1px solid rgba(165,180,252,0.08)" }}>
          <Typography sx={{ color: "rgba(165,180,252,0.85)", fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.04em" }}>💬 Chats</Typography>
          <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ color: "rgba(165,180,252,0.6)", "&:hover": { color: "rgba(165,180,252,1)" } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box onClick={() => { handleNewChat(); setDrawerOpen(false); }} sx={{ mx: 2, mt: 2, mb: 1, p: 1.5, borderRadius: "10px", textAlign: "center", cursor: "pointer", background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.28)", color: "rgba(165,180,252,0.9)", fontWeight: 600, fontSize: "0.875rem", transition: "all 0.2s ease", "&:hover": { background: "rgba(99,102,241,0.28)", border: "1px solid rgba(99,102,241,0.5)" } }}>
          + New Chat
        </Box>

        <Box sx={{ px: 2, pb: 2, overflowY: "auto", flex: 1 }}>
          {sessions.map((s) => (
            <Box key={s.id} title={s.title || "New Chat"} onClick={() => { loadSession(s.id); setDrawerOpen(false); }} sx={{ p: 1.2, mb: 0.5, borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", color: activeSession === s.id ? "rgba(165,180,252,0.95)" : "rgba(165,180,252,0.5)", background: activeSession === s.id ? "rgba(99,102,241,0.2)" : "transparent", border: activeSession === s.id ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", transition: "all 0.15s ease", "&:hover": { background: "rgba(255,255,255,0.07)", color: "rgba(165,180,252,0.85)" } }}>
              💬 {s.title || "New Chat"}
            </Box>
          ))}
        </Box>
      </Drawer>

      {/* Main content */}
      <Box sx={{ position: "relative", zIndex: 2 }}>
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, py: 5 }}>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, letterSpacing: "-0.5px", color: "rgba(255,255,255,0.75)", mb: 0.5 }}>
              🎓 Academic RAG Assistant
            </Typography>
          </Box>

          {/* <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: "16px", background: "rgba(255,255,255,0.035)", backdropFilter: "blur(20px)", border: "1px solid rgba(165,180,252,0.1)", boxShadow: "0 4px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
            <AcademicFilters
              department={department} batchYear={batchYear} semesterLevel={semesterLevel}
              setDepartment={setDepartment} setBatchYear={setBatchYear} setSemesterLevel={setSemesterLevel}
            />
          </Paper> */}

          {/* Messages panel */}
          <Paper elevation={0} sx={{ height: "65vh", overflowY: "auto", p: 3, borderRadius: "16px", background: "rgba(255,255,255,0.025)", backdropFilter: "blur(24px)", border: "1px solid rgba(165,180,252,0.08)", boxShadow: "0 8px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)", "&::-webkit-scrollbar": { width: "5px" }, "&::-webkit-scrollbar-track": { background: "transparent" }, "&::-webkit-scrollbar-thumb": { background: "rgba(99,102,241,0.3)", borderRadius: "10px" } }}>
            {pageLoading ? (
              <Box sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
              </Box>
            ) : messages.length === 0 ? (
              <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ width: 64, height: 64, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)", border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, mb: 0.5 }}>
                  💬
                </Box>
                <Typography sx={{ color: "rgba(165,180,252,0.5)", fontWeight: 500, fontSize: "0.95rem", textAlign: "center" }}>
                  Ask anything from your syllabus.
                </Typography>
              </Box>
            ) : (
              messages.map((message, index) => (
                <MessageBubble key={index} role={message.role} text={message.text} />
              ))
            )}

            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <CircularProgress size={24} sx={{ color: "rgba(99,102,241,0.7)" }} />
              </Box>
            )}
            <div ref={bottomRef} />
          </Paper>

          {/* Chat input */}
          <Paper elevation={0} sx={{ mt: 2, borderRadius: "16px", background: "rgba(255,255,255,0.035)", backdropFilter: "blur(20px)", border: "1px solid rgba(165,180,252,0.1)", boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
            <ChatInput
              query={query}
              setQuery={setQuery}
              onSend={handleSend}
              disabled={loading}
            />
          </Paper>

        </Container>
      </Box>
    </Box>
  );
};

export default ChatPage;