
// import {
//   Box,
//   IconButton,
//   TextField,
// } from "@mui/material";

// import SendIcon from "@mui/icons-material/Send";

// interface Props {
//   query: string;
//   setQuery: (value: string) => void;
//   onSend: () => void;
//   disabled: boolean;
// }

// function ChatInput({
//   query,
//   setQuery,
//   onSend,
//   disabled,
// }: Props) {
//   const handleKeyDown = (
//     event: React.KeyboardEvent
//   ) => {
//     if (
//       event.key === "Enter" &&
//       !event.shiftKey
//     ) {
//       event.preventDefault();
//       onSend();
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         gap: 2,
//         p: 2,
//         borderTop: "1px solid #eee",
//       }}
//     >
//       <TextField
//         fullWidth
//         multiline
//         maxRows={4}
//         placeholder="Ask about your syllabus..."
//         value={query}
//         disabled={disabled}
//         onChange={(event) =>
//           setQuery(event.target.value)
//         }
//         onKeyDown={handleKeyDown}
//       />

//       <IconButton
//         color="primary"
//         onClick={onSend}
//         disabled={
//           disabled ||
//           query.trim() === ""
//         }
//       >
//         <SendIcon />
//       </IconButton>
//     </Box>
//   );
// }

// export default ChatInput;


import { Box, IconButton, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface Props {
  query: string;
  setQuery: (value: string) => void;
  onSend: () => void;
  disabled: boolean;  // only disables send button, not typing
}

const WORD_LIMIT = 250;

function ChatInput({ query, setQuery, onSend, disabled }: Props) {
  const wordCount = query.trim() === "" ? 0 : query.trim().split(/\s+/).length;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!disabled && query.trim() !== "") onSend();
    }
  };

  const handleChange = (val: string) => {
    const words = val.trim() === "" ? 0 : val.trim().split(/\s+/).length;
    if (words <= WORD_LIMIT) setQuery(val);
  };

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-end" }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Ask about your syllabus..."
          value={query}
          disabled={false}   // always allow typing
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              color: "#fff",
              fontSize: { xs: "0.9rem", sm: "0.95rem" },
              background: "rgba(255,255,255,0.04)",
              "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
              "&:hover fieldset": { borderColor: "rgba(99,102,241,0.4)" },
              "&.Mui-focused fieldset": { borderColor: "#6366f1" },
            },
            "& .MuiInputBase-input::placeholder": { color: "rgba(255,255,255,0.3)", opacity: 1 },
          }}
        />
        <IconButton
          onClick={onSend}
          disabled={disabled || query.trim() === ""}
          sx={{
            mb: "2px",
            width: 44, height: 44,
            borderRadius: "12px",
            background: disabled || query.trim() === "" ? "rgba(99,102,241,0.2)" : "linear-gradient(135deg, #6366f1, #4f46e5)",
            color: "#fff",
            flexShrink: 0,
            "&:hover:not(:disabled)": { background: "linear-gradient(135deg, #818cf8, #6366f1)" },
            "&:disabled": { color: "rgba(255,255,255,0.3)" },
          }}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Word counter */}
      <Typography sx={{ fontSize: "0.7rem", textAlign: "right", mt: 0.5, color: wordCount >= WORD_LIMIT ? "#f87171" : "rgba(255,255,255,0.2)" }}>
        {wordCount}/{WORD_LIMIT}
      </Typography>
    </Box>
  );
}

export default ChatInput;