var Readable = require('stream').Readable;

function mockCommentsStream(comments) {
	var stream = new Readable({ objectMode: true });
	var i = 0;

	stream._read = function () {
		if (i < comments.length) {
			stream.push(comments[i]);
			i++;
		}
		else {
			stream.push(null);
		}
	};

	return stream;
}

module.exports = mockCommentsStream;
