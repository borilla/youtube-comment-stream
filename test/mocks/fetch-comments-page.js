var C = require('./test-constants.js');

var COMMENTS_PAGE_1 = {
	comments: [
		C.PAGE_1_COMMENT_1,
		C.PAGE_1_COMMENT_2,
		C.PAGE_1_COMMENT_3,
		C.PAGE_1_COMMENT_4,
		C.PAGE_1_COMMENT_5
	],
	nextPageToken: C.PAGE_2_TOKEN
};

var COMMENTS_PAGE_2 = {
	comments: [
		C.PAGE_2_COMMENT_1,
		C.PAGE_2_COMMENT_2,
		C.PAGE_2_COMMENT_3
	],
	nextPageToken: null
};

function fetchCommentsPage(videoId, nextPageToken) {
	if (videoId === C.VALID_VIDEO_ID) {
		if (nextPageToken === C.PAGE_2_TOKEN) {
			return Promise.resolve(COMMENTS_PAGE_2);
		}

		// NOTE: no token or an invalid token returns first comments page
		return Promise.resolve(COMMENTS_PAGE_1);
	}

	return Promise.reject(C.ERROR_OBJECT);
}

module.exports = fetchCommentsPage;
