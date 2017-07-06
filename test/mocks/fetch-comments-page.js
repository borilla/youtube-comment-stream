var VIDEOS = {
	'video 1': {
		'': {
			comments: [
				{ id: 'page 1 comment 1' },
				{
					id: 'page 1 comment 2',
					replies: [
						{ id: 'page 1 comment 2 reply 1' },
						{ id: 'page 1 comment 2 reply 2' }
					]
				},
				{
					id: 'page 1 comment 3',
					replies: [
						{ id: 'page 1 comment 3 reply 1' },
						{ id: 'page 1 comment 3 reply 2' },
						{ id: 'page 1 comment 3 reply 3' }
					]
				},
				{ id: 'page 1 comment 4' },
				{ id: 'page 1 comment 5' }
			],
			nextPageToken: 'page 2'
		},
		'page 2': {
			comments: [
				{ id: 'page 2 comment 1' },
				{ id: 'page 2 comment 2' },
				{ id: 'page 2 comment 3' }
			]
			// no nextPageToken
		}
	}
};

var ERROR_OBJECT = { type: 'video error', message: 'some error' };

function fetchCommentsPage(videoId, nextPageToken) {
	var video = VIDEOS[videoId];
	var page;

	if (!video) {
		return Promise.reject(ERROR_OBJECT);
	}

	// NOTE: no token or an invalid token returns first comments page
	page = video[nextPageToken] || video[''];

	return Promise.resolve(page);
}

module.exports = fetchCommentsPage;
