import { flat, map, pipe, reduce, zip } from '@fxts/core';

// tagged template literal
function upper(strings: TemplateStringsArray, ...values: string[]) {
  console.log(strings, values);

  return strings[0] + values[0].toUpperCase() + strings[1] + values[1].toUpperCase();
}

function html(strings: TemplateStringsArray, ...values: unknown[]) {
  values.push('');

  return pipe(
    zip(
      strings,
      map((v) => `${v}`, values),
    ),
    flat,
    reduce((a, b) => a + b),
  );
}

export function main() {
  const a = 'a';
  const b = 1;
  const c = 'c';

  const result = html`1${a}2${b}3${c}4`;

  console.log(result, 'result');

  // console.log(result.next().value);
  // console.log(result.next().value);
  // console.log(result.next().value);
  // console.log(result.next().value);
}
