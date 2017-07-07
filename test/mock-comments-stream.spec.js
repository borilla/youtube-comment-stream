var mockCommentsStream = require('../lib/mock-comments-stream');

var ReadableStream = require('stream').Readable;
var chai = require('chai');
var expect = chai.expect;

describe('mock-comments-stream', function () {
	var stream, inputComments, streamedComments, error;

	before(function () {
		inputComments = [];
	});

	beforeEach(function (done) {
		streamedComments = [];
		error = null;
		stream = mockCommentsStream(inputComments);
		stream.on('data', comment => { streamedComments.push(comment); });
		stream.on('error', err => { error = err; done(); });
		stream.on('end', done);
	});

	it('should be a function', function () {
		expect(mockCommentsStream).to.be.a('function');
	});

	it('should return a readable stream', function () {
		expect(stream).to.be.instanceOf(ReadableStream);
	});

	describe('when provided with an array of comments', function () {
		before(function () {
			inputComments = [
				{ text: 'comment 1' },
				{ text: 'comment 2' },
				{ text: 'comment 3' },
				{ text: 'comment 4' },
				{ text: 'comment 5' },
				{ text: 'comment 6' },
				{ text: 'comment 7' },
				{ text: 'comment 8' }
			];
		});

		it('should stream all of the comments', function () {
			expect(streamedComments).to.deep.equal(inputComments);
		});

		it('should not emit an error', function () {
			expect(error).to.be.null;
		});
	});

	describe('when any of the input comments is an error object', function () {
		before(function () {
			inputComments = [
				{ text: 'comment 1' },
				{ text: 'comment 2' },
				{ text: 'comment 3' },
				{ text: 'comment 4' },
				{ text: 'comment 5' },
				{ type: 'some error', message: 'whoops, something has gone wrong' },
				{ text: 'comment 6' },
				{ text: 'comment 7' },
				{ text: 'comment 8' }
			];
		});

		it('should emit an error', function () {
			expect(error).to.deep.equal({
				type: 'some error',
				message: 'whoops, something has gone wrong'
			});
		});
	});
});
