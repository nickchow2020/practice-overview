import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { detailChartStatus } from "../atoms";
import { Box, Typography, IconButton } from "@mui/material";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";

async function getCsvStudentData(path) {
  const response = await fetch(path);
  const csvData = await response.text();
  const rows = csvData.split("\n");
  const data = rows.slice(2).map((row) => row.split(","));
  return data.map((studentData) => ({
    name: studentData[1],
    total: studentData[3],
    chinese: studentData[5],
    math: studentData[7],
    history: studentData[9],
    physics: studentData[11],
    chemical: studentData[13],
    morality: studentData[15],
  }));
}

async function combineStudentResult() {
  const excelData1 = await getCsvStudentData("../data/practice1.csv");
  const excelData2 = await getCsvStudentData("../data/practice2.csv");
  const firstFiftyRan1 = excelData1.slice(0, 50);
  const firstFiftyRan2 = excelData2.slice(0, 50);
  let result = [];

  const studentNamesTopFifty = new Set();

  for (let student of firstFiftyRan1) {
    studentNamesTopFifty.add(student.name);
  }

  for (let student of firstFiftyRan2) {
    studentNamesTopFifty.add(student.name);
  }

  for (let name of studentNamesTopFifty) {
    const firstMockPractice = excelData1.filter((obj) => obj.name === name)[0];

    const secondMockPractice = excelData2.filter((obj) => obj.name === name)[0];
    const overViewScore = {
      name,
      total: [firstMockPractice?.total, secondMockPractice?.total],
      chinese: [firstMockPractice?.chinese, secondMockPractice?.chinese],
      math: [firstMockPractice?.math, secondMockPractice?.math],
      history: [firstMockPractice?.history, secondMockPractice?.history],
      physics: [firstMockPractice?.physics, secondMockPractice?.physics],
      chemical: [firstMockPractice?.chemical, secondMockPractice?.chemical],
      morality: [firstMockPractice?.morality, secondMockPractice?.morality],
    };

    result.push(overViewScore);
  }

  return result;
}

const StudentDetailCompare = () => {
  const [categories, setCategories] = useState([]);
  const [chartSeries, setChartSeries] = useState([]);
  const { studentName } = useRecoilValue(detailChartStatus);

  const setDisplayStatus = useSetRecoilState(detailChartStatus);

  const handleOnClick = () => {
    setDisplayStatus((prev) => ({
      ...prev,
      detailChartShow: false,
      studentName: "",
    }));
  };

  const chartOptions = {
    stroke: {
      show: true,
      width: 1,
      colors: ["#fff"],
    },
    chart: {
      type: "bar",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        grouped: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    xaxis: {
      categories,
    },
  };

  useEffect(() => {
    async function setGroupChartBarData() {
      const data = await combineStudentResult();
      const targetStudent = data.filter((obj) => obj.name === studentName)[0];
      const studentScore1 = Object.values(targetStudent)
        .map((value) => value[0])
        .slice(2);

      const studentScore2 = Object.values(targetStudent)
        .map((value) => value[1])
        .slice(2);

      const chartSeries = [
        {
          name: "模拟1",
          data: studentScore1,
        },

        {
          name: "模拟2",
          data: studentScore2,
        },
      ];

      setChartSeries(chartSeries);
      setCategories([
        "语文",
        "数学",
        "英语",
        "历史",
        "物理",
        "化学",
        "道德与法治",
      ]);
    }

    setGroupChartBarData();
  }, []);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: "2rem", fontWeight: "500" }}>
          {studentName}
        </Typography>
        <IconButton disableRipple onClick={handleOnClick}>
          <Typography sx={{ fontSize: "2rem", fontWeight: "300" }}>
            返回
          </Typography>
        </IconButton>
      </Box>
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={500}
      />{" "}
    </Box>
  );
};

export default StudentDetailCompare;
