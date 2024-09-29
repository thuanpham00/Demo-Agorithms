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

export default MinHeap;
