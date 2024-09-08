/**
 *append: Chèn nhiều node hoặc chuỗi văn bản, không thay thế nội dung hiện có.

  appendChild: Chỉ chèn node (phần tử DOM), không chấp nhận chuỗi, chèn cuối nội dung.
  
  insertAdjacentHTML: Chèn chuỗi HTML vào một vị trí cụ thể trong DOM, phân tích cú pháp HTML trực tiếp.
 */

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
    [5, 3, 4, 6, 7, 8, 9, 1, 0],
    [6, 7, 2, 0, 9, 0, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 0, 6, 7],
    [8, 5, 9, 7, 0, 1, 4, 2, 3],
    [4, 2, 6, 0, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 0, 5, 3, 7, 2, 0, 4],
    [2, 0, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 0, 6, 1, 7, 9],
  ],
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
];

// import { listSudoku } from "./examSudoku";

window.addEventListener("load", function () {
  class Board {
    constructor(board, g, h) {
      this.board = board;
      this.g = g;
      this.h = h;
      this.f = this.g + this.h;
      this.parent = null;
    }
  }

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
        row.appendChild(col);
      }
      grid.appendChild(row);
    }
  };

  const getBoardDisplay = () => {
    const board = [];
    const rowElements = document.querySelectorAll("#sudoku tr");
    rowElements.forEach((rowElement) => {
      const inputElements = rowElement.querySelectorAll("input");
      const row = [];
      inputElements.forEach((inputElement) => {
        row.push(inputElement.value ? parseInt(inputElement.value) : 0);
      });
      board.push(row);
    });
    return board;
  };

  const calculateNodeFilled_G = (board) => {
    return board.flat().filter((cell) => cell !== 0).length;
  };

  const calculateNodeNotFill_H = (board) => {
    return board.flat().filter((cell) => cell === 0).length;
  };

  const createGridFromDisplay = (board) => {
    const g = calculateNodeFilled_G(board);
    const h = calculateNodeNotFill_H(board);
    return new Board(board, g, h);
  };

  let lastIndex = -1;
  const btnRandom = document.querySelector(".randomButton");
  btnRandom.addEventListener("click", handleRandom);

  function handleRandom() {
    handleClear();
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * listSudoku.length);
    } while (randomIndex === lastIndex);

    lastIndex = randomIndex;
    const boardNew = listSudoku[randomIndex];
    const rowElements = document.querySelectorAll("tr");
    rowElements.forEach((rowElement, rowIndex) => {
      const colElements = rowElement.querySelectorAll("input");
      colElements.forEach((colElement, colIndex) => {
        colElement.value = boardNew[rowIndex][colIndex] !== 0 ? boardNew[rowIndex][colIndex] : "";
      });
    });
  }

  const btnClear = document.querySelector(".btn.btn-clear");
  btnClear.addEventListener("click", handleClear);

  function handleClear() {
    document.querySelectorAll("input").forEach((input) => (input.value = ""));
  }

  const btnSave = document.querySelector(".btn.btn-save");
  btnSave.addEventListener("click", handleSave);

  function handleSave() {
    return createGridFromDisplay(getBoardDisplay());
  }

  const checkBoxList = document.querySelectorAll(".inputCheckbox");
  const colInputs = document.querySelectorAll("input[type=text]");

  const optionRandom = () => {
    colInputs.forEach((colInput) => colInput.setAttribute("readOnly", "true"));
  };

  const optionTypeInput = () => {
    colInputs.forEach((colInput) => {
      colInput.removeAttribute("readOnly");
      colInput.value = "";
    });
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
    for (let j = 0; j < 9; j++) if (board[row][j] === num) return false;
    for (let i = 0; i < 9; i++) if (board[i][col] === num) return false;

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (board[i][j] === num) return false;
      }
    }
    return true;
  };

  const costFunction = (board) => {
    return calculateNodeFilled_G(board);
  };

  const heuristic = (board) => {
    let emptyCells = calculateNodeNotFill_H(board);
    let conflictCount = 0;

    for (let row = 0; row < 9; row++) {
      const seen = new Set();
      for (let col = 0; col < 9; col++) {
        const num = board[row][col];
        if (num !== 0) {
          if (seen.has(num)) conflictCount++;
          seen.add(num);
        }
      }
    }

    for (let col = 0; col < 9; col++) {
      const seen = new Set();
      for (let row = 0; row < 9; row++) {
        const num = board[row][col];
        if (num !== 0) {
          if (seen.has(num)) conflictCount++;
          seen.add(num);
        }
      }
    }

    for (let blockRow = 0; blockRow < 9; blockRow += 3) {
      for (let blockCol = 0; blockCol < 9; blockCol += 3) {
        const seen = new Set();
        for (let row = blockRow; row < blockRow + 3; row++) {
          for (let col = blockCol; col < blockCol + 3; col++) {
            const num = board[row][col];
            if (num !== 0) {
              if (seen.has(num)) conflictCount++;
              seen.add(num);
            }
          }
        }
      }
    }

    return emptyCells + 2 * conflictCount;
  };

  const generateNextStates = (currentState) => {
    const nextStates = [];
    const { board } = currentState;
    const emptyCells = [];

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === 0) emptyCells.push({ row: i, col: j });
      }
    }

    emptyCells.forEach(({ row, col }) => {
      for (let num = 1; num <= 9; num++) {
        if (isValidPlacement(board, row, col, num)) {
          const newBoard = board.map((row) => row.slice());
          newBoard[row][col] = num;
          const g = costFunction(newBoard);
          const h = heuristic(newBoard);
          const newState = new Board(newBoard, g, h);
          nextStates.push(newState);
        }
      }
    });

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

  const aStarSearch = (startBoard) => {
    const openList = new MinHeap((a, b) => a.f - b.f);
    const closeList = new Set();

    const startState = new Board(
      startBoard,
      calculateNodeFilled_G(startBoard),
      calculateNodeNotFill_H(startBoard)
    );

    openList.push(startState);

    while (openList.length > 0) {
      const currentState = openList.pop();
      const { board } = currentState;

      if (calculateNodeNotFill_H(board) === 0) {
        updateBoardOnUI(board);
        return;
      }

      const nextStates = generateNextStates(currentState);

      nextStates.forEach((state) => {
        const boardString = JSON.stringify(state.board);
        if (!closeList.has(boardString)) {
          closeList.add(boardString);
          openList.push(state);
        }
      });
    }

    alert("Không tìm thấy lời giải");
  };

  const btnSolve = document.querySelector(".btn.btn-run");
  btnSolve.addEventListener("click", () => {
    const startBoard = getBoardDisplay();
    console.table(startBoard);
    aStarSearch(startBoard);
  });

  createGridBoard();
});

/**
 * là các giá trị thoa mãn điều kiện (trạng thái mới , cập nhật bảng) sau đó lưu vào nextStates, chạy thuật toán A* nó lấy thằng nhỏ nhất (f) đúng ko
 */

// [
//   [1, 0, 0, 0, 0, 7, 0, 9, 0],
//   [0, 0, 3, 0, 0, 2, 0, 0, 8],
//   [0, 0, 9, 6, 0, 0, 5, 0, 0],
//   [0, 0, 5, 3, 0, 0, 9, 0, 0],
//   [0, 0, 1, 0, 0, 8, 0, 0, 0],
//   [2, 6, 0, 0, 0, 4, 0, 0, 0],
//   [3, 0, 0, 0, 0, 0, 0, 1, 0],
//   [0, 0, 4, 0, 0, 0, 0, 0, 0],
//   [0, 7, 0, 0, 7, 0, 0, 0, 3],
// ],
