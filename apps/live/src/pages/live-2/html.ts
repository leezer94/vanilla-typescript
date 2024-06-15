import { flat, map, pipe, reduce, zip } from '@fxts/core';
import { escapeHtml } from './helper';

// 구조의 문제는 객체지향으로 해결하고 로직의 문제는 함수형으로 해결하라
class Tmpl {
  constructor(
    private strings: TemplateStringsArray,
    private values: unknown[],
  ) {}

  private _escapeHtml(value: unknown) {
    return value instanceof Tmpl ? value.toHtml() : escapeHtml(value);
  }

  // 템플릿 네스팅과 같은 재귀적인 문제를 함수형으로 해결
  toHtml() {
    return pipe(
      zip(
        this.strings,
        concat(
          map((v) => this._escapeHtml(v), this.values),
          [''],
        ),
      ),
      flat,
      reduce((a, b) => a + b),
    );
  }
}

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

const html = (strings: TemplateStringsArray, ...values: unknown[]) => new Tmpl(strings, values);

export function main() {
  const a = 'a';
  const b = `<script></script>`;
  const c = `<img onload=''>`;

  const result = html`<ul>
    <li>${a}</li>
    <li>${b}</li>
    <li>${c}</li>
    <li>
      ${`<ul>
    <li>${a}</li>
    <li>${b}</li>
    <li>${c}</li>  
    <li><ul>
    <li>${a}</li>
    <li>${b}</li>
    <li>${c}</li>  
    <li>${c}</li>
  </ul></li>
  </ul>`}
    </li>
  </ul>`;

  console.log(result.toHtml());

  // console.log(result.next().value);
  // console.log(result.next().value);
  // console.log(result.next().value);
  // console.log(result.next().value);
}
