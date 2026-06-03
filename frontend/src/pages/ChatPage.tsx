

import {
  useState,
  useEffect,
  useRef,
} from "react";
 
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
 
import AcademicFilters from "../components/AcademicFilters";

import MessageBubble from "../components/MessageBubble";
import ChatInput from "../components/ChatInput";
 
import { chatQuery } from "../services/api";
 
interface Message {
  role: "user" | "assistant";
  text: string;
}
 
const ChatPage = () => {
  const [department, setDepartment] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [semesterLevel, setSemesterLevel] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
 
  const bottomRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);
 
  const isContextSelected =
    Boolean(department) && Boolean(batchYear) && Boolean(semesterLevel);
 


    const addMessage = (
  role: "user" | "assistant",
  text: string
) => {
  setMessages((prev) => [
    ...prev,
    {
      role,
      text,
    },
  ]);
};

 const handleSend = async () => {
  if (!query.trim()) {
    return;
  }

  const currentQuestion = query;

  addMessage(
    "user",
    currentQuestion
  );

  setQuery("");
  setLoading(true);

  try {
    const response =
      await chatQuery({
        question:
          currentQuestion,
        department,
        batch_year:
          batchYear,
        semester_level:
          semesterLevel,
      });

    addMessage(
      "assistant",
      response.data.answer
    );
  } catch (error) {
    console.error(error);

    addMessage(
      "assistant",
      "Something went wrong while generating the response."
    );
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
          content: '""',
          position: "fixed",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          zIndex: 0,
          pointerEvents: "none",
        },
 
        "&::after": {
          content: '""',
          position: "fixed",
          inset: 0,
       
          background: `
            radial-gradient(ellipse 80% 50% at 15% 10%, rgba(99,102,241,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 85% 20%, rgba(139,92,246,0.14) 0%, transparent 55%),
            radial-gradient(ellipse 50% 60% at 50% 90%, rgba(59,130,246,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 10% 80%, rgba(168,85,247,0.08) 0%, transparent 50%)
          `,
          zIndex: 0,
          pointerEvents: "none",
        },
      }}
    >
  
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          opacity: 0.022,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />
 
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, py: 5 }}>
 
<Box sx={{ mb: 4 }}>
 <Typography
  variant="h4"
  gutterBottom
  sx={{
    fontWeight: 800,
    letterSpacing: "-0.5px",
    color: "rgba(255,255,255,0.75)",
    mb: 0.5,
  }}
>
  🎓 Academic RAG Assistant
</Typography>
  <Typography
    variant="body1"
    sx={{
      color: "rgba(165,180,252,0.4)",
      fontWeight: 400,
      letterSpacing: "0.01em",
    }}
  >

  </Typography>
</Box>
       
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: "16px",
            background: "rgba(255,255,255,0.035)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(165,180,252,0.1)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <AcademicFilters
            department={department}
            batchYear={batchYear}
            semesterLevel={semesterLevel}
            setDepartment={setDepartment}
            setBatchYear={setBatchYear}
            setSemesterLevel={setSemesterLevel}
          />
        </Paper>
        <Paper
          elevation={0}
          sx={{
            height: "60vh",
            overflowY: "auto",
            p: 3,
            borderRadius: "16px",
            background: "rgba(255,255,255,0.025)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(165,180,252,0.08)",
            boxShadow: "0 8px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
 
            // Scrollbar styling
            "&::-webkit-scrollbar": { width: "5px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(99,102,241,0.3)",
              borderRadius: "10px",
              "&:hover": { background: "rgba(99,102,241,0.5)" },
            },
          }}
        >
          {messages.length === 0 ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 1.5,
              }}
            >
           
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
                  border: "1px solid rgba(99,102,241,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  mb: 0.5,
                }}
              >
                💬
              </Box>
              <Typography
                sx={{
                  color: "rgba(165,180,252,0.5)",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  textAlign: "center",
                }}
              >
                {isContextSelected
                  ? "Ask anything from your syllabus."
                  : "Select Department, Batch Year and Semester first."}
              </Typography>
            </Box>
          ) : (
            messages.map((message, index) => (
              <MessageBubble
                key={index}
                role={message.role}
                text={message.text}
              />
            ))
          )}
 
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress
                size={24}
                sx={{ color: "rgba(99,102,241,0.7)" }}
              />
            </Box>
          )}
 
          <div ref={bottomRef} />
        </Paper>
 
        {/* Chat Input */}
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            borderRadius: "16px",
            background: "rgba(255,255,255,0.035)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(165,180,252,0.1)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <ChatInput
            query={query}
            setQuery={setQuery}
            onSend={handleSend}
            disabled={!isContextSelected || loading}
          />
        </Paper>
 
      </Container>
    </Box>
  );
};
 
export default ChatPage;