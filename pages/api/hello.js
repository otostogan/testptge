// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import fs from 'fs';
import path from 'path';
import dropboxV2Api from 'dropbox-v2-api';


export default function handler(req,res) {

	const dropbox = dropboxV2Api.authenticate({
		token: "sl.BYeiH0UMSp7vE6wEIl3i7xqfLBnF07vnXOu4gbqVUAvg4HPu9UMZ-n4gd7ClffvYm240gQI3Il_k1vKxwUQsllyv10n8DDNYy5ZUzVAUCC6qaHkgi5z5E5MG9FqQAPp9GOha-Os4vTr7"
	});

	const CHUNK_LENGTH = 10 * 1000 * 1000;

	const FILE_PATH = path.join(process.cwd(), 'video.mp4');
	const FILE_SIZE = fs.statSync(FILE_PATH).size;

	console.log(FILE_PATH);
	console.log(FILE_SIZE);

	const getNextChunkStream = (start, end) => fs.createReadStream(FILE_PATH, { start, end });

	const append = (sessionId, start, end) => {
		if (start === FILE_SIZE) { // this means we have entire file uploaded, so commit
			return sessionFinish(sessionId);
		}

		if (end > FILE_SIZE) { // this last chunk might be smaller
			end = FILE_SIZE - 1;
			console.log(`uploading ${end - start + 1} bytes (from ${start} to ${end}) (last smaller chunk)`);
			return sessionAppend(sessionId, start, FILE_SIZE - 1, () => {
				return sessionFinish(sessionId, FILE_SIZE);
			})
		}
		console.log(`uploading ${end - start + 1} bytes (from ${start} to ${end})`);
		sessionAppend(sessionId, start, end, () => {
			append(sessionId, end + 1, end + CHUNK_LENGTH)
		});
	}

	sessionStart((sessionId) => {
		append(sessionId, 0, CHUNK_LENGTH - 1) // first chunk
	});

	function sessionStart(cb) {
		dropbox({
			resource: 'files/upload_session/start',
			parameters: {
				close: false
			},
		}, (err, result, response) => {
			if (err) { return console.log('sessionStart error: ', err) }
			console.log('sessionStart result:', result);
			cb(result.session_id);
		});
	}

	function sessionAppend(sessionId, start, end, cb) {
		dropbox({
			resource: 'files/upload_session/append_v2',
			parameters: {
				cursor: {
					session_id: sessionId,
					offset: start
				},
				close: false,
			},
			readStream: getNextChunkStream(start, end)
		}, (err, result, response) => {
			if (err) { return console.log('sessionAppend error: ', err) }
			cb();
		});
	}

	function sessionFinish(sessionId) {
		dropbox({
			resource: 'files/upload_session/finish',
			parameters: {
				cursor: {
					session_id: sessionId,
					offset: FILE_SIZE
				},
				commit: {
					path: "/video.mp4",
					mode: "add",
					autorename: true,
					mute: false
				}
			}
		}, (err, result, response) => {
			if (err) { return console.log('sessionFinish error: ', err) }
			console.log('sessionFinish result:', result);
			return res.status(200).json({result});
		});
	}
}
