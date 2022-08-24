# Template literal - each
Tagged template literal to iterate over markdown style tables as objects.

Inspired by the [Jest `test.each`](https://jestjs.io/docs/en/api#2-testeach-each-name-fn-timeout) syntax.


## Installation
```
$ npm install --save template-literal-each
```

## Exports

Being based on the [`template-literal-table` package](https://www.npmjs.com/package/template-literal-table), as of v2.0 `template-literal-each` follows the same capabilities and flexibility

name      | description
----------|-------------
`each`    | Table iterator, skips divider rows (cells only containing two or more `-` characters) and rows consisting of empty cells
`empty`   | Table iterator, skips divider rows, preserves rows consisting of empty cells
`create`  | Table iterator creator, creates a new iterator with custom row filter functions
`mapper`  | Mapping Table iterator creator, creates a new iterator with a mapper to cast each records' properties into the desired type/shape

## API

### `each` (`default`)

The `each` function is the recommended (and prior to v2.0 - the only) use, it iterates table structures as most like intended

```ts
import { each } from 'template-literal-each';

each`
	foo  | bar   | baz
	-----|-------|-----
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

### `empty`
Like the `each` function, with the difference that rows containing only undefined cells are preserved, do note that any newline in the table structure will become a record, regardless of intention. This means that a trailing newline (as shown below) will also result in a record (consisting of only undefined values).

```ts
import { empty } from('template-literal-each');

empty`
	foo  | bar   | baz
	-----|-------|-----
	     |       |
	one
	     | two
	     |       | three
	${1} | ${2}  | ${4}
	${2} | ${4}  | ${8}
	4    | 8     | 16
`((record) => {
	console.log(record);
});

//  { foo: undefined, bar: undefined, baz: undefined},
//  { foo: 'one', bar: undefined, baz: undefined},
//  { foo: undefined, bar: 'two', baz: undefined},
//  { foo: undefined, bar: undefined, baz: 'three'},
//  { foo: 1, bar: 2, baz: 4},
//  { foo: 2, bar: 4, baz: 8},
//  { foo: '4', bar: '8', baz: '16'},
//  { foo: undefined, bar: undefined, baz: undefined},
```

### `create`
The `each` and `empty` functions should cover most scenarios, though sometimes one needs different filter applied to the records passed in. For this purpose the `create` function exists, it allows any number of filters to be specified, which will be applied _before_ the records are created from the values, meaning the filter function will receive all values as separate argument (no reference to the name, though the order represents the same order as the table columns)

The filter function signature is `(...cells: unknown[]) => boolean`, please refer to the underlying [`template-literal-table` Filter tips](https://github.com/rspieker/template-literal-table#filters) for more information.

```ts
import { create } from 'template-literal-table';

// if the fourth column contains a value that is not a divider we want it to be present
const fourth = create((...values: unknown[]) => Boolean(values[3]) && !/^--+$/.test(String(values[3])) );
fourth`
	one | two | three | four
	----|-----|-------|------
	1   | 2   | 3     | 4
	1   | 2   | 3     |
	1   | 2   |       | 4
	1   |     | 3     | 4
	    | 2   | 3     | 4
`((record) => {
	console.log(record);
});

//  { one: '1', two: '2', three: '3', four: '4' },
//  { one: '1', two: '2', three: undefined, four: '4' },
//  { one: '1', two: undefined, three: '3', four: '4' },
//  { one: undefined, two: '2', three: '3', four: '4' },
```

### `mapper`
Sometimes it more convenient to keep the table simple and map the values into different types afterwards, this can now be done by creating a mapping iterator

```ts
import { mapper } from 'template-literal-each';
const map = mapper<{ foo: number, bar: boolean, baz: Array<string> }>({ foo: Number, bar: (v): boolean => Boolean(Number(v)), baz: (v) => [String(v)] });
const records = map`
	foo | bar | baz
	----|-----|-----
	7   | 1   | 3
	2   | 0   | 0
`((record) => {
	console.log(record);
});

// { foo: 7, bar: true, baz: ['3'] },
// { foo: 2, bar: false, baz: ['0'] },
```


## Styles

Tables in Markdown style come in different style, currently we support the following styles. Keep in mind that the cells of the header divider row have to be two characters minimum (e.g. `--`, `:-`, `-:`), this is to allow for cells to contain only `-` (which you could interpret as an explicit form of `N/A`)

The most basic format, only the bare essentials

```
key1|key2|key3
value1|value2|value3
```

Slightly improved readability using some more spacing around column separators

```
key1 | key2 | key3
value1 | value2 | value3
```

As that doesn't really provide more readability, this format is preferred

```
key1   | key2   | key3
-------|--------|--------
value1 | value2 | value3
```

A common format provides a more table-like look and feel

```
| key1   | key2   | key3   |
|--------|--------|--------|
| value1 | value2 | value3 |
```

Some like to have more clear columns

```
| key1   | key2   | key3   |
| ------ | ------ | ------ |
| value1 | value2 | value3 |
```

Although ignored by the `table`-tag, alignment indicators are supported in the header divider

```
key1   | key2   | key3
------:|:------:|:------
value1 | value2 | value3
```

Can be used with spacing around the column separators

```
key1   | key2   | key3
-----: | :----: | :-----
value1 | value2 | value3
```

Also works in combination with borders

```
| key1   | key2   | key3   |
|-------:|:------:|:-------|
| value1 | value2 | value3 |
```

And with both borders and spacing around column separators
```
| key1   | key2   | key3   |
| -----: | :----: | :----- |
| value1 | value2 | value3 |
```


## Tips

### Prettier
_This tip was suggested by @LucasSegersFabro_
If you want prettier to format your tables automatically, you can trick it into thinking it is looking at the Jest each syntax (which unfortunatly a hardcoded pattern within prettier).

```js
import { each } from 'template-literal-each';

// for formatting purposes
const it = {
  each,
};

const test = suite('Common processor tests');

it.each`
  your   | table | here
  -------|-------|------
  thanks | to    | @LucasSegersFabro
`((record) => {
	//...
});
```

### Escaping the pipe character (`|`)

Besides the general character escaping rules in JavaScript/TypeScript strings, sometimes you really want a pipe symbol without resorting to a value (`${'|'}`), this can be done by adding two backslashes before a pipe character: `\\|`, it is actively enforced _not_ to be interpreted as column separator.


# License

MIT License Copyright (c) 2018-2022 Rogier Spieker

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
