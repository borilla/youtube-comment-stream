var getCommentsStream = require('../lib/get-comments-stream');
var fetchCommentsPage = require('./mocks/fetch-comments-page');

var chai = require('chai');
var chaiStream = require('chai-stream');
var chaiSubset = require('chai-subset');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var expect = chai.expect;

chai.use(chaiStream);
chai.use(chaiSubset);
chai.use(sinonChai);

describe('get-comments-stream', function () {
	var sandbox;

	before(function () {
		sandbox = sinon.sandbox.create();
		fetchCommentsPage = sandbox.spy(fetchCommentsPage);
	});

	afterEach(function () {
		sandbox.reset();
	});

	it('should be a function', function () {
		expect(getCommentsStream).to.be.a('function');
	});

	describe('when called with a valid video-id', function () {
		var stream;

		beforeEach(function () {
			stream = getCommentsStream('video 1', fetchCommentsPage);
		});

		it('should return a stream', function () {
			expect(stream).to.be.a.ReadableStream;
		});

		it('should not yet have fetched any comments', function () {
			expect(fetchCommentsPage).to.not.be.called;
		});

		describe('when we read first item from stream', function () {
			var comment;

			beforeEach(function (done) {
				comment = null;

				stream.on('readable', function readComment() {
					comment = stream.read();
					stream.removeListener('readable', readComment);
					done();
				});
			});

			it('should fetch the first page of comments', function () {
				expect(fetchCommentsPage).to.be.calledOnce;
			});

			it('should return the first comment', function () {
				expect(comment).to.deep.equal({ id: 'page 1 comment 1' });
			});
		});

		describe('when we read all items from stream', function () {
			var comments;

			beforeEach(function (done) {
				comments = [];

				stream.on('readable', function readComment() {
					var comment = stream.read();

					if (comment) {
						comments.push(comment);
					}
					else {
						done();
					}
				});
			});

			it('should have fetched all comment pages', function () {
				expect(fetchCommentsPage).to.be.calledTwice;
			});

			it('should have returned all comments and replies (in order)', function () {
				expect(comments).to.deep.equal([
					{ id: 'page 1 comment 1' },
					{ id: 'page 1 comment 2' },
					{ id: 'page 1 comment 2 reply 1', replyTo: 'page 1 comment 2' },
					{ id: 'page 1 comment 2 reply 2', replyTo: 'page 1 comment 2' },
					{ id: 'page 1 comment 3' },
					{ id: 'page 1 comment 3 reply 1', replyTo: 'page 1 comment 3' },
					{ id: 'page 1 comment 3 reply 2', replyTo: 'page 1 comment 3' },
					{ id: 'page 1 comment 3 reply 3', replyTo: 'page 1 comment 3' },
					{ id: 'page 1 comment 4' },
					{ id: 'page 1 comment 5' },
					{ id: 'page 2 comment 1' },
					{ id: 'page 2 comment 2' },
					{ id: 'page 2 comment 3' }
				]);
			});

			describe('when we try to read more from the stream', function () {
				var comment;

				beforeEach(function () {
					comment = stream.read();
				});

				it('should return null', function () {
					expect(comment).to.be.null;
				});
			});
		});
	});

	describe('when called with an invalid video-id', function () {
		var stream;

		beforeEach(function () {
			stream = getCommentsStream('video XXX', fetchCommentsPage);
		});

		it('should emit an error', function (done) {
			// NOTE: Should we/how do we test that en event is not emitted?
			stream.on('readable', function () {
				done('stream should not be readable');
			});

			stream.on('error', function (err) {
				expect(err).to.deep.equal({
					type: 'video error',
					message: 'some error'
				});
				done();
			});
		});

		describe('when we try to read from the stream', function () {
			var comment;

			beforeEach(function () {
				comment = stream.read();
				stream.on('error', sandbox.stub());
			});

			it('should return null', function () {
				expect(comment).to.be.null;
			});
		});
	});
});
