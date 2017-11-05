# mppg

Materialized Path Pattern Generator - Trees in SQL databases

[![bitHound Overall Score][bithound-overall-image]][bithound-overall-url]
[![bitHound Dependencies][bithound-dep-image]][bithound-dep-url]
[![Build Status][travisci-image]][travisci-url]
[![js-standard-style][js-standard-image]][js-standard-url]
[![NSP Status][nsp-image]][nsp-url]
[![Patreon Donation][patreon-image]][patreon-url]

[![NPM][nodei-npm-image]][nodei-npm-url]

> The Materialized Paths pattern stores each tree node in a table; in addition to the tree node, each row stores as a string the id(s) of the node’s ancestors or path. Although the Materialized Paths pattern requires additional steps of working with strings and regular expressions, the pattern also provides more flexibility in working with the path, such as finding nodes by partial paths.

## Rational

After researching how to store hierarcical data in an SQL database I discovered there are [many different methods](https://stackoverflow.com/questions/4048151/what-are-the-options-for-storing-hierarchical-data-in-a-relational-database) available.

For my project's use case I decided that the Materialized Path, also known as Lineage Column or Path Enumeration, was the best fit. I was surprised to have difficulty finding a Node.js package to help manage the path ids.

I wrote this module to help manage the materialized paths based in some part on a [blog article](https://bojanz.wordpress.com/2014/04/25/storing-hierarchical-data-materialized-path/) by Bojan Živanović.

I am not compressing the path ids by removing the leading zeros because disk is cheap and it is easier to read the paths. I may add this feature in the future.

## Installing

mppg is not being transpiled. I have not tested which versions of Node.js the package will work on.

```sh
npm install mppg
```

## Quick Start

```js

const MPPG = require ('mppg')
const mppg = new MPPG({idLength: 5})

let mpath = mppg.getRootId()
// path === '00001'

mpath = mppg.getNextSiblingPath(mpath)
// id === '00002'

mpath = mppg.getNextSiblingPath(mpath)
// id === '0000200001'

mpath = mppg.getNextSiblingPath(mpath)
// id === '0000200002'

mpath = mppg.getNextSiblingPath(mpath)
// id === '0000200003'

mpath = mppg.getNextChildPath(mpath)
// id === '000020000300001'

console.log(mppg.getPathLength(mpath))
// 3

console.log(mppg.getParentId(mpath))
// '0000200003'

console.log(mppg.getChildId(mpath))
// '00001' <= The last id in the chain.
```

## API

See the jsDoc notes in the index.js file.

[bithound-overall-image]: https://www.bithound.io/github/grantcarthew/node-mppg/badges/score.svg
[bithound-overall-url]: https://www.bithound.io/github/grantcarthew/node-mppg
[bithound-dep-image]: https://www.bithound.io/github/grantcarthew/node-mppg/badges/dependencies.svg
[bithound-dep-url]: https://www.bithound.io/github/grantcarthew/node-mppg/master/dependencies/npm
[travisci-image]: https://travis-ci.org/grantcarthew/node-mppg.svg?branch=master
[travisci-url]: https://travis-ci.org/grantcarthew/node-mppg
[js-standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[js-standard-url]: http://standardjs.com/
[mppg-url]: https://github.com/grantcarthew/node-mppg
[bithound-code-image]: https://www.bithound.io/github/grantcarthew/node-mppg/badges/code.svg
[bithound-code-url]: https://www.bithound.io/github/grantcarthew/node-mppg
[nsp-image]: https://nodesecurity.io/orgs/openjs/projects/3871d340-0ca9-471c-be9a-39df3871262d/badge
[nsp-url]: https://nodesecurity.io/orgs/openjs/projects/3871d340-0ca9-471c-be9a-39df3871262d
[patreon-image]: https://img.shields.io/badge/patreon-donate-yellow.svg
[patreon-url]: https://www.patreon.com/grantcarthew
[nodei-npm-image]: https://nodei.co/npm/scalable-blob-store.png?downloads=true&downloadRank=true&stars=true
[nodei-npm-url]: https://nodei.co/npm/scalable-blob-store/
