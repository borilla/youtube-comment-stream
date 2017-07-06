var filterCommentsStream = require('../lib/filter-comments-stream');
var mockCommentsStream = require('./mocks/mock-comments-stream');

var TransformStream = require('stream').Transform;
var chai = require('chai');
var expect = chai.expect;

describe('filter-comments-stream', function () {
	function filterComment(comment) {
		return comment.author === 'john';
	}

	it('should be a function', function () {
		expect(filterCommentsStream).to.be.a('function');
	});

	it('should return a transform-stream', function () {
		expect(filterCommentsStream(filterComment)).to.be.instanceOf(TransformStream);
	});

	describe('when applied to a comments stream', function () {
		var filteredComments;

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

			// get stream filter and apply to comments-stream
			var filter = filterCommentsStream(filterComment);
			var filteredStream = commentsStream.pipe(filter);

			// read all comments from filtered stream into array
			filteredComments = [];
			filteredStream.on('readable', function readComment() {
				var comment = filteredStream.read();

				if (comment) {
					filteredComments.push(comment);
				}
				else {
					done();
				}
			});
		});

		it('should return only the expected comments', function () {
			expect(filteredComments).to.deep.equal([
				{ author: 'john', text: 'comment 1' },
				{ author: 'john', text: 'comment 2' },
				{ author: 'john', text: 'comment 3' },
				{ author: 'john', text: 'comment 4' },
				{ author: 'john', text: 'comment 5' }
			]);
		});
	});
});
