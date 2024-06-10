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

// 명령형으로 작성
// 타입 맞추기가 힘들고 바쁘다.
async function concurrent<T>(limit: number, fs: (() => Promise<T>)[]) {
  const result: T[][] = [];

  for (let i = 0; i < fs.length / limit; i++) {
    const temp: Promise<T>[] = [];
    for (let j = 0; j < limit; j++) {
      const f = fs[i * limit + j];

      if (f) temp.push(f());
    }

    result.push(await Promise.all(temp));
  }

  return result;
}

// 함수 지연상태를 외부에서 평가해서 조절 가능
// generator function으로 만든 함수는 iterable 이기 떄문에 [...] 스프레드 문법으로 전개가 가능하다.

function* take<T>(length: number, iterable: Iterable<T>) {
  const iterator = iterable[Symbol.iterator]();

  while (length-- > 0) {
    const { value, done } = iterator.next();

    if (done) break;

    yield value;
  }
}

async function concurrent2<T>(limit: number, fs: (() => Promise<T>)[]) {}

export function main(): void {
  // 부하를 줄이고 싶을때

  console.time();

  const iteratorNum: number[] = [...take(8, [1, 2, 3, 4, 5, 6, 7])];
  const iteratorStr: string[] = [...take(8, ['가', '나', '다', '라'])];

  console.log(iteratorNum, iteratorStr);

  // 비교 대상 (이전)
  // const files = await concurrent(3, [
  //   getFile('file1.png'),
  //   getFile('file1.jepg'),
  //   getFile('file1.webp'),
  //   getFile('file1.ppt'),
  //   getFile('file1.ppt'),
  //   getFile('file1.ppt'),
  // ]);

  // const files: File[][] = await concurrent(3, [
  //   () => getFile('file1.png'),
  //   () => getFile('file2.jepg'),
  //   () => getFile('file3.webp'),
  //   () => getFile('file4.ppt'),
  //   () => getFile('file5.ppt'),
  //   () => getFile('file6.ppt'),
  //   () => getFile('file7.ppt'),
  // ]);

  console.timeEnd();

  // flat을 사용하는케이스에 추가
  // 케이스는 많겠지만 동시성관리하면서 이차원배열을 일차원 배열로 만들어줄때
  // console.log(files.flat());
}
