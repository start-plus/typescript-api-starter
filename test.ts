function getNum() {
  return Promise.resolve(10);
}

const foo = async (
  a: number,
  b: number,
  { c, d }: { c: number; d: number },
) => {
  return (await getNum()) + a + b;
};

console.log(foo.toString());

// foo(1, 2).then(console.log);
