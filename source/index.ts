import {
	create as tcreate,
	empty as tempty,
	mapper as tmapper,
	table,
} from 'template-literal-table';

type Item = { [key: string]: unknown };
type Params = Parameters<typeof table>;
type Callback<T extends Item> = (
	record: T,
	index: number,
	all: Array<T>,
) => void;
type EachOf = {
	<T extends Item = Item>(...args: Params): (callback: Callback<T>) => void;
};
type EachFixed<T extends Item> = (
	...args: Params
) => (callback: Callback<T>) => void;

function iterator<T extends Item>(
	parser: (...args: Params) => Array<T>,
): EachFixed<T> {
	return (...args: Params) => {
		const records = parser(...args);
		return (callback: Callback<T>) => records.forEach(callback);
	};
}

export function create(
	...filters: Array<(...values: Array<unknown>) => boolean>
): EachOf {
	return iterator(tcreate(...filters)) as EachOf;
}

export function mapper<T extends Item>(
	...args: Parameters<typeof tmapper<T>>
): EachFixed<T> {
	return iterator(tmapper<T>(...args));
}

export const empty: EachOf = iterator(tempty) as EachOf;
export const each: EachOf & { empty: EachOf } = Object.assign(
	iterator(table) as EachOf,
	{ empty },
);
