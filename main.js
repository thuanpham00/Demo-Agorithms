/**
 *append: Chèn nhiều node hoặc chuỗi văn bản, không thay thế nội dung hiện có.

  appendChild: Chỉ chèn node (phần tử DOM), không chấp nhận chuỗi, chèn cuối nội dung.
  
  insertAdjacentHTML: Chèn chuỗi HTML vào một vị trí cụ thể trong DOM, phân tích cú pháp HTML trực tiếp.
 */

// thay thế cho thư viện heap-js

class MinHeap {
  constructor(compareFn) {
    this.heap = [];
    this.compare = compareFn || ((a, b) => a - b);
  }

  // Trả về số phần tử trong heap
  get length() {
    return this.heap.length;
  }

  // Thêm một phần tử vào heap
  push(value) {
    this.heap.push(value);
    this._bubbleUp(this.heap.length - 1);
  }

  // Lấy phần tử nhỏ nhất và loại bỏ nó khỏi heap
  pop() {
    if (this.length === 0) return null;

    const root = this.heap[0];
    const end = this.heap.pop();
    if (this.length > 0) {
      this.heap[0] = end;
      this._sinkDown(0);
    }
    return root;
  }

  // Xem phần tử nhỏ nhất mà không loại bỏ
  peek() {
    return this.heap[0] || null;
  }

  // Đẩy phần tử lên vị trí chính xác trong heap
  _bubbleUp(index) {
    const element = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (this.compare(element, parent) >= 0) break;

      this.heap[index] = parent;
      index = parentIndex;
    }
    this.heap[index] = element;
  }

  // Đẩy phần tử xuống vị trí chính xác trong heap
  _sinkDown(index) {
    const length = this.heap.length;
    const element = this.heap[index];
    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let swap = null;

      if (leftChildIndex < length) {
        const leftChild = this.heap[leftChildIndex];
        if (this.compare(leftChild, element) < 0) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        const rightChild = this.heap[rightChildIndex];
        if (
          (swap === null && this.compare(rightChild, element) < 0) ||
          (swap !== null && this.compare(rightChild, this.heap[swap]) < 0)
        ) {
          swap = rightChildIndex;
        }
      }

      if (swap === null) break;

      this.heap[index] = this.heap[swap];
      index = swap;
    }
    this.heap[index] = element;
  }
}

const listSudoku = [
  [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ],
  [
    [0, 0, 9, 0, 0, 0, 0, 3, 6],
    [1, 7, 0, 0, 3, 0, 0, 0, 4],
    [3, 6, 0, 0, 0, 4, 0, 5, 0],
    [2, 0, 0, 1, 0, 0, 0, 8, 9],
    [7, 9, 0, 6, 0, 8, 0, 1, 5],
    [8, 5, 0, 0, 0, 9, 0, 0, 3],
    [0, 8, 0, 3, 0, 0, 0, 9, 1],
    [5, 0, 0, 0, 6, 0, 0, 7, 8],
    [9, 1, 0, 0, 8, 0, 3, 0, 0],
  ],
];

// import { listSudoku } from "./examSudoku";

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
        input.readOnly = true;
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
      [...inputItem].forEach((colItem) => (colItem.value = ""));
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

  const checkBoxList = document.querySelectorAll(".inputCheckbox");
  const optionRandom = () => {
    const colInputs = document.querySelectorAll("input[type=text]");
    colInputs.forEach((colInput) => {
      colInput.setAttribute("readOnly", "true");
    });
    inputBlank.removeAttribute("readOnly");
  };
  const optionTypeInput = () => {
    const colInputs = document.querySelectorAll("input[type=text]");
    const inputBlank = document.getElementById("inputNodeBlank");
    colInputs.forEach((colInput) => {
      colInput.removeAttribute("readOnly");
    });

    colInputs.forEach((colItem) =>
      colItem.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, ""); // thay thế các kí tự ngoài số = ""
      })
    );
    inputBlank.setAttribute("readOnly", true);
  };
  checkBoxList.forEach((item) =>
    item.addEventListener("change", () => {
      if (item.value === "user" && item.checked) {
        btnRandom.classList.add("block-btn");
        optionTypeInput();
      } else if (item.value === "random" && item.checked) {
        btnRandom.classList.remove("block-btn");
        optionRandom();
      }
    })
  );

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
        colElement.value = board[rowIndex][colIndex] !== 0 ? board[rowIndex][colIndex] : "";
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

  // run thuật toán
  const btnSolve = document.querySelector(".btn.btn-run");
  btnSolve.addEventListener("click", () => {
    const startBoard = getBoardDisplay();
    console.table(startBoard);
    aStarSearch(startBoard);
  });

  createGridBoard();

  // xử lý trường hợp nếu 81 ô input đều rỗng giá trị sẽ ko chạy thuật toán
  // cần nhập ít nhất 17 ô (quy tắc)
  // function checkInputNull() {
  //   const colInputs = document.querySelectorAll("input[type=text]");

  //   function updateButton() {
  //     let count = 0;
  //     [...colInputs].forEach((item) => {
  //       if (item.value === "") {
  //         count++;
  //       }
  //     });
  //     if (count <= 81 && count >= 64) {
  //       btnSolve.classList.add("block-btn");
  //     } else if (count < 64) {
  //       btnSolve.classList.remove("block-btn");
  //     }
  //   }

  //   colInputs.forEach((item) => item.addEventListener("input", updateButton));
  // }

  // checkInputNull();
  // window.addEventListener("load", checkInputNull);

  // xử lý tạo bảng sudoku ngẫu nhiên
  function initializeBoard() {
    return Array.from({ length: 9 }, () => Array(9).fill(0));
  }

  function createGridSudokuRandom() {
    const newBoard = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {}
    }
    return newBoard;
  }

  function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(board, row, col, num)) {
              board[row][col] = num;
              if (solveSudoku(board)) {
                return true;
              }
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  function removeCells(board, numCellsToRemove) {
    let cellsRemoved = 0;
    while (cellsRemoved < numCellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (board[row][col] !== 0) {
        board[row][col] = 0;
        cellsRemoved++;
      }
    }
  }

  function createGridSudokuRandom() {
    const valueInputBlank = document.getElementById("inputNodeBlank").value;
    const board = initializeBoard();
    solveSudoku(board); // Điền bảng với một giải pháp hợp lệ
    removeCells(board, valueInputBlank); // Xóa số ô cụ thể
    return board;
  }

  createGridSudokuRandom();
});
