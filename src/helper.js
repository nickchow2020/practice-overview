export async function getCsvStudentData(path) {
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
