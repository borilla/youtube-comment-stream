const getCommentsStream = require('../index');
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
