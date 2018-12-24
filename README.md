# Template literal - each
Tagged template literal to iterate over markdown style tables as objects.

Inspired by the [Jest `test.each`](https://jestjs.io/docs/en/api#2-testeach-each-name-fn-timeout) syntax.


## Installation
```
$ npm install --save template-literal-each
```

## Usage
```js
const each = require('template-literal-each');

const records = each`
	foo  | bar   | baz
	${1} | ${2}  | ${4}
	${2} | ${4}  | ${8}
	4    | 8     | 16
`((record) => {
	console.log(record);
});

//  { foo: 1, bar: 2, baz: 4},
//  { foo: 2, bar: 4, baz: 8},
//  { foo: '4', bar: '8', baz: '16'},
```

# License

MIT License Copyright (c) 2018 Rogier Spieker

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
