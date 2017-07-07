const commentsStream = require('../index');

const VIDEO_ID = 'HVv-oBN6AWA';
const MAX_COMMENTS = 5;
const limit = commentsStream.limit(MAX_COMMENTS);
const stream = commentsStream.get(VIDEO_ID).pipe(limit);

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
