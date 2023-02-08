import React, { useState, useEffect } from 'react';
import RecordRTC from 'recordrtc';
import { saveAs } from 'file-saver';
import {Dropbox} from "dropbox";

const Some = () => {
	// const [recorders, setRecorders] = useState<RecordRTC[]>([]);
	// const [stream, setStream] = useState<MediaStream | null>(null);

	// const [displayRecord, setDisplayRecord] = useState<RecordRTC>();
	// const [streamDisplay, setStreamDisplay] = useState<MediaStream | null>(null);

	const [recorders, setRecorders] = useState([]);
	const [stream, setStream] = useStates(null);

	const [displayRecord, setDisplayRecord] = useState();
	const [streamDisplay, setStreamDisplay] = useState(null);

	const dbx = new Dropbox({ accessToken: "sl.BYeiH0UMSp7vE6wEIl3i7xqfLBnF07vnXOu4gbqVUAvg4HPu9UMZ-n4gd7ClffvYm240gQI3Il_k1vKxwUQsllyv10n8DDNYy5ZUzVAUCC6qaHkgi5z5E5MG9FqQAPp9GOha-Os4vTr7" });

	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({
				video: true,
				audio: true,
			})
			.then((mediaStream) => {
				setStream(mediaStream);
				const audioRecorder = new RecordRTC(mediaStream, {
					type: 'audio',
				});

				const videoRecorder = new RecordRTC(mediaStream, {
					type: 'video',
				});

				setRecorders([audioRecorder, videoRecorder]);
			})
		navigator.mediaDevices.getDisplayMedia({
			video: true,
			audio: true
		})
		.then((displayStream) => {
			setStreamDisplay(displayStream);
			const screenRecorder = new RecordRTC(displayStream, {
				type: 'video',
				mimeType: "video/webm",
				frameRate: 30,
				bitrate: 5 * 1024 * 1024,
				// video: {
				// 	width: 720,
				// 	height: 480,
				// }
			});
			setDisplayRecord(screenRecorder);
		})
	}, []);

		const startRecording = () => {
			if (stream) {
				recorders.forEach((recorder) => {
					recorder.startRecording();
				});
			}
			if(streamDisplay){
				displayRecord?.startRecording();
			}
		};

		const stopRecording = () => {
			if (stream) {
				recorders.forEach((recorder) => {
					recorder.stopRecording();
				});
			}
			if(streamDisplay){
				displayRecord?.stopRecording();
			}
		};

	const saveRecording = async () => {
		if (recorders.length > 0) {
			// recorders.forEach((recorder, index) => {
			// 	recorder.getDataURL((dataURL) => {
			// 		const blob = recorder.getBlob();
			// 		saveAs(blob, `recording-${index}.webm`);
			// 	})
			// });
			// displayRecord?.getDataURL((dataUrl) => {
			// 	const blob = displayRecord.getBlob();
			// 	saveAs(blob, `recording-screen.webm`);
			// })
		}

		if(displayRecord){

			// const maxBlob = 8 * 1000 * 1000;
			// let workItems = [];
			// let offset = 0;

			// const videoBlob = displayRecord.getBlob();

			// while (offset < videoBlob.size) {
			// 	const chunkSize = Math.min(maxBlob, videoBlob.size - offset);
			// 	workItems.push(videoBlob.slice(offset, offset + chunkSize));
			// 	offset += chunkSize;
			// }
			
			// const task = workItems.reduce((acc, blob, idx, items) => {
			// 	if (idx == 0) {
			// 		return acc.then(function() {
			// 			return dbx.filesUploadSessionStart({ close: false, contents: blob}).then(response => response.session_id)
			// 		});          
			// 	} else if (idx < items.length-1) {  
			// 		return acc.then(function(sessionId) {
			// 			var cursor = { session_id: sessionId, offset: idx * maxBlob };
			// 			return dbx.filesUploadSessionAppendV2({ cursor: cursor, close: false, contents: blob }).then(() => sessionId); 
			// 		});
			// 	} else {
			// 		return acc.then(function(sessionId) {
			// 			var cursor = { session_id: sessionId, offset: videoBlob.size - blob.size };
			// 			var commit = { path: '/video.webm', mode: 'add', autorename: true, mute: false };              
			// 			return dbx.filesUploadSessionFinish({ cursor: cursor, commit: commit, contents: blob });           
			// 		});
			// 	}          
			// }, Promise.resolve());

			// task.then((res) => {
			// 	console.log(res);
			// })
			const videoBlob = displayRecord.getBlob().toString("base64");
			const response = await dbx.filesUpload({
				path: `/video.webm`,
				contents: Buffer.from(videoBlob, "base64")
			});
			console.log(response);
		}
	};

	return (
		<div>
			<button onClick={startRecording}>Start recording</button>
			<button onClick={stopRecording}>Stop recording</button>
			<button onClick={saveRecording}>Save recording</button>
		</div>
	);
};
export default Some;