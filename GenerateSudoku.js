const N = 9;
const sqrt_N = 3;

// Hàm kiểm tra tính hợp lệ khi điền số vào ô
function isValid(board, row, col, num) {
  if (board[row].includes(num)) {
    return false;
  }
  for (let r = 0; r < N; r++) {
    if (board[r][col] === num) {
      return false;
    }
  }
  const startRow = row - (row % sqrt_N);
  const startCol = col - (col % sqrt_N);
  for (let i = 0; i < sqrt_N; i++) {
    for (let j = 0; j < sqrt_N; j++) {
      if (board[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }
  return true;
}

function fillSudoku(board) {
  const empty = findEmptyLocation(board);
  if (!empty) {
    return true;
  }

  const [row, col] = empty;
  const nums = Array.from({ length: N }, (_, i) => i + 1);
  nums.sort(() => Math.random() - 0.5);

  for (const num of nums) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      if (fillSudoku(board)) {
        return true;
      }
      board[row][col] = 0;
    }
  }

  return false;
}

function findEmptyLocation(board) {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (board[i][j] === 0) {
        return [i, j];
      }
    }
  }
  return null;
}

function countSolutions(board) {
  const empty = findEmptyLocation(board);
  if (!empty) {
    return 1;
  }

  const [row, col] = empty;
  let solutionCount = 0;
  for (let num = 1; num <= N; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      solutionCount += countSolutions(board);
      board[row][col] = 0;
      if (solutionCount > 1) {
        break;
      }
    }
  }

  return solutionCount;
}

function removeCells(board, numHoles) {
  const cells = [];
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      cells.push([i, j]);
    }
  }
  cells.sort(() => Math.random() - 0.5);

  let holes = 0;
  for (const [row, col] of cells) {
    if (holes >= numHoles) {
      break;
    }
    const backup = board[row][col];
    board[row][col] = 0;

    if (countSolutions(board) !== 1) {
      board[row][col] = backup;
    } else {
      holes++;
    }
  }
}

function generateSudoku(numHoles = 40) {
  const board = Array.from({ length: N }, () => Array(N).fill(0));
  fillSudoku(board);
  removeCells(board, numHoles);
  return board;
}

// xử lý tạo bảng sudoku ngẫu nhiên
function createGridSudokuRandom() {
  const valueInputBlank = document.getElementById("inputNodeBlank").value;

  // Kiểm tra điều kiện số lượng ô trống
  if (isNaN(valueInputBlank) || valueInputBlank < 1 || valueInputBlank > 55) {
    alert("Số lượng ô trống phải lớn hơn hoặc bằng 1 và nhỏ hơn hoặc bằng 50.");
    return null; // Hoặc bạn có thể trả về một giá trị khác nếu cần
  }

  const board = generateSudoku(valueInputBlank);
  return board;
}

export default createGridSudokuRandom