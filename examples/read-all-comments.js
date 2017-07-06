const getCommentsStream = require('../index');
const videoId = 'HVv-oBN6AWA';
const stream = getCommentsStream(videoId);
let count = 0;

stream.on('readable', function () {
	const comment = stream.read();

	if (comment) {
		console.log('\n--------\n' + ++count + '\n--------\n');
		console.log(comment.text);
	}
});

stream.on('error', function (err) {
	console.error('ERROR READING COMMENTS:\n', err);
});

stream.on('end', function () {
	console.log('\n--------\n');
	console.log('NO MORE COMMENTS');
});
