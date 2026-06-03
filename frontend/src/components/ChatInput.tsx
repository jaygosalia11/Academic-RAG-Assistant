
import {
  Box,
  IconButton,
  TextField,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

interface Props {
  query: string;
  setQuery: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}

function ChatInput({
  query,
  setQuery,
  onSend,
  disabled,
}: Props) {
  const handleKeyDown = (
    event: React.KeyboardEvent
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        borderTop: "1px solid #eee",
      }}
    >
      <TextField
        fullWidth
        multiline
        maxRows={4}
        placeholder="Ask about your syllabus..."
        value={query}
        disabled={disabled}
        onChange={(event) =>
          setQuery(event.target.value)
        }
        onKeyDown={handleKeyDown}
      />

      <IconButton
        color="primary"
        onClick={onSend}
        disabled={
          disabled ||
          query.trim() === ""
        }
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
}

export default ChatInput;