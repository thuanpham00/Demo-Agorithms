// cần 3 hàm chính
// 1 hàm tìm các nút lân cận nó
// 1 hàm tính trọng số + khoảng cách từ nút hiện tại đến đích
// lấy nút lân cận nhỏ nhất (trọng số nhỏ + kCach gần đích)
// 1 hàm thuật toán

// import { getMatrix } from "./readFile.js";
import { readMatrixFromFile } from "./readFile.js";

function f(src, dest) {
  const [i, j] = src; // src = [2,3] -> i = 2 ; j = 3
  const value = matrix[i][j];
  const distanceDest = Math.sqrt(Math.pow(i - dest[0], 2) + Math.pow(j - dest[1], 2));
  return value + distanceDest; // kết hợp trọng số và kc tới đích để tìm
}

function isValid(i, j) {
  return i >= 0 && j >= 0 && i < matrix.length && j < matrix[0].length;
}

function isUnblocked(i, j) {
  // nút đi được = 0
  // ko đi được = 2
  return matrixStatus[i][j] === 0;
}

function generate_neighbors_node(src) {
  const [i, j] = src;
  const neighbors = [];
  const directions = [
    [0, 1], // Di chuyển sang phải
    [0, -1], // Di chuyển sang trái
    [1, 0], // Di chuyển xuống dưới
    [-1, 0], // Di chuyển lên trên
    [1, 1], // Di chuyển xuống dưới và sang phải (diagonal)
    [1, -1], // Di chuyển xuống dưới và sang trái (diagonal)
    [-1, 1], // Di chuyển lên trên và sang phải (diagonal)
    [-1, -1], // Di chuyển lên trên và sang trái (diagonal)
  ];

  directions.forEach((dir) => {
    let new_i = i + dir[0];
    let new_j = j + dir[1];
    if (isValid(new_i, new_j) && isUnblocked(new_i, new_j)) {
      neighbors.push([new_i, new_j]);
    }
  });

  return neighbors; // trả về các nút lân cận của 1 nút hiện tại
}

function hillClimbing(matrix, matrixStatus, src, dest) {
  if (src[0] === dest[0] && src[1] === dest[1]) {
    return { path: [src], finalPosition: src };
  }
  let x = src;
  const path = [x]; // nút nguồn add vào
  while (true) {
    const neighbors = generate_neighbors_node(x);

    const best_neighbors = neighbors.reduce((a, b) => (f(a, dest) < f(b, dest) ? a : b));
    let foundDest = false;
    if (f(best_neighbors, dest) >= f(x, dest)) {
      console.log("Đã tìm thấy giải pháp tốt nhất: ");
      return { path, finalPosition: x };
    }
    x = best_neighbors;
    path.push(x);

    if (x[0] === dest[0] && x[1] === dest[1]) {
      console.log("Đã tìm thấy đích!");
      foundDest = true;
      return { path, finalPosition: x };
    }
  }
}
const src = [0, 0];
const dest = [4, 4];

// Ma trận trọng số
// const matrix = [
//   [25, 24, 23, 22, 21],
//   [20, 19, 18, 17, 16],
//   [15, 14, 13, 12, 11],
//   [10, 9, 8, 7, 6],
//   [5, 4, 3, 2, 1],
// ];

// Ma trận trạng thái (0: không bị chặn, 1: bị chặn)
const matrixStatus = [
  [0, 0, 0, 0, 0],
  [0, 1, 1, 0, 1],
  [0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0],
];

const matrix = readMatrixFromFile("matrix.txt");
const result = hillClimbing(matrix, matrixStatus, src, dest);

console.log("Đường đi:");
result.path.forEach((item) => console.log(item));
