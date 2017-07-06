// limit stream to he first 20 comments that contain the word NASA

const getCommentsStream = require('../index');
const filterCommentsStream = require('../index').filter;
const limitCommentsStream = require('../index').limit;

const videoId = 'kpaFizGUJg8';
const filterTransform = filterCommentsStream((comment) => /(^|\W)nasa(\W|$)/i.test(comment.text));
const limitTransform = limitCommentsStream(20);
const stream = getCommentsStream(videoId).pipe(filterTransform).pipe(limitTransform);
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
