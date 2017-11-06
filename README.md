# mppg

Materialized Path Pattern Generator - Trees in SQL databases

[![bitHound Overall Score][bithound-overall-image]][bithound-overall-url]
[![bitHound Dependencies][bithound-dep-image]][bithound-dep-url]
[![Build Status][travisci-image]][travisci-url]
[![js-standard-style][js-standard-image]][js-standard-url]
[![NSP Status][nsp-image]][nsp-url]
[![Patreon Donation][patreon-image]][patreon-url]

[![NPM][nodei-npm-image]][nodei-npm-url]

The Materialized Paths pattern is a simple method to store tree or hierarchical data into a flat data store. It stores each tree node as a row in a table. Each row stores the identifiers of the node’s ancestors or path as a string. The Materialized Paths pattern requires additional steps of working with strings and regular expressions however `mppg` helps with this. The pattern also provides more flexibility in working with the path, such as finding nodes by partial paths.

## Installing

Please note that `mppg` is being transpiled and includes a pollyfill for `String.padStart` if it is needed.

* Node: v4.7.0 or later.
* Browser: Not tested however it should work in most browsers.
```sh
npm install mppg
```

## Quick Start

```js

const MPPG = require ('mppg')
const mppg = new MPPG({idLength: 5})

let mpath = mppg.getRootId()
// mpath === '00001'

mpath = mppg.getNextSiblingPath(mpath)
// mpath === '00002'

mpath = mppg.getNextChildPath(mpath)
// mpath === '0000200001'

mpath = mppg.getNextSiblingPath(mpath)
// mpath === '0000200002'

mpath = mppg.getNextSiblingPath(mpath)
// mpath === '0000200003'

mpath = mppg.getNextChildPath(mpath)
// mpath === '000020000300001'

console.log(mppg.getPathLength(mpath))
// 3

console.log(mppg.getParentId(mpath))
// '0000200003'

console.log(mppg.getChildId(mpath))
// '00001' <= The last id in the chain.
```

The following example shows a comment with sample path identifiers and materialized path:

```js

{
  id: 12345, // Your database unique id for this comment.
  mPathId: '00001', // This comments materialized path id.
  mPath: '0005Y0000W00001', // Full materialized path including two parents.
  content: 'Some comment',
  thumbedUp: null
}

// Top level parent mPathId: '0005Y'
// First child mPathId: '0000W'
// This childs mPathId: '00001'
// This childs parent path: '0005Y0000W'

```

## Rational

After researching how to store hierarcical data in an SQL database I discovered there are [many different methods](https://stackoverflow.com/questions/4048151/what-are-the-options-for-storing-hierarchical-data-in-a-relational-database) available.

For my project's use case I decided that the Materialized Path, also known as Lineage Column or Path Enumeration, was the best fit. I was surprised to have difficulty finding a Node.js package to help manage the path identifiers.

I wrote this module to help manage the materialized paths based in some part on a [blog article](https://bojanz.wordpress.com/2014/04/25/storing-hierarchical-data-materialized-path/) by Bojan Živanović.

I am not compressing the path identifiers by removing the leading zeros because disk is cheap and it is easier to read the paths. I may add this feature in the future.

## Function

The `mppg` package uses Base36 encoding to create the path identifiers. Read more about [Base36 encoding on Wikipedia](https://en.wikipedia.org/wiki/Base36). By using Base36 encoding the path identifiers can support far more nodes than if only using decimal digits. Also, the strings produced by the Base36 encoding will sort in node order straight from the database.

You can control the size of the identifiers used for `mppg` by setting the constructor option `idLength`. Setting the `idLength` value to 3 will produce path identifiers similar to `001`. If you set the `idLength` to 6 you will get path identifiers similar to `000001`.

As an example using a `String` or 255 character field in a database, if you set the `idLength` constructor option to five digits, the maximum number of sibling identifiers will be 60,466,175 with a maximum depth of 50. Plenty to support a comment hierarcy or product catalog.

Rather than worry about managing the identifier numbers and converting to Base36, all identifiers in `mppg` are already in Base36 format.

## API

See the jsDoc notes in the [index.js](/index.js) file.

## About the Owner

I, Grant Carthew, am a technologist, trainer, and Dad from Queensland, Australia. I work on code in a number of personal projects and when the need arises I build my own packages.

This project exists because I needed to manage materialized paths.

Everything I do in open source is done in my own time and as a contribution to the open source community.

If you are using my projects and would like to thank me or support me, please click the Patreon link below.

[![Patreon Donation][patreon-image]][patreon-url]

See my [other projects on NPM](https://www.npmjs.com/~grantcarthew).

## Contributing

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request :D

## Change Log

- v1.0.3 [2017-11-06]: Added string testing to getNextId and getPreviousId.
- v1.0.2 [2017-11-05]: More documentation updates.
- v1.0.1 [2017-11-05]: Documentation update. 
- v1.0.0 [2017-11-05]: Initial release. 

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
[nodei-npm-image]: https://nodei.co/npm/mppg.png?downloads=true&downloadRank=true&stars=true
[nodei-npm-url]: https://nodei.co/npm/mppg/
