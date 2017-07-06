var getCommentsStream = require('../lib/get-comments-stream');
var fetchCommentsPage = require('./mocks/fetch-comments-page');
var C = require('./mocks/fetch-comments-page-constants');

var chai = require('chai');
var chaiStream = require('chai-stream');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var expect = chai.expect;

chai.use(chaiStream);
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
			stream = getCommentsStream(C.VALID_VIDEO_ID, fetchCommentsPage);
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
				expect(comment).to.equal(C.PAGE_1_COMMENT_1);
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

			it('should have returned all comments', function () {
				expect(comments).to.deep.equal([
					C.PAGE_1_COMMENT_1,
					C.PAGE_1_COMMENT_2,
					C.PAGE_1_COMMENT_3,
					C.PAGE_1_COMMENT_4,
					C.PAGE_1_COMMENT_5,
					C.PAGE_2_COMMENT_1,
					C.PAGE_2_COMMENT_2,
					C.PAGE_2_COMMENT_3
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
			stream = getCommentsStream(C.INVALID_VIDEO_ID, fetchCommentsPage);
		});

		it('should emit an error', function (done) {
			// NOTE: Should we/how do we test that en event is not emitted?
			stream.on('readable', function () {
				done('stream should not be readable');
			});

			stream.on('error', function (err) {
				expect(err).to.deep.equal(C.ERROR_OBJECT);
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
