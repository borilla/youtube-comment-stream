var getCommentsStream = require('./lib/get-comments-stream');
var fetchCommentsPage = require('youtube-comment-api');

module.exports = function (videoId) {
	return getCommentsStream(videoId, fetchCommentsPage);
};
