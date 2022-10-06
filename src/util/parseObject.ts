/**
 * Parse JSON object to JavaScript object
 * @param {string} input - Input to parse
 * @returns {any} - Parsed object or false if failed
 */
export const parseObject = (input: string) => {
	try {
		return JSON.parse(input);
	} catch {
		return false;
	}
};
