declare module "js-heap" {
  class Heap {
    constructor(sort?: (a: any, b: any) => number);
    length: number;
    push(node: any): void;
    pop(): any;
    peek(): any;
    isEmpty(): boolean;
    print(): void;
  }
  export = Heap;
}
