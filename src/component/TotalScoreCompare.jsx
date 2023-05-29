import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useSetRecoilState } from "recoil";
import { detailChartStatus } from "../atoms";
import { Box, Typography } from "@mui/material";

async function getCsvStudentData(path) {
  const response = await fetch(path);
  const csvData = await response.text();
  const rows = csvData.split("\n");
  const data = rows.slice(2).map((row) => row.split(","));
  return data.map((studentData) => ({
    name: studentData[1],
    score: studentData[3],
    rank: studentData[0],
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
      score: [firstMockPractice?.score, secondMockPractice?.score],
      rank: [firstMockPractice?.rank, secondMockPractice?.rank],
    };

    result.push(overViewScore);
  }

  return result;
}

const GroupedBarChart = () => {
  const [categories, setCategories] = useState([]);
  const [chartSeries, setChartSeries] = useState([]);
  const setDetailWindowDate = useSetRecoilState(detailChartStatus);

  const handleBarClick = (event, chartContext, { dataPointIndex }) => {
    // Handle the bar click event here
    setDetailWindowDate({
      detailChartShow: true,
      studentName: categories[dataPointIndex],
    });
  };

  const chartOptions = {
    chart: {
      type: "bar",
      events: {
        dataPointSelection: handleBarClick, // Attach the click event handler
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        grouped: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          fontSize: "18px", // Set the desired font size for x-axis labels
        },
      },
    },

    yaxis: {
      labels: {
        style: {
          fontSize: "22px", // Set the desired font size for x-axis labels
        },
      },
    },

    legend: {
      position: "top", // Set the legend position to 'top'
    },
  };

  useEffect(() => {
    async function setGroupChartBarData() {
      const data = await combineStudentResult();
      const categories = data.map((item) => item.name);
      const mockOneScore = data.map((item) => item.score[0]);
      const mockTwoScore = data.map((item) => item.score[1]);

      const chartSeries = [
        {
          name: "模拟1 总分",
          data: mockOneScore,
        },

        {
          name: "模拟2 总分",
          data: mockTwoScore,
        },
      ];

      setCategories(categories);
      setChartSeries(chartSeries);
    }

    setGroupChartBarData();
  }, []);

  return (
    <ReactApexChart
      options={chartOptions}
      series={chartSeries}
      type="bar"
      height={4500}
    />
  );
};

export default GroupedBarChart;
