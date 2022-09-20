// (async () => {
// const text = "The revolution will not be televised";
//
// blob = await new Promise(async resolve => {
//     console.log("picking system audio");
//     const stream = await navigator.mediaDevices.getDisplayMedia({video:true, audio:true});
//     const track = stream.getAudioTracks()[0];
//     if(!track)
//         throw "System audio not available";
//
//     stream.getVideoTracks().forEach(track => track.stop());
//
//     const mediaStream = new MediaStream();
//     mediaStream.addTrack(track);
//
//     const chunks = [];
//     const mediaRecorder = new MediaRecorder(mediaStream, {bitsPerSecond:128000});
//     mediaRecorder.ondataavailable = event => {
//         if (event.data.size > 0)
//             chunks.push(event.data);
//     }
//     mediaRecorder.onstop = () => {
//         stream.getTracks().forEach(track => track.stop());
//         mediaStream.removeTrack(track);
//         resolve(new Blob(chunks));
//     }
//     mediaRecorder.start();
//
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.onend = () => mediaRecorder.stop();
//     window.speechSynthesis.speak(utterance);
//     console.log("speaking...");
// });
// console.log("audio available", blob);
//
//
//
// const player = new Audio();
// player.src = URL.createObjectURL(blob);
// player.autoplay = true;
// player.controls = true;
// document.querySelector(".container-fluid").appendChild(player)
//
// })()
//
// let blob
