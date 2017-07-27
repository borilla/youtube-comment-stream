const commentsStream = require('../index');

const VIDEO_ID = 'HVv-oBN6AWA';
const MAX_COMMENTS = 5;

const limit = commentsStream.limit(MAX_COMMENTS);
const stream = commentsStream.get(VIDEO_ID).pipe(limit);

var count = 0;

stream.on('data', function (comment) {
	console.log('\n-------- ' + ++count + ' --------\n');
	console.log(comment.text);
});

stream.on('error', function (err) {
	console.error('ERROR READING COMMENTS:', err);
});

stream.on('end', function () {
	console.log('\n-------- END --------\n');
	console.log('NO MORE COMMENTS');
	process.exit();
});
