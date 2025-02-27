import { Card, CardContent, Typography, Grid } from "@mui/material";

// eslint-disable-next-line react/prop-types
const StatCard = ({ title, value, color }) => (
  <Grid item xs={12} sm={4}>
    <Card
      elevation={2}
      sx={{
        height: "100%",
        transition: "transform 0.2s",
        "&:hover": { transform: "translateY(-4px)" },
        backgroundColor: "#303030", // Dark background color
        color: "#fff", // White text color
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography color="white" gutterBottom sx={{ fontSize: "1.1rem" }}>
          {title}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: color,
            fontWeight: "bold",
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);

export default StatCard;