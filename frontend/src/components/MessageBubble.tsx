
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";

interface Props {
  role: "user" | "assistant";
  text: string;
}

function MessageBubble({
  role,
  text,
}: Props) {
  const isUser = role === "user";

  const avatarColor = isUser
    ? "primary.main"
    : "success.main";

  const bubbleColor = isUser
    ? "primary.main"
    : "background.paper";

  const textColor = isUser
    ? "white"
    : "text.primary";

  const Icon = isUser
    ? PersonIcon
    : SmartToyIcon;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser
          ? "flex-end"
          : "flex-start",
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isUser
            ? "row-reverse"
            : "row",
          alignItems: "flex-start",
          gap: 1.5,
          maxWidth: "80%",
        }}
      >
        <Avatar
          sx={{
            bgcolor: avatarColor,
          }}
        >
          <Icon />
        </Avatar>

        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: bubbleColor,
            color: textColor,
          }}
        >
          <Typography
            sx={{
              whiteSpace: "pre-wrap",
            }}
          >
            {text}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default MessageBubble;