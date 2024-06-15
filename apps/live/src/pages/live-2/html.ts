import { flat, map, pipe, reduce, zip } from '@fxts/core';
import { escapeHtml } from './helper';

// tagged template literal
function upper(strings: TemplateStringsArray, ...values: string[]) {
  console.log(strings, values);

  return strings[0] + values[0].toUpperCase() + strings[1] + values[1].toUpperCase();
}

// 키워드 지연평가 generator
// 밸류 평가 시점까지 원본 유지 평가시점에 mutation 일어남
// ~ 게 변할거다 라는 약속만 해놓은 객체 완성
function* concat(...arrs) {
  for (const arr of arrs) {
    for (const a of arr) {
      console.log('this console is called when iterator.next() is called');
      yield* a;
    }
  }
}

function html(strings: TemplateStringsArray, ...values: unknown[]) {
  return pipe(
    zip(
      strings,
      concat(
        map((v) => escapeHtml(v), values),
        [''],
      ),
    ),
    flat,
    reduce((a, b) => a + b),
  );
}

export function main() {
  const a = 'a';
  const b = `<script></script>`;
  const c = `<img onload=''>`;

  const result = html`<ul>
    <li>${a}</li>
    <li>${b}</li>
    <li>${c}</li>
  </ul>`;

  console.log(result, 'result');

  // console.log(result.next().value);
  // console.log(result.next().value);
  // console.log(result.next().value);
  // console.log(result.next().value);
}
