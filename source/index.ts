import * as Literal from 'template-literal-table';

function iterator<T extends { [key: string]: unknown }, P extends Parameters<typeof Literal.table>>(parser: (...args: P) => T[]): (...args: P) => (callback: (record: T, index: number, all: T[]) => void) => void {
	return (...args: P) => {
		const records: T[] = parser(...args);

		return (callback: (record: T, index: number, all: T[]) => void) => records.forEach(callback);
	};
}
export function create(...filters: ((...values: unknown[]) => boolean)[]): ReturnType<typeof iterator> {
	return iterator(Literal.create(...filters));
}

export const empty = iterator(Literal.empty);
export const each = Object.assign(iterator(Literal.table), { empty });
export default each;
