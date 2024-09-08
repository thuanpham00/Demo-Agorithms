// class Heap {
//   constructor(sort) {
//     this._array = [];
//     this._sort = sort;

//     if (typeof this._sort !== "function") {
//       this._sort = (a, b) => a - b;
//     }
//   }

//   get length() {
//     return this._array.length;
//   }

//   push(node) {
//     node = node || {};
//     this._array.push(node);
//     this._bubble();
//   }

//   pop() {
//     if (this.isEmpty()) {
//       return null;
//     }
//     const top = this.peek();
//     const last = this._array.pop();
//     if (this.length > 0) {
//       this._array[0] = last;
//       this._sink();
//     }
//     return top;
//   }

//   peek() {
//     return this._array[0];
//   }

//   isEmpty() {
//     return this.length === 0;
//   }

//   _compare(i, j) {
//     return this._sort(this._array[i], this._array[j]) > 0;
//   }

//   _bubble() {
//     let i = this.length - 1;
//     let j = this._parent(i);

//     while (j !== null && this._compare(i, j)) {
//       this._swap(i, j);
//       i = j;
//       j = this._parent(i);
//     }
//   }

//   _sink() {
//     let i = 0;
//     let lc = this._left(i);
//     let rc = this._right(i);
//     let next;

//     while (lc !== null) {
//       next = lc;
//       if (rc !== null && this._compare(rc, lc)) {
//         next = rc;
//       }
//       if (this._compare(next, i)) {
//         this._swap(i, next);
//         i = next;
//         lc = this._left(i);
//         rc = this._right(i);
//       } else {
//         return;
//       }
//     }
//   }

//   print() {
//     let s = "";
//     let nodes = 1;
//     let values = 0;
//     for (let i = 0; i < this.length; i++) {
//       s += " " + this._array[i].toString();
//       values++;
//       if (values === nodes) {
//         nodes = nodes << 1;
//         values = 0;
//         s += "\n";
//       }
//     }
//     console.log("\n" + s + "\n");
//   }

//   _parent(i) {
//     const pi = ((i - 1) / 2) >> 0;
//     return pi >= 0 ? pi : null;
//   }

//   _left(i) {
//     const li = i * 2 + 1;
//     return li < this.length ? li : null;
//   }

//   _right(i) {
//     const ri = i * 2 + 2;
//     return ri < this.length ? ri : null;
//   }

//   _swap(i, j) {
//     const a = this._array;
//     const v = a[i];
//     a[i] = a[j];
//     a[j] = v;
//   }
// }

// export default Heap;
