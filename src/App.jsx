import * as React from "react";
import "./App.css";
import TotalScoreCompare from "./component/TotalScoreCompare";
import StudentDetail from "./component/StudentDetailCompare";
import { useRecoilValue } from "recoil";
import { detailChartStatus } from "./atoms";
import { Box, Container, Typography, Toolbar, AppBar } from "@mui/material";

function App() {
  const { detailChartShow } = useRecoilValue(detailChartStatus);
  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div">
            2023年春季学期九年级模拟考试成绩
          </Typography>
        </Toolbar>
      </AppBar>

      <Toolbar />
      <Container>
        <Box sx={{ my: 4 }}>
          {detailChartShow ? <StudentDetail /> : <TotalScoreCompare />}
        </Box>
      </Container>
    </>
  );
}

export default App;
