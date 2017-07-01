# youtube-comments-stream

Scrape comments (including replies) from a [YouTube](https://www.youtube.com/) video and present as a stream

## Purpose

This is a stream wrapper around [youtube-comment-api](https://github.com/philbot9/youtube-comment-api), which itself is a Promise wrapper around [youtube-comments-task](https://github.com/philbot9/youtube-comments-task)

It presents a readable object stream returning individual comments as objects. For a full description of the returned comment object see documentation for [youtube-comments-task](https://github.com/philbot9/youtube-comments-task)

## Installation

```sh
npm install --save youtube-comments-stream
```

## Sample code

```js
const getCommentsStream = require('youtube-comments-stream');
const videoId = 'HVv-oBN6AWA';
const stream = getCommentsStream(videoId);

stream.on('readable', function () {
	const comment = stream.read();

	if (comment) {
		console.log(comment.text);
		console.log('\n--------\n');
	}
});

stream.on('error', function (err) {
	console.error('ERROR READING COMMENTS:\n', err)
});

stream.on('end', function () {
	console.log('NO MORE COMMENTS');
});

```
