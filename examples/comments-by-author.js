const commentsStream = require('../index');

const VIDEO_ID = 'kpaFizGUJg8';
const MAX_COMMENTS = 1000;
const AUTHOR = 'nokomis mn';

const limit = commentsStream.limit(MAX_COMMENTS);
const filter = commentsStream.filter(comment => comment.author === AUTHOR);
const stream = commentsStream.get(VIDEO_ID).pipe(limit).pipe(filter);

stream.on('data', function (comment) {
	console.log(comment.text);
	console.log('\n--------\n');
});

stream.on('error', function (err) {
	console.error('ERROR READING COMMENTS:', err);
});

stream.on('end', function () {
	console.log('NO MORE COMMENTS');
	process.exit();
});
