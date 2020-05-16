# cbm-sherlock

[![build](https://img.shields.io/github/workflow/status/cbmjs/cbm-sherlock/CI?style=for-the-badge&logo=github&label=)](https://github.com/cbmjs/cbm-sherlock/actions) [![license](https://img.shields.io/github/license/cbmjs/cbm-sherlock.svg?style=for-the-badge)](https://github.com/cbmjs/cbm-sherlock/blob/master/LICENSE)

A small script that uses the cbmjs project to deduce(🕵🏼) the number of characters that appear in the book The Adventures of Sherlock Holmes: A scandal in Bohemia.

## Getting Started

You can use the default configuration with the server running on Heroku and the database running on MLab and just use the default constructor of the cbm class:

```javascript
const CallByMeaning = require("@cbmjs/cbm-api");
const cbm = new CallByMeaning();
```

> Note: this is what I'm doing here.

But, if you don't want to do that, you need to run the [cbmjs Server](https://github.com/cbmjs/cbm-engine) locally and replace the default constructor with your host:

```javascript
const CallByMeaning = require("@cbmjs/cbm-api");
const cbm = new CallByMeaning("https://james.bond:007");
```

Other than that, the comparison between `cbm-sherlock.js` and `pure-sherlock.js` is pretty self-explanatory.
