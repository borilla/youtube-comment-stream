# youtube-comments-stream

[![npm version](https://badge.fury.io/js/youtube-comments-stream.svg)](https://badge.fury.io/js/youtube-comments-stream)

Scrape comments (including replies) from a [YouTube](https://www.youtube.com/) video and present as a stream

## Purpose

This is a stream wrapper around [youtube-comment-api](https://github.com/philbot9/youtube-comment-api), which itself is a Promise wrapper around [youtube-comments-task](https://github.com/philbot9/youtube-comments-task)

It presents a readable object stream returning individual comments as objects. For a full description of the returned comment object see documentation for [youtube-comments-task](https://github.com/philbot9/youtube-comments-task)

## Installation

```sh
npm install --save youtube-comments-stream
```

## API

The module contains three functions:

* `get(VIDEO_ID)`: Get a readable stream of all comments from the video
* `limit(MAX_COMMENTS)`: Get a transform stream to limit the number of items in a comments stream
* `filter(FILTER_FN)`: Get a transform stream to filter a comments stream

### Notes

`FILTER_FN` is a function that receives a comment as a parameter and returns a boolean, eg:

```js
function FILTER_FN(comment) {
	return comment.author === 'john';
}
```

For convenience the module itself is a function the same as `get()`, ie

```js
const commentsStream = require('youtube-comments-stream');

const stream = commentsStream(VIDEO_ID);
// ...is exactly the same as
const stream = commentsStream.get(VIDEO_ID);
```

## Examples

### Read all comments from a video

```js
const getCommentsStream = require('youtube-comments-stream');

const VIDEO_ID = 'HVv-oBN6AWA';
const stream = getCommentsStream(VIDEO_ID);

stream.on('readable', function () {
	const comment = stream.read();

	if (comment) {
		console.log(comment.text);
	}
});

stream.on('error', function (err) {
	console.error('ERROR READING COMMENTS:', err)
});

stream.on('end', function () {
	console.log('NO MORE COMMENTS');
	process.exit();
});
```

### Read only the first 5 comments from a video

```js
const commentsStream = require('youtube-comments-stream');

const VIDEO_ID = 'HVv-oBN6AWA';
const MAX_COMMENTS = 5;
const limit = commentsStream.limit(MAX_COMMENTS);
const stream = commentsStream.get(VIDEO_ID).pipe(limit);

stream.on('readable', function () {
	const comment = stream.read();

	if (comment) {
		console.log(comment.text);
	}
});

/* ... */
```

### Read comments by author

(that appear in the first 1000 video comments)

```js
const commentsStream = require('youtube-comments-stream');

const VIDEO_ID = 'kpaFizGUJg8';
const MAX_COMMENTS = 1000;
const AUTHOR = 'nokomis mn';
const limit = commentsStream.limit(MAX_COMMENTS);
const filter = commentsStream.filter(comment => comment.author === AUTHOR);
const stream = commentsStream.get(VIDEO_ID).pipe(limit).pipe(filter);

stream.on('readable', function () {
	const comment = stream.read();

	if (comment) {
		console.log(comment.text);
	}
});

/* ... */
```

### Read the first 8 comments that contain the text "NASA"

```js
const commentsStream = require('youtube-comments-stream');

const VIDEO_ID = 'ZuToYSYdJS0';
const REGEX = /nasa/i;
const MAX_COMMENTS = 8;
const filter = commentsStream.filter(comment => REGEX.test(comment.text));
const limit = commentsStream.limit(MAX_COMMENTS);
const stream = commentsStream.get(VIDEO_ID).pipe(filter).pipe(limit);

stream.on('readable', function () {
	const comment = stream.read();

	if (comment) {
		console.log(comment.text);
	}
});

/* ... */
```
