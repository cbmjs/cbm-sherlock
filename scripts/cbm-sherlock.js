import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

import CallByMeaning from "@cbmjs/cbm-api";
import requireFromString from "require-from-string";

const cbm = new CallByMeaning();

export default async function main() {
	//  *0. Read the file
	const readFile = requireFromString((await cbm.call(["file", "mode"], [null, "read"], "file", null, true)).body);
	const sherlockFile = readFile("./lib/sherlock.txt");

	//  *1. Create an array containing every word
	let sherlock = (await cbm.call("string", null, [sherlockFile], "array", "token")).body;

	//  *2. Remove unnecessary words
	//    ~*A. Join concecutive words that start with Uppercase i.e ['Sherlock', 'Holmes'] -> ['Sherlock Holmes']
	const capitalize = requireFromString((await cbm.call("string", null, "string", "capitalized", true)).body);
	const punctuation = new RegExp(/^[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~-]/);
	for (let i = 0; i < sherlock.length - 2; i += 1) {
		if (
			sherlock[i] === capitalize(sherlock[i])
			&& !punctuation.test(sherlock[i])
			&& sherlock[i + 1] === capitalize(sherlock[i + 1])
			&& !punctuation.test(sherlock[i + 1])
		) {
			sherlock[i] += " ".concat(sherlock[i + 1]);
			sherlock[i + 1] = sherlock[i + 1].toLowerCase();
			if (sherlock[i + 2] === capitalize(sherlock[i + 2]) && !punctuation.test(sherlock[i + 2])) {
				sherlock[i] += " ".concat(sherlock[i + 2]);
				sherlock[i + 2] = sherlock[i + 2].toLowerCase();
			}
		}
	}
	//    ~*B. Remove words that don't start with an uppercase letter but keep periods
	sherlock = sherlock.filter((word) => (word === capitalize(word) || punctuation.test(word)) && word !== "I"); // I is a special case

	//  3. Remove words that are after a punctuation point (and also the point itself)
	const temp = [];

	for (let i = 0; i < sherlock.length; i += 1) {
		if (!punctuation.test(sherlock[i]) && !punctuation.test(sherlock[i - 1])) {
			temp.push(sherlock[i]);
		}
	}
	sherlock = temp;

	//  4. Remove words that are in ALL CAPS
	sherlock = sherlock.filter((word) => word !== word.toUpperCase());

	//  *5. Remove dublicates
	//    *A. Things that appear more than once
	sherlock = (await cbm.call("array", null, [JSON.stringify(sherlock)], "array", "unique")).body;
	//    B. Things that are the "same" i.e 'Holmes', 'Sherlock', 'Sherlock Holmes'
	sherlock = sherlock.filter((w, i, a) => {
		for (const word of a) {
			if (word.includes(w) && word !== w) {
				return word.length < w.length;
			}
		}
		return true;
	});

	//  *6. Sort the results
	sherlock = (await cbm.call(["array", "function"], null, [JSON.stringify(sherlock)], "array", "sorted")).body;

	// *BONUS. Remove Irene Adler because I don't like her
	sherlock = (await cbm.call(
		["array", "values", "boolean_operator"], [null, null, "xor"], [JSON.stringify(sherlock), "Irene Adler"], "array", null,
	)
	).body;

	//  *7. Write them to a file
	const writeFile = requireFromString((await cbm.call(["file", "mode"], [null, "write"], "file", null, true)).body);
	writeFile(String(sherlock), `${dirname(fileURLToPath(import.meta.url))}/../results/cbm.txt`);

	return "Done!";
}
