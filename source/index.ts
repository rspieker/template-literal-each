import { table, create as tcreate, empty as tempty } from "template-literal-table";

function iterator<T extends { [key: string]: unknown }, P extends Parameters<typeof table>>(parser: (...args: P) => Array<T>): (...args: P) => (callback: (record: T, index: number, all: Array<T>) => void) => void {
	return (...args: P) => {
		const records: Array<T> = parser(...args);

		return (callback: (record: T, index: number, all: Array<T>) => void) => records.forEach(callback);
	};
}
export function create(...filters: Array<((...values: Array<unknown>) => boolean)>): ReturnType<typeof iterator> {
	return iterator(tcreate(...filters));
}

export const empty = iterator(tempty);
export const each = Object.assign(iterator(table), { empty });
