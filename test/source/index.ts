import test from 'tape';
import * as Each from '../../source';

test('exports', (t) => {
	t.deepEqual(Object.keys(Each), ['create', 'mapper', 'empty', 'each'], 'exports only "create", "mapper", "empty" and "each"');

	t.true(typeof Each.each === 'function', 'exports "each" function');
	t.true(typeof Each.empty === 'function', 'exports "empty" function');
	t.true(typeof Each.create === 'function', 'exports "create" function');
	t.true(typeof Each.mapper === 'function', 'exports "mapper" function');

	t.end();
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

test('each - iterates over every record', (t) => {
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
			t.equal(all.length, sample.length, `should contain ${sample.length} records`);
		}
		t.deepEqual(record, sample[index], JSON.stringify(sample[index]));
	});

	t.end();
});

test('empty - iterates over every record', (t) => {
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
			t.equal(all.length, sample.length, `should contain ${sample.length} records`);
		}
		t.deepEqual(record, sample[index], JSON.stringify(sample[index]));
	});

	t.end();
});

test('create - custom filter', (t) => {
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

	t.equal(collect.length, 0, 'has 0 items');

	t.end();
});

test('create - fourth (readme example)', (t) => {
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
			t.equal(all.length, sample.length, `should contain ${sample.length} records`);
		}
		t.deepEqual(record, sample[index], JSON.stringify(sample[index]));
	});

	t.end();
});

test('mapper - casts values', (t) => {
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
		t.deepEqual(record, expected[index], `is mapped to ${JSON.stringify(record)}`);
	});

	t.end();
});