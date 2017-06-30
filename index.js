var getYouTubeCommentsStream = require('./lib/get-youtube-comments-stream');
var fetchCommentsPage = require('youtube-comment-api');

module.exports = function (videoId) {
	return getYouTubeCommentsStream(videoId, fetchCommentsPage);
};
