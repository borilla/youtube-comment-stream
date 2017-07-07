var limitCommentsStream = require('../lib/limit-comments-stream');
var mockCommentsStream = require('../lib/mock-comments-stream');

var TransformStream = require('stream').Transform;
var chai = require('chai');
var expect = chai.expect;

describe('limit-comments-stream', function () {
	var LIMIT_COUNT = 5;

	it('should be a function', function () {
		expect(limitCommentsStream).to.be.a('function');
	});

	it('should return a transform-stream', function () {
		expect(limitCommentsStream(LIMIT_COUNT)).to.be.instanceOf(TransformStream);
	});

	describe('when applied to a comments stream', function () {
		var limitedComments;

		beforeEach(function (done) {
			var commentsStream = mockCommentsStream([
				{ author: 'john', text: 'comment 1' },
				{ author: 'paul', text: 'comment 1' },
				{ author: 'john', text: 'comment 2' },
				{ author: 'paul', text: 'comment 2' },
				{ author: 'john', text: 'comment 3' },
				{ author: 'paul', text: 'comment 3' },
				{ author: 'john', text: 'comment 4' },
				{ author: 'paul', text: 'comment 4' },
				{ author: 'john', text: 'comment 5' },
				{ author: 'paul', text: 'comment 5' }
			]);

			// get stream limit and apply to comments stream
			var limit = limitCommentsStream(LIMIT_COUNT);
			var limitedStream = commentsStream.pipe(limit);

			// read all comments from limited stream into array
			limitedComments = [];
			limitedStream.on('readable', function readComment() {
				var comment = limitedStream.read();

				if (comment) {
					limitedComments.push(comment);
				}
				else {
					done();
				}
			});
		});

		it('should return only the expected comments', function () {
			expect(limitedComments).to.deep.equal([
				{ author: 'john', text: 'comment 1' },
				{ author: 'paul', text: 'comment 1' },
				{ author: 'john', text: 'comment 2' },
				{ author: 'paul', text: 'comment 2' },
				{ author: 'john', text: 'comment 3' }
			]);
		});
	});
});
