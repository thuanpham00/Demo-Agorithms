import { Heap } from "heap-js";

class Node {
  constructor(i, j) {
    // khởi tạo 1 node
    this.i = i;
    this.j = j;
    this.par_i = -1;
    this.par_j = -1;
    this.g = Infinity;
    this.h = Infinity;
    this.f = Infinity;
  }
}

const row = 4;
const col = 4;
const src = [0, 3];
const dest = [3, 1];
const matrix = [
  [0, 1, 1, 1],
  [1, 1, 0, 1],
  [1, 0, 0, 1],
  [1, 1, 1, 1],
];

// kiểm tra số hợp lệ và không âm
const isValid = (i, j) => {
  return i >= 0 && i < row && j >= 0 && j < col;
};

// ô không bị chặn = 1
// ô bị chặn = 0
const isUnblocked = (matrix, i, j) => {
  return matrix[i][j] === 1;
};

// kiểm tra đích
const isDestination = (dest, i, j) => {
  return dest[0] === i && dest[1] === j;
};

// tính Heuristic
const calHeuristic = (dest, i, j) => {
  return Math.sqrt(Math.pow(i - dest[0], 2) + Math.pow(j - dest[1], 2));
};

// truy vết đường đi
const traceDest = (nodeList, dest) => {
  let path = [];
  let i = dest[0];
  let j = dest[1];

  while (nodeList[i][j].par_i !== i || nodeList[i][j].par_j !== j) {
    path.push([i, j]);
    let tmp_i = nodeList[i][j].par_i;
    let tmp_j = nodeList[i][j].par_j;

    i = tmp_i;
    j = tmp_j;
  }

  path.push([i, j]); // add nút nguồn
  path.reverse();
  console.log(path);
};

const runAStar = (matrix, src, dest) => {
  if (!isValid(src[0], src[1]) || !isValid(dest[0], dest[1])) {
    console.log("Đỉnh nguồn hoặc đỉnh đích không hợp lệ");
    return;
  }

  if (!isUnblocked(matrix, src[0], src[1]) || !isUnblocked(matrix, dest[0], dest[1])) {
    console.log("Đỉnh nguồn hoặc đỉnh đích bị chặn");
    return;
  }

  if (isDestination(dest, src[0], src[1])) {
    console.log("Đỉnh nguồn chính là đỉnh đích");
    return;
  }

  // khởi tạo
  // nodeList: mảng 2 chiều lưu trữ thông tin các node
  // closeList: mảng 2 chiều lưu trữ đã node đã kiểm tra
  // openList: mảng 1 chiều hàng đợi

  const nodeList = Array.from(
    { length: row },
    (_, i) => Array.from({ length: col }, (_, j) => new Node(i, j)) // mỗi phần tử là 1 Node
  );

  const closeList = Array.from(
    { length: row },
    () => Array.from({ length: col }, () => false) // mỗi phần tử là 1 Node
  );

  const customPriorityComparator = (a, b) => a.f - b.f;
  const openList = new Heap(customPriorityComparator);

  let foundDest = false;

  let start_i = src[0]; // 0
  let start_j = src[1]; // 3

  // start_i và start_j trong nodeList truyền thẳng vào i và j -> khởi tạo 1 Node
  // nên ko cần update thêm i và j
  nodeList[start_i][start_j].par_i = start_i; // node cha của node nguồn là chính nó
  nodeList[start_i][start_j].par_j = start_j;
  nodeList[start_i][start_j].g = 0;
  nodeList[start_i][start_j].h = 0;
  nodeList[start_i][start_j].f = 0;

  openList.push(nodeList[start_i][start_j]); // add đỉnh nguồn vào list
  while (openList.length > 0) {
    let p = openList.pop(); // lấy đỉnh có f nhỏ nhất ra

    let current_i = p.i; // 0
    let current_j = p.j; // 3
    // sau khi lấy dc node có f nhỏ nhất đánh dấu nó đã ktra rồi

    if (closeList[current_i][current_j]) {
      continue; // Nếu nút đã được kiểm tra, bỏ qua
    }

    closeList[current_i][current_j] = true;

    const direction = [
      [0, 1], // Di chuyển sang phải
      [0, -1], // Di chuyển sang trái
      [1, 0], // Di chuyển xuống dưới
      [-1, 0], // Di chuyển lên trên
      [1, 1], // Di chuyển xuống dưới và sang phải (diagonal)
      [1, -1], // Di chuyển xuống dưới và sang trái (diagonal)
      [-1, 1], // Di chuyển lên trên và sang phải (diagonal)
      [-1, -1], // Di chuyển lên trên và sang trái (diagonal)
    ];

    direction.forEach((dir) => {
      let new_i = current_i + dir[0]; // 1
      let new_j = current_j + dir[1]; // 3

      if (isValid(new_i, new_j) && isUnblocked(matrix, new_i, new_j) && !closeList[new_i][new_j]) {
        if (isDestination(dest, new_i, new_j)) {
          console.log("Đã tìm thấy đích");
          foundDest = true;
          nodeList[new_i][new_j].par_i = current_i;
          nodeList[new_i][new_j].par_j = current_j;
          traceDest(nodeList, dest);
          return;
        } else {
          let g_new = nodeList[current_i][current_j].g + 1.0;
          let h_new = calHeuristic(dest, new_i, new_j);
          let f_new = g_new + h_new;

          if (nodeList[new_i][new_j].f === Infinity || nodeList[new_i][new_j].f > f_new) {
            nodeList[new_i][new_j].par_i = current_i;
            nodeList[new_i][new_j].par_j = current_j;
            nodeList[new_i][new_j].g = g_new;
            nodeList[new_i][new_j].h = h_new;
            nodeList[new_i][new_j].f = f_new;
            openList.push(nodeList[new_i][new_j]);
          }
        }
      }
    });

    if (foundDest) {
      break;
    }
  }

  if (!foundDest) {
    console.log("Không tìm thấy đường đi");
  }
};

runAStar(matrix, src, dest);
