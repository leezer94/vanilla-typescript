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

function* chunk<T>(size: number, iterable: Iterable<T>) {
  const iterator = iterable[Symbol.iterator]();

  // iterator 에서는 무한루프도 호출한 만큼만 실행하기 때문에 브라우저가 잘 죽지 않는다.
  while (true) {
    // iterator 가 확실한지 모르기 떄문에 타입에러가 난다.
    // const arr = [...take(size, iterator)];

    // 인자가 iterator 가 확실하다는것을 명시적으로 알려주기 위해서
    const arr = [
      ...take(size, {
        [Symbol.iterator]() {
          return iterator;
        },
      }),
    ];

    if (arr.length) yield arr;

    if (arr.length < size) break;

    // 개발시에는 무한루프가 도는 상황이 생기더라도 기본 yielding 이 존재하기 때문에 안전하다.
    // yield 'yield safely';
  }
}

function* map<A, B>(f: (a: A) => B, iterable: Iterable<A>): IterableIterator<B> {
  for (const a of iterable) {
    yield f(a);
  }
}

// mock of Array.fromAsync()
async function fromAsync<T>(iterable: Iterable<Promise<T>>) {
  const arr: Awaited<T>[] = [];

  for await (const a of iterable) {
    arr.push(a);
  }

  return arr;
}

// 외부에서 지연적으로 호출을 지연한다.
async function concurrent2<T>(limit: number, fs: (() => Promise<T>)[]) {
  // chunk 의 결과값을 하나씩 실행한다.
  const result = await fromAsync(
    map(
      (ps) => Promise.all(ps),
      map((fs) => fs.map((f) => f()), chunk(limit, fs)),
    ),
  );

  return result.flat();
}

export async function main(): Promise<void> {
  // 부하를 줄이고 싶을때

  console.time();

  // const iterator = chunk(3, [1, 2, 3, 4, 5, 6, 7, 8, 9]);

  // console.log(iterator.next());
  // console.log(iterator.next());

  // [...chunk(3, [1, 2, 3, 4, 5, 6])];
  //[[1,2,3,],[4,5,6]]

  // const iteratorNum: number[] = [...take(8, [1, 2, 3, 4, 5, 6, 7])];
  // const iteratorStr: string[] = [...take(8, ['가', '나', '다', '라'])];

  // console.log(iteratorNum, iteratorStr);

  // 비교 대상 (이전)
  // const files = await concurrent(3, [
  //   getFile('file1.png'),
  //   getFile('file1.jepg'),
  //   getFile('file1.webp'),
  //   getFile('file1.ppt'),
  //   getFile('file1.ppt'),
  //   getFile('file1.ppt'),
  // ]);

  const files = await concurrent2(3, [
    () => getFile('file1.png'),
    () => getFile('file2.jpeg'),
    () => getFile('file3.webp'),
    () => getFile('file4.ppt'),
    () => getFile('file5.ppt'),
    () => getFile('file6.ppt'),
    () => getFile('file7.ppt'),
  ]);

  // console.log(await files.next().value, 'files1');
  // console.log(await files.next().value, 'files2');

  console.log(files, 'files');

  console.timeEnd();

  // flat을 사용하는케이스에 추가
  // 케이스는 많겠지만 동시성관리하면서 이차원배열을 일차원 배열로 만들어줄때
  // console.log(files.flat());
}
