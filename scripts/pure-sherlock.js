import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

import natural from "natural";

const tokenizer = new natural.WordPunctTokenizer();

export default function main() {
	//  0. Read the file
	const sherlockFile = fs.readFileSync("./lib/sherlock.txt", "utf8");

	//  1. Create an array containing every word
	let sherlock = tokenizer.tokenize(sherlockFile.replaceAll("\n", " "));

	//  2. Remove unnecessary words
	//    A. Join concecutive words that start with Uppercase i.e ['Sherlock', 'Holmes'] -> ['Sherlock Holmes']
	const upperCase = /^[A-Z]/;
	const punctuation = /^[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~-]/;
	for (let i = 0; i < sherlock.length; i += 1) {
		if (
			upperCase.test(sherlock[i])
			&& !punctuation.test(sherlock[i])
			&& upperCase.test(sherlock[i + 1])
			&& !punctuation.test(sherlock[i + 1])
		) {
			sherlock[i] += " ".concat(sherlock[i + 1]);
			sherlock[i + 1] = sherlock[i + 1].toLowerCase();
			if (upperCase.test(sherlock[i + 2]) && !punctuation.test(sherlock[i + 2])) {
				sherlock[i] += " ".concat(sherlock[i + 2]);
				sherlock[i + 2] = sherlock[i + 2].toLowerCase();
			}
		}
	}

	//    B. Remove words that don't start with an uppercase letter but keep periods
	sherlock = sherlock.filter((word) => (upperCase.test(word) || punctuation.test(word)) && word !== "I"); // I is a special case

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

	//  5. Remove dublicates
	//    A. Things that appear more than once
	sherlock = [...new Set(sherlock)];

	//    B. Things that are the same i.e 'Holmes', 'Sherlock', 'Sherlock Holmes'
	sherlock = sherlock.filter((w, i, a) => {
		for (const word of a) {
			if (word.includes(w) && word !== w) {
				return word.length < w.length;
			}
		}

		return true;
	});

	//  6. Sort the results
	sherlock = sherlock.sort();

	//  7. Write them to a file
	try {
		fs.writeFileSync(`${dirname(fileURLToPath(import.meta.url))}/../results/pure.txt`, String(sherlock), ["utf8", 0o666, "w+"]);
		return "Done!";
	} catch (error) {
		return String(error);
	}
}
