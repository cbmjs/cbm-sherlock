const pure = require('./scripts/pure-sherlock');
const cbm = require('./scripts/cbm-sherlock');

console.log('pure-sherlock returned:', pure());
(async () => {
	try {
		const res = await cbm();
		console.log(`cbm-sherlock returned: ${res}`);
	} catch (err) {
		console.error(`cbm-sherlock returned: ${err}`);
	}
})();
