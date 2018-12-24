const table = require('template-literal-table');

module.exports = (...args) => {
	const records = table(...args);

	return (callback) => records.forEach(callback);
};
