export interface Test {
  key: string
}

export function hello(test: Test) {
  console.log(test.key)
}
