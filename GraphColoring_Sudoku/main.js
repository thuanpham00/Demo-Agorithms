import createGridSudokuRandom from "./GenerateSudoku.js";

window.addEventListener("load", function () {
  // hàm tạo bảng UI (DOM ảo)
  const createGridBoard = () => {
    const grid = document.getElementById("sudoku");
    for (let i = 0; i < 9; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < 9; j++) {
        const col = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = "1";
        input.style.backgroundColor = "white";
        col.appendChild(input);
        row.appendChild(col); // thêm cột vào mỗi hàng
      }
      grid.appendChild(row); // thêm hàng vào bảng
    }
  };

  // hàm lấy bảng từ UI về
  const getBoardDisplay = () => {
    const board = [];
    const rowElements = document.querySelectorAll("#sudoku tr");
    rowElements.forEach((rowElement) => {
      const inputElements = rowElement.querySelectorAll("input"); // truy cập trên mỗi hàng gọi các cột ra
      const row = [];
      inputElements.forEach((inputElement) => {
        const valueInput = inputElement.value ? parseInt(inputElement.value) : 0;
        row.push(valueInput); // thêm mỗi giá trị vào hàng
      });
      board.push(row); // thêm hàng vào bảng
    });
    return board;
  };

  // tạo bảng UI
  createGridBoard();

  // xử lý clear bảng
  const btnClear = document.querySelector(".btn.btn-clear");
  btnClear.addEventListener("click", handleClear);
  function handleClear() {
    const row = document.querySelectorAll("tr");
    [...row].forEach((rowItem) => {
      const inputItem = rowItem.querySelectorAll("input");
      [...inputItem].forEach((colItem) => {
        colItem.value = "";
        colItem.style.backgroundColor = "white";
        colItem.style.color = "black";
      });
    });
  }

  // xử lý random
  const btnRandom = document.querySelector(".randomButton");
  btnRandom.addEventListener("click", handleRandom);
  function handleRandom() {
    handleClear();
    const board = createGridSudokuRandom();
    countEmptyCells(board);
    const rowBoard = document.querySelectorAll("tr");
    [...rowBoard].forEach((rowItem, rowIndex) => {
      const colBoard = rowItem.querySelectorAll("input"); // lấy các cột từ mỗi hàng truy vấn

      [...colBoard].forEach((colItem, colIndex) => {
        colItem.value = board[rowIndex][colIndex] !== 0 ? board[rowIndex][colIndex] : "";
      });
    });
  }

  const inputList = document.querySelectorAll("#sudoku tr td input");
  [...inputList].forEach((inputItem) =>
    inputItem.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "");
      if (this.value === "0") {
        this.value = "";
      }
    })
  );

  // xử lý chỉ được nhập số và tối thiểu 1 <= value <= 55
  const changeValueInput = document.querySelector("#inputNodeBlank");
  changeValueInput.addEventListener("keydown", function (e) {
    // Cho phép các phím điều hướng và phím chức năng
    if (
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "Tab" ||
      e.key === "Enter"
    ) {
      return; // Cho phép các phím chức năng
    }

    // Ngăn việc nhập ký tự nếu không phải là số
    if (!/\d/.test(e.key)) {
      e.preventDefault(); // Ngăn việc nhập ký tự không phải số
    }
  });
  changeValueInput.addEventListener("input", function (e) {
    if (parseInt(e.target.value) < 1 || parseInt(e.target.value) > 81) {
      alert("Số ô trống tối thiểu 1 ô và tối đa 55 ô");
      changeValueInput.value = "";
    }
  });

  // check bảng trước khi run
  // kiểm tra bảng hợp lệ
  const isSafe = (board, row, col, num) => {
    // Kiểm tra hàng
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) {
        return false;
      }
    }

    // Kiểm tra cột
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) {
        return false;
      }
    }

    // Kiểm tra khối 3x3
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i + startRow][j + startCol] === num) {
          return false;
        }
      }
    }

    return true;
  };

  // Hàm tìm vị trí trống đầu tiên trên bảng
  const findUnassignedLocation = (board) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          return { row, col };
        }
      }
    }
    return null;
  };

  // Hàm DSatur để giải Sudoku
  const solveSudokuDSatur = (board) => {
    const unassignedPos = findUnassignedLocation(board);

    if (!unassignedPos) {
      return true; // Đã điền đầy đủ, Sudoku đã được giải
    }

    const { row, col } = unassignedPos;

    // Mảng các số 1-9 để thử gán
    for (let num = 1; num <= 9; num++) {
      if (isSafe(board, row, col, num)) {
        board[row][col] = num;

        // Đệ quy tiếp tục giải cho ô tiếp theo
        if (solveSudokuDSatur(board)) {
          return true;
        }

        // Backtrack nếu gán số không thành công
        board[row][col] = 0;
      }
    }

    return false; // Không tìm được lời giải
  };

  // Hàm khởi chạy khi bấm nút Solve
  const aStarSearch = (board) => {
    if (solveSudokuDSatur(board)) {
      console.log("Sudoku đã được giải!");
      console.table(board);
      updateBoardDisplay(board);
    } else {
      console.log("Không tìm được lời giải cho Sudoku.");
    }
  };

  // đếm số lượng ô = 0 (trống)
  const countEmptyCells = (board) => {
    let count = 0;
    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell === 0) {
          // 0 đại diện cho ô trống
          count++;
        }
      });
    });
    console.log(count);
    return count;
  };

  const isValidSudoku = (board) => {
    // Kiểm tra hàng
    for (let row = 0; row < 9; row++) {
      const rowSet = new Set();
      for (let col = 0; col < 9; col++) {
        const num = board[row][col];
        if (num !== 0) {
          if (rowSet.has(num)) {
            return false; // Trùng lặp số trong cùng hàng
          }
          rowSet.add(num);
        }
      }
    }

    // Kiểm tra cột
    for (let col = 0; col < 9; col++) {
      const colSet = new Set();
      for (let row = 0; row < 9; row++) {
        const num = board[row][col];
        if (num !== 0) {
          if (colSet.has(num)) {
            return false; // Trùng lặp số trong cùng cột
          }
          colSet.add(num);
        }
      }
    }

    // Kiểm tra khối 3x3
    for (let blockRow = 0; blockRow < 9; blockRow += 3) {
      for (let blockCol = 0; blockCol < 9; blockCol += 3) {
        const blockSet = new Set();
        for (let row = blockRow; row < blockRow + 3; row++) {
          for (let col = blockCol; col < blockCol + 3; col++) {
            const num = board[row][col];
            if (num !== 0) {
              if (blockSet.has(num)) {
                return false; // Trùng lặp số trong cùng khối 3x3
              }
              blockSet.add(num);
            }
          }
        }
      }
    }

    return true; // Nếu không có xung đột
  };

  const colors = [
    "#FF6F61", // Màu đỏ cam
    "#6B5B93", // Màu tím
    "#88B04B", // Màu xanh lá
    "#F7CAC9", // Màu hồng nhạt
    "#92A8D1", // Màu xanh dương nhạt
    "#955251", // Màu đỏ đậm
    "#B9B24A", // Màu vàng nhạt
    "#D7A9B5", // Màu hồng đậm
    "#5B6C92", // Màu xanh xám
  ];

  // Hàm để lấy màu sắc cho số
  const getColor = (num) => {
    return colors[num - 1] || "#FFFFFF"; // Trả về màu sắc hoặc màu trắng nếu không có màu
  };

  const updateBoardDisplay = (board) => {
    const rowElements = document.querySelectorAll("#sudoku tr");
    rowElements.forEach((rowElement, rowIndex) => {
      const inputElements = rowElement.querySelectorAll("input");
      inputElements.forEach((inputElement, colIndex) => {
        const value = board[rowIndex][colIndex];
        inputElement.value = value !== 0 ? value : "";
        if (value !== 0) {
          inputElement.style.backgroundColor = getColor(value); // Lấy màu theo giá trị
          inputElement.style.color = "#FFFFFF"; // Màu chữ trắng cho dễ đọc
        } else {
          inputElement.style.backgroundColor = "white"; // Màu nền trắng cho ô trống
          inputElement.style.color = "black"; // Màu chữ đen cho ô trống
        }
      });
    });
  };

  // run thuật toán
  const validateAndSolve = () => {
    const startBoard = getBoardDisplay();
    if (isValidSudoku(startBoard)) {
      aStarSearch(startBoard);
    } else {
      alert("Bảng Sudoku không hợp lệ. Vui lòng kiểm tra lại bảng.");
    }
  };

  const btnSolve = document.querySelector(".btn.btn-run");
  btnSolve.addEventListener("click", validateAndSolve);
});
