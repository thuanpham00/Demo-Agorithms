// thay thế cho thư viện heap-js

import createGridSudokuRandom from "./GenerateSudoku.js";
import MinHeap from "./heap.js";

window.addEventListener("load", function () {
  // khởi tạo 1 node (bảng)
  class Board {
    constructor(board, g, h) {
      this.board = board;
      this.g = g;
      this.h = h;
      this.f = this.g + this.h;
    }
  }

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

  // hàm này lấy số ô đã điền
  const calculateNodeFilled_G = (board) => {
    return board.flat().filter((cell) => cell !== 0).length;
  };

  // hàm này lấy số ô chưa điền
  const calculateNodeNotFill_H = (board) => {
    return board.flat().filter((cell) => cell === 0).length;
  };

  // hàm này tạo 1 đối tượng Board từ cái bảng hiện tại truyền vào
  // tính toán các chi phí g và h
  // const createGridFromDisplay = (board) => {
  //   const g = calculateNodeFilled_G(board);
  //   const h = calculateNodeNotFill_H(board);
  //   console.table(board);
  //   return new Board(board, g, h);
  // };

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
      });
    });
  }

  // xử lý random
  const btnRandom = document.querySelector(".randomButton");
  btnRandom.addEventListener("click", handleRandom);
  function handleRandom() {
    handleClear();
    const board = createGridSudokuRandom();
    const rowBoard = document.querySelectorAll("tr");
    [...rowBoard].forEach((rowItem, rowIndex) => {
      const colBoard = rowItem.querySelectorAll("input"); // lấy các cột từ mỗi hàng truy vấn

      [...colBoard].forEach((colItem, colIndex) => {
        colItem.value = board[rowIndex][colIndex] !== 0 ? board[rowIndex][colIndex] : "";
      });
    });
  }

  // xử lý input ô trống
  // xử lý chỉ được nhập số và tối thiểu 1 <= value <= 9
  const inputElements = document.querySelectorAll('input[type="text"]');
  [...inputElements].forEach((itemInput) =>
    itemInput.addEventListener("keydown", function (e) {
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

      if (!/[\d\b]/.test(e.key)) {
        e.preventDefault();
      }
    })
  );
  [...inputElements].forEach((itemInput) =>
    itemInput.addEventListener("input", function (e) {
      itemInput.value = itemInput.value.replace(/\D/g, "");
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
    if (parseInt(e.target.value) < 1 || parseInt(e.target.value) > 55) {
      alert("Số ô trống tối thiểu 1 ô và tối đa 55 ô");
      changeValueInput.value = "";
    }
  });

  const isValidPlacement = (board, row, col, num) => {
    // nếu trên hàng này có cột nào đó trong mảng đã từng xuất hiện thì trả false -> số này không hợp lệ (num)
    for (let j = 0; j < 9; j++) {
      if (board[row][j] === num) {
        return false;
      }
    }

    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) {
        return false;
      }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (board[i][j] === num) {
          return false;
        }
      }
    }
    return true;
  };

  const costFunction = (board) => {
    return calculateNodeFilled_G(board);
  };

  // hàm này truyền vào 1 trạng thái bảng hiện tại -> trả về 1 giá trị xung đột của bảng hiện tại - h
  const heuristic = (board) => {
    let conflictCount = 0;

    // Kiểm tra xung đột trong hàng và cột
    for (let i = 0; i < 9; i++) {
      // Set: lưu trữ trạng thái duy nhất của 1 giá trị. nếu có rồi ko add nữa
      // dùng nó đếm xung đột
      // xung đột càng thấp thì trạng thái bảng hiện tại gần gũi trạng thái hoàn chỉnh
      // xung đột càng cao ngược lại
      const rowSeen = new Set();
      const colSeen = new Set();
      for (let j = 0; j < 9; j++) {
        // Kiểm tra xung đột hàng
        if (board[i][j] !== 0) {
          if (rowSeen.has(board[i][j])) conflictCount++; // nếu có rồi thì đếm
          rowSeen.add(board[i][j]);
        }
        // Kiểm tra xung đột cột
        if (board[j][i] !== 0) {
          if (colSeen.has(board[j][i])) conflictCount++;
          colSeen.add(board[j][i]);
        }
      }
    }

    // Kiểm tra xung đột trong các khối 3x3
    for (let blockRow = 0; blockRow < 9; blockRow += 3) {
      for (let blockCol = 0; blockCol < 9; blockCol += 3) {
        const blockSeen = new Set();
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const num = board[blockRow + i][blockCol + j];
            if (num !== 0) {
              if (blockSeen.has(num)) conflictCount++;
              blockSeen.add(num);
            }
          }
        }
      }
    }

    // Trọng số heuristic bao gồm số xung đột
    return conflictCount;
  };

  // hàm này truyền vào 1 trạng thái bảng hiện tại -> trả về các trạng thái tiếp theo từ bảng hiện tại
  const generateNextStates = (currentState) => {
    const nextStates = [];
    const { board } = currentState;
    let minChoices = 10; // Số lượng lựa chọn tối thiểu cho một ô
    let minCell = null;

    // Tìm ô trống có ít lựa chọn nhất
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const validNumbers = [];
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(board, row, col, num)) {
              validNumbers.push(num);
            }
          }
          if (validNumbers.length < minChoices) {
            minChoices = validNumbers.length;
            minCell = { row, col, validNumbers };
          }
        }
      }
    }

    // Nếu tìm được ô trống có ít lựa chọn nhất, sinh các trạng thái từ ô này
    // ví dụ có 2 số tm trong validNumbers thì lưu 2 trạng thái kế tiếp vào
    if (minCell) {
      minCell.validNumbers.forEach((num) => {
        const newBoard = board.map((r) => r.slice()); // tạo bản sao cho board
        newBoard[minCell.row][minCell.col] = num;
        const g = costFunction(newBoard);
        const h = heuristic(newBoard);
        nextStates.push(new Board(newBoard, g, h));
      });
    }

    return nextStates;
  };

  const updateBoardOnUI = (board) => {
    const rowElements = document.querySelectorAll("#sudoku tr");
    rowElements.forEach((rowElement, rowIndex) => {
      const colElements = rowElement.querySelectorAll("input");
      colElements.forEach((colElement, colIndex) => {
        if (colElement.value === "") {
          colElement.value = board[rowIndex][colIndex];
          colElement.style.backgroundColor = "orange";
        } else if (colElement.value !== 0) {
          colElement.style.backgroundColor = "white";
        }
      });
    });
  };

  const boardToString = (board) => {
    return board.map((row) => row.join(",")).join(";");
  };

  const aStarSearch = (startBoard) => {
    const openList = new MinHeap((a, b) => a.f - b.f);
    const closeList = new Set();

    const startState = new Board(startBoard, calculateNodeFilled_G(startBoard), heuristic(startBoard));

    openList.push(startState);

    while (openList.length > 0) {
      const currentState = openList.pop(); // lấy ra thằng f nhỏ nhất
      const { board } = currentState;

      // Kiểm tra nếu tất cả các ô đã được điền
      if (calculateNodeNotFill_H(board) === 0) {
        updateBoardOnUI(board);
        return;
      }

      const boardString = boardToString(board);
      if (closeList.has(boardString)) {
        continue;
      }
      closeList.add(boardString);

      const nextStates = generateNextStates(currentState);

      nextStates.forEach((state) => {
        openList.push(state);
      });
    }

    alert("Không tìm thấy lời giải");
  };

  // check bảng trước khi run
  // kiểm tra bảng hợp lệ
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
    return count;
  };

  // run thuật toán
  const validateAndSolve = () => {
    const startBoard = getBoardDisplay();
    const emptyCell = countEmptyCells(startBoard);
    if (emptyCell < 1 || emptyCell > 55) {
      alert("Số lượng ô trống phải lớn hoặc bằng 1 và nhỏ hơn hoặc bằng 55.");
    } else {
      if (isValidSudoku(startBoard)) {
        console.table(startBoard);
        aStarSearch(startBoard);
      } else {
        alert("Bảng Sudoku không hợp lệ. Vui lòng kiểm tra lại bảng.");
      }
    }
  };
  const btnSolve = document.querySelector(".btn.btn-run");
  btnSolve.addEventListener("click", validateAndSolve);

  // tạo bảng UI
  createGridBoard();

  // xử lý tạo bảng ngẫu nhiên
  createGridSudokuRandom();
});
