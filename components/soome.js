// import { useState } from "react"
// import RecordRTC, { RecordRTCPromisesHandler } from "recordrtc"
// import { saveAs } from 'file-saver'

// const Some = () => {
// 	const [recorder, setRecorder] = useState<RecordRTC | null>()
// 	const [stream, setStream] = useState<MediaStream | null>()
// 	const [videoBlob, setVideoUrlBlob] = useState<Blob | null>()
// 	const [type, setType] = useState<'video' | 'screen'>('video')

// 	const startRecording = async () => {
// 		const mediaDevices = navigator.mediaDevices;
// 		const stream: MediaStream =
// 		type === 'video'
// 			? await mediaDevices.getUserMedia({
// 				video: { width: 4000, height: 4000 },
// 				audio: true,
// 			})
// 			: await (mediaDevices as any).getDisplayMedia({
// 				video: true,
// 				audio: true,
// 			})
// 		const recorder: RecordRTC = new RecordRTCPromisesHandler(stream, {
// 			type: 'video',
// 		})

// 		await recorder.startRecording()
// 		setRecorder(recorder)
// 		setStream(stream)
// 		setVideoUrlBlob(null)
// 	}

// 	const stopRecording = async () => {
// 		if (recorder) {
//             await recorder.stopRecording()
//             const blob: Blob = await recorder.getBlob();
//             (stream as any).stop()
//             setVideoUrlBlob(blob)
//             setStream(null)
//             setRecorder(null)
// 		}
// 	}


// 	const downloadVideo = () => {
// 		if (videoBlob) {
// 		  const mp4File = new File([videoBlob], 'demo.mp4', { type: 'video/mp4' })
// 		  saveAs(mp4File, `Video-${Date.now()}.mp4`)
// 		  // saveAs(videoBlob, `Video-${Date.now()}.webm`)
// 		}
// 	  }

	
// 	return(
// 		<div>
// 			<button onClick={startRecording}>
// 				Click
// 			</button>
// 			<button onClick={stopRecording}>
// 				stop
// 			</button>
// 			<button onClick={downloadVideo}>
// 				downloadVideo
// 			</button>
// 		</div>
// 	)
// }

// export default Some;