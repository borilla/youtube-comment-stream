const commentsStream = require('../index');

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
		console.log('\n--------\n');
	}
});

stream.on('error', function (err) {
	console.error('ERROR READING COMMENTS:', err);
});

stream.on('end', function () {
	console.log('NO MORE COMMENTS');
	process.exit();
});
