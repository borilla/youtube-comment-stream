# youtube-comments-stream

Scrape comments (including replies) from a [YouTube](https://www.youtube.com/) video and present as a stream

## Purpose

This is a stream wrapper around [youtube-comment-api](https://github.com/philbot9/youtube-comment-api), which itself is a Promise wrapper around [youtube-comments-task](https://github.com/philbot9/youtube-comments-task)

It presents a readable object stream returning individual comments as objects. For a full description of the returned comment object see documentation for [youtube-comments-task](https://github.com/philbot9/youtube-comments-task)

## Installation

```sh
npm install --save youtube-comments-stream
```

## Examples

### Return all comments from a video

```js
const getCommentsStream = require('youtube-comments-stream');
const videoId = 'HVv-oBN6AWA';
const stream = getCommentsStream(videoId);

stream.on('readable', function () {
	const comment = stream.read();

	if (comment) {
		console.log(comment.text);
	}
});

stream.on('error', function (err) {
	console.error('ERROR READING COMMENTS:\n', err)
});

stream.on('end', function () {
	console.log('NO MORE COMMENTS');
});
```

### Filter and limit comments

The module contains `filter` and `limit` helpers to create [Transform streams](https://nodejs.org/api/stream.html#stream_class_stream_transform), which can be attached to the comments stream using `pipe()`

For example, return the first 10 comments that contain the word "NASA":

```js
const commentsStream = require('youtube-comments-stream');

const videoId = 'ZuToYSYdJS0';
// filter for comments containing the text "NASA"
const filter = commentsStream.filter(comment => /nasa/i.test(comment.text));
// limit results to the first 10 comments
const limit = commentsStream.limit(10);
// "pipe" stream through our filter and limit transforms
const stream = commentsStream.get(videoId).pipe(filter).pipe(limit);

stream.on('readable', function () {
    const comment = stream.read();
 
    if (comment) {
        console.log(comment.text);
    }
});

stream.on('error', function (err) {
    console.error('ERROR READING COMMENTS:\n', err)
});

stream.on('end', function () {
    console.log('NO MORE COMMENTS');
});
```
