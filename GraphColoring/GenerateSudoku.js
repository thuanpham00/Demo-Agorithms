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
    return 1; // Nếu không còn ô trống, đã tìm thấy một giải pháp
  }

  const [row, col] = empty;
  let solutionCount = 0;
  for (let num = 1; num <= N; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num; // Điền số vào ô
      solutionCount += countSolutions(board); // Đệ quy để tìm giải pháp
      board[row][col] = 0; // Khôi phục ô
      if (solutionCount > 1) {
        break; // Nếu có hơn 1 giải pháp, dừng lại
      }
    }
  }

  return solutionCount; // Trả về số lượng giải pháp
}

function removeCells(board, numHoles) {
  const cells = [];
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      cells.push([i, j]);
    }
  }

  // Nếu không đủ ô để xóa, thông báo lỗi
  if (cells.length < numHoles) {
    console.error("Không đủ ô để xóa!");
    return;
  }

  cells.sort(() => Math.random() - 0.5); // Xáo trộn mảng

  let holes = 0;
  let attempts = 0;

  while (holes < numHoles && attempts < 2 * numHoles) {
    // Thử nghiệm nhiều hơn
    if (cells.length === 0) {
      break; // Dừng lại nếu không còn ô nào để xóa
    }

    const [row, col] = cells.pop(); // Lấy ô cuối trong mảng
    const backup = board[row][col]; // Lưu giá trị ô

    // Đánh dấu ô là trống
    board[row][col] = 0;

    // Kiểm tra số lượng giải pháp
    if (countSolutions(board) === 1) {
      holes++; // Chấp nhận ô bị xóa
    } else {
      board[row][col] = backup; // Khôi phục ô nếu không duy nhất
    }
    attempts++;
  }

  // Nếu không thể tạo đủ ô trống, thử lại bằng cách khôi phục tất cả
  if (holes < numHoles) {
    console.warn(`Không thể xóa đủ ô! Đã xóa được ${holes} ô.`);
    // Bạn có thể chọn xóa lại tất cả ô đã xóa để thử lại
    // hoặc thông báo người dùng.
  }
}

function generateSudoku(numHoles = 80) {
  const board = Array.from({ length: N }, () => Array(N).fill(0)); // mang 2 chiều
  fillSudoku(board); // điền bảng
  removeCells(board, numHoles); // xóa cột
  return board;
}

// xử lý tạo bảng sudoku ngẫu nhiên
function createGridSudokuRandom() {
  const valueInputBlank = document.getElementById("inputNodeBlank").value;

  // Kiểm tra điều kiện số lượng ô trống
  if (isNaN(valueInputBlank) || valueInputBlank < 1 || valueInputBlank > 55) {
    alert("Số lượng ô trống phải lớn hơn hoặc bằng 1 và nhỏ hơn hoặc bằng 55.");
    return null; // Hoặc bạn có thể trả về một giá trị khác nếu cần
  }

  const board = generateSudoku(valueInputBlank);
  return board;
}

export default createGridSudokuRandom;
