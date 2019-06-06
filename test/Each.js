const { expect } = require('@hapi/code');
const { describe, it } = exports.lab = require('@hapi/lab').script();

const each = require('../source/tag.js');

describe('Each', () => {
	const proof = [
		{ letter: 'a', index: 1 },
		{ letter: 'b', index: 2 },
		{ letter: 'c', index: 3 },
		{ letter: 'd', index: 4 },
		{ letter: 'e', index: 5 },
	];

	it('iterates over every record', () => {
		each`
			letter  | index
			${'a'}  | ${1}
			${'b'}  | ${2}
			${'c'}  | ${3}
			${'d'}  | ${4}
			${'e'}  | ${5}
		`((record, index) => {
			expect(record).to.equal(proof[index]);
		});
	});
});
