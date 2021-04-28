interface Args {
  add(arg: string): void;
  consume(): void;
  drain(): string[];
  peek(): string | null;
}

export function Args(argv: string[]): Args {
  const items = [...argv].reverse();

  return {
    add(arg) {
      items.push(arg);
    },

    consume() {
      if (!this.peek()) {
        throw new Error();
      }

      items.pop();
    },

    drain() {
      return items.splice(0, items.length).reverse();
    },

    peek() {
      return items[items.length - 1] ?? null;
    },
  };
}
