import fs from "fs";

export function readMatrixFromFile(fileName) {
  const data = fs.readFileSync(fileName, "utf-8");

  const lines = data.trim().split("\n");
  // console.log(lines);

  const matrix = lines.map(
    (line) => line.trim().split(/\s+/).map(Number) // Tách các giá trị theo khoảng trắng
  );

  return matrix;
}
