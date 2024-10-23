import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import CircularProgress from "@mui/material/CircularProgress";
const StatBox = ({ title, subtitle, icon, loading }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="center">
        <Box>
          {icon}
          <Typography
            variant="h4"
            fontWeight="bold"
            display='flex'
            alignItems='center'
            sx={{ color: colors.grey[100] }}
          >
            {loading ? <CircularProgress style={{marginLeft:'5px'}} color="secondary" size={12} /> : title}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" mt="2px">
        <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
