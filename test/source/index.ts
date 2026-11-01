import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as Each from '../../source';

test('exports', () => {
	assert.deepStrictEqual(Object.keys(Each).sort(), ['create', 'each', 'empty', 'mapper'], 'exports only "create", "mapper", "empty" and "each"');

	assert.ok(typeof Each.each === 'function', 'exports "each" function');
	assert.ok(typeof Each.empty === 'function', 'exports "empty" function');
	assert.ok(typeof Each.create === 'function', 'exports "create" function');
	assert.ok(typeof Each.mapper === 'function', 'exports "mapper" function');
});

const { each: tag } = Each;
const proof = [
	{ letter: undefined, index: undefined },
	{ letter: 'a', index: 1 },
	{ letter: 'b', index: 2 },
	{ letter: 'c', index: 3 },
	{ letter: 'd', index: 4 },
	{ letter: 'e', index: 5 },
	{ letter: undefined, index: undefined },
];

test('each - iterates over every record', () => {
	const sample = proof.slice(1, -1);
	tag`
		letter  | index
		--------|-------
		${'a'}  | ${1}
		${'b'}  | ${2}
		${'c'}  | ${3}
		${'d'}  | ${4}
		${'e'}  | ${5}
	`((record, index, all) => {
		if (!index) {
			assert.equal(all.length, sample.length, `should contain ${sample.length} records`);
		}
		assert.deepStrictEqual(record, sample[index], JSON.stringify(sample[index]));
	});
});

test('empty - iterates over every record', () => {
	const sample = proof.slice();

	Each.empty`
		letter  | index
		--------|-------
		        |
		${'a'}  | ${1}
		${'b'}  | ${2}
		${'c'}  | ${3}
		${'d'}  | ${4}
		${'e'}  | ${5}
	`((record, index, all) => {
		if (!index) {
			assert.equal(all.length, sample.length, `should contain ${sample.length} records`);
		}
		assert.deepStrictEqual(record, sample[index], JSON.stringify(sample[index]));
	});
});

test('create - custom filter', () => {
	const collect: Array<any> = [];
	const none = Each.create(() => false);
	none`
		one | two
		----|-----
			|
		1   |
			| 2
		1   | 2
	`((record: any) => {
		collect.push(record);
	});

	assert.equal(collect.length, 0, 'has 0 items');
});

test('create - fourth (readme example)', () => {
	const sample = [
		{ one: '1', two: '2', three: '3', four: '4' },
		// skips { one: '1', two: '2', three: '3', four: undefined},
		{ one: '1', two: '2', three: undefined, four: '4' },
		{ one: '1', two: undefined, three: '3', four: '4' },
		{ one: undefined, two: '2', three: '3', four: '4' },
	];
	const fourth = Each.create((...values: unknown[]) => Boolean(values[3]) && !/^--+$/.test(String(values[3])));
	fourth`
		one | two | three | four
		----|-----|-------|------
		1   | 2   | 3     | 4
		1   | 2   | 3     |
		1   | 2   |       | 4
		1   |     | 3     | 4
			| 2   | 3     | 4
	`((record, index, all) => {
		if (!index) {
			assert.equal(all.length, sample.length, `should contain ${sample.length} records`);
		}
		assert.deepStrictEqual(record, sample[index], JSON.stringify(sample[index]));
	});
});

test('mapper - casts values', () => {
	const map = Each.mapper<{ foo: number, bar: boolean, baz: Array<string> }>({ foo: Number, bar: (v): boolean => Boolean(Number(v)), baz: (v) => [String(v)] });
	const expected = [
		{ foo: 7, bar: true, baz: ['3'] },
		{ foo: 2, bar: false, baz: ['0'] },
	];
	const records = map`
		foo | bar | baz
		----|-----|-----
		7   | 1   | 3
		2   | 0   | 0
	`((record, index) => {
		assert.deepStrictEqual(record, expected[index], `is mapped to ${JSON.stringify(record)}`);
	});
});

test('each - distinguishes -0 from 0 in consecutive tables', () => {
	const values: Array<unknown> = [];

	tag`
		value
		-----
		${-0}
	`((record) => {
		values.push(record.value);
	});
	tag`
		value
		-----
		${0}
	`((record) => {
		values.push(record.value);
	});

	assert.equal(values.length, 2, 'has 2 values');
	assert.ok(Object.is(values[0], -0), 'keeps -0');
	assert.ok(Object.is(values[1], 0), 'keeps 0');
});

test('each - keeps interpolated syntax characters as values', () => {
	const records: Array<Record<string, unknown>> = [];

	tag`
		value | description
		------|------------
		${'|'} | pipe
	`((record) => {
		records.push(record);
	});

	assert.deepStrictEqual(records, [{ value: '|', description: 'pipe' }]);
});