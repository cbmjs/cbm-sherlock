import pure from "./scripts/pure-sherlock.js";
import cbm from "./scripts/cbm-sherlock.js";

console.log("pure-sherlock returned:", pure());
try {
	const res = await cbm();
	console.log(`cbm-sherlock returned: ${res}`);
} catch (error) {
	console.error(`cbm-sherlock returned: ${error}`);
}
