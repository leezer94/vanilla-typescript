function delay<T>(time: number, value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), time));
}

interface File {
  name: string;
  body: string;
  size: number;
}

function getFile(name: string) {
  return delay(1000, { name, body: '....', size: 100 });
}

// 비교대상 이전
// async function concurrent(limit, ps) {
//   await Promise.all([ps[0], ps[1], ps[2]]);
//   await Promise.all([ps[3], ps[4], ps[5]]);
// }
async function concurrent(limit, ps) {
  await Promise.all([ps[0](), ps[1](), ps[2]()]);
  await Promise.all([ps[3](), ps[4](), ps[5]()]);
}

export async function main(): Promise<void> {
  // 부하를 줄이고 싶을때

  console.time();

  // 비교 대상 (이전)
  // const files = await concurrent(3, [
  //   getFile('file1.png'),
  //   getFile('file1.jepg'),
  //   getFile('file1.webp'),
  //   getFile('file1.ppt'),
  //   getFile('file1.ppt'),
  //   getFile('file1.ppt'),
  // ]);

  const files = await concurrent(3, [
    () => getFile('file1.png'),
    () => getFile('file1.jepg'),
    () => getFile('file1.webp'),
    () => getFile('file1.ppt'),
    () => getFile('file1.ppt'),
    () => getFile('file1.ppt'),
  ]);

  console.timeEnd();

  console.log(files);
}
