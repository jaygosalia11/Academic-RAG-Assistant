import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Box } from "@mui/material";

const TypingIndicator = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1.5,
      }}
    >
     <AutoAwesomeIcon
  sx={{
    color: "#818cf8",
    fontSize: 26,
  }}
/>

      <Box sx={{ display: "flex", gap: 0.5 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#818cf8",
              animation: "typing 1.4s infinite ease-in-out",
              animationDelay: `${i * 0.2}s`,

              "@keyframes typing": {
                "0%, 80%, 100%": {
                  transform: "scale(0.6)",
                  opacity: 0.4,
                },
                "40%": {
                  transform: "scale(1)",
                  opacity: 1,
                },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TypingIndicator;