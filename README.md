# multi-dir-shell
[![npm version](https://badge.fury.io/js/multi-dir-shell.svg)](https://badge.fury.io/js/multi-dir-shell)
[![Gzip Size](http://img.badgesize.io/https://unpkg.com/multi-dir-shell@latest/dist/multi-dir-shell.umd.min.js?compression=gzip&style=flat-square)](https://unpkg.com/multi-dir-shell)
[![Monthly Downloads](https://img.shields.io/npm/dm/multi-dir-shell.svg)](https://www.npmjs.com/package/multi-dir-shell)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

At this stage, only directories containing multiple git projects are supported.

## Installation

Install

```sh
$ npm install multi-dir-shell -g
# or
$ yarn global add multi-dir-shell
# or
$ pnpm add multi-dir-shell -g
```

## Usage

```shell
bgit add .
bgit commit -m "commit multi git project."
bgit push

bbb touch a.txt
bbb git add a.txt
bbb gti commit -m "add 'a.txt' to multi git project."
bbb git push
```

### MIT License

### Copyright &copy; 2022 LinQuan.
