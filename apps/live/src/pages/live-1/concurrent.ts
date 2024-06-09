function delay<T>(time: number, value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), time));
}

interface File {
  name: string;
  body: string;
  size: number;
}

function getFile(name: string) {
  return delay(3000, { name, body: '....', size: 100 });
}

export async function main(): Promise<void> {
  const file = getFile('file.png');
  const result = await Promise.race([file, delay(2000, 'timeout')]);

  // 늦은 응답에 대한 skeleton ui  / spinner ui 에 응용가능

  if (result === 'timeout') {
    console.log('로딩 / 스켈레톤');

    console.log(await file);
  } else {
    console.log('즉시 렌더링 ', result);
  }

  // 혹은 응답이 너무 늦을경우 사용자의 네트워크 등등 확인

  if (result === 'timeout') {
    console.log('네트워크 환경을 확인해주세요.');
  } else {
    console.log(result);
  }
}
