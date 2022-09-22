function updateVoices() {
  // add an option for each available voice that isn't already added
  window.speechSynthesis.getVoices().forEach(voice => {
    const isAlreadyAdded = [...document.querySelectorAll(".dropdown-item")].some(option => option.value === voice.voiceURI);
    if (!isAlreadyAdded) {
		let a = document.createElement("a")
  		a.classList.add("dropdown-item")
  		a.textContent = voice.name
  		a.addEventListener("click", ()=>{changeVoice(voice)})
  		document.querySelector("#voiceMenu").appendChild(a)

    }
  });
}


function changeVoice(voice){
	document.querySelector("#voice").textContent = voice.name
	currentVoice = voice.name
	if(typeof voiceDropdown !== "undefined"){
			voiceDropdown.hide()
	}
}

function play(){
  let rc = document.querySelector("#recordCheck")
  if(rc.checked){
    getMedia()
  }else{
    speak()
  }
}
async function speak(){
	if(typeof(currentVoice) === "undefined"){
		alertText.textContent = "Please select a voice"
		alert.style.display = "block"
		alert.scrollIntoView()
		return
	}
	synth.cancel()
	let msg = new SpeechSynthesisUtterance()
	for(const voice of window.speechSynthesis.getVoices()){
		if(voice.name === currentVoice){
			msg.voice = voice
			break
		}
	}
	let start = textBox.selectionStart
	if(textBox.selectionStart === textBox.value.length){
		start = 0
	}
	text = textBox.value.slice(start, textBox.value.length)
	msg.text = text
	msg.pitch = parseFloat(document.querySelector("#pitch").value)
	msg.rate = parseFloat(document.querySelector("#rate").value)

	msg.volume = 1
	msg.onboundary = onboundaryHandler
 	synth.speak(msg);
	msg.addEventListener("end", speechEnd, false)
}

function pause(e){
	let but = document.querySelector("#pause")
	if(synth.paused){
		synth.resume()
		but.textContent = "Pause"
	}else{
		synth.pause()
		but.textContent = "Resume"
	}
}

function stop(e){
	synth.cancel()
	speechEnd()
}

function speechEnd(e){
	let ap = document.querySelector("#audioPlayer")
	document.querySelector("textArea").setSelectionRange(0,0)
	if(typeof(mediaRecorder) !== "undefined" && mediaRecorder.state !== "inactive"){
		mediaRecorder.stop()
	}else{
		ap.style.display = "none"
	}
}

function loadAudio(){
  ap = document.querySelector("#audioPlayer")
  ap.src = URL.createObjectURL(blob);
  ap.style.display = "block"
  blob = undefined
  ap.scrollIntoView()
}

function onboundaryHandler(event){
    var value = text
    var index = event.charIndex;
    var word = getWordAt(value, index);
    var anchorPosition = getWordStart(value, index) + (textBox.value.length - text.length);
    var activePosition = anchorPosition + word.length;

    if (textBox.setSelectionRange) {
		textBox.blur()
		textBox.focus()
		const fullText = textBox.value;
		textBox.value = fullText.substring(0, activePosition);
		textBox.scrollTop = textBox.scrollHeight;
		textBox.value = fullText;

       textBox.setSelectionRange(anchorPosition, activePosition);
	}
    else {
       var range = texBox.createTextRange();
       range.collapse(true);
		textBox.focus();
       range.moveEnd('character', activePosition);
       range.moveStart('character', anchorPosition);
       range.select();

    }
};

// Get the word of a string given the string and index
function getWordAt(str, pos) {
    // Perform type conversions.
    str = String(str);
    pos = Number(pos) >>> 0;

    // Search for the word's beginning and end.
    var left = str.slice(0, pos + 1).search(/\S+$/),
        right = str.slice(pos).search(/\s/);

    // The last word in the string is a special case.
    if (right < 0) {
        return str.slice(left);
    }

    // Return the word, using the located bounds to extract it from the string.
    return str.slice(left, right + pos);
}

// Get the position of the beginning of the word
function getWordStart(str, pos) {
    str = String(str);
    pos = Number(pos) >>> 0;

    // Search for the word's beginning
    var start = str.slice(0, pos + 1).search(/\S+$/);
    return start;
}


function paste(e){
	e.preventDefault()
	let txt = (e.clipboardData || window.clipboardData).getData('text').replace(/[^\x20-\x7E]/gmi, " ");
	txt.replace("  ", " ")
	textBox.value = txt
}

async function getMedia ()  {
blob = await new Promise(async resolve => {
    if(!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia){
		alertText.textContent = "getDisplayMedia not supported by this browser"
		alert.style.display = "block"
		document.querySelector("#recordCheck").checked = false
		speak()
		return
	}
    const stream = await navigator.mediaDevices.getDisplayMedia({audio:true, video:true});
    const track = stream.getAudioTracks()[0];
    if(!track){
		alertText.textContent = "System audio not available";
		alert.style.display = "block"
		alert.scrollIntoView()
		return
	}

    stream.getVideoTracks().forEach(track => track.stop());

    const mediaStream = new MediaStream();
    mediaStream.addTrack(track);

    const chunks = [];
    mediaRecorder = new MediaRecorder(mediaStream, {bitsPerSecond:128000});
    mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0)
            chunks.push(event.data);
    }
    mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        mediaStream.removeTrack(track);
        resolve(new Blob(chunks))
    }
    mediaRecorder.start();
	speak()
});
loadAudio()
}

document.querySelector("#speak").addEventListener("click", play)
document.querySelector("#pause").addEventListener("click", pause)
document.querySelector("#stop").addEventListener("click", stop)
document.querySelector(".close").addEventListener("click", (e)=>{
  e.preventDefault()
  alert.style.display = "none"
})

let synth = window.speechSynthesis;
let mediaRecorder
let blob
const textBox = document.querySelector("#textInput")
textBox.addEventListener("paste", paste)
let text
const voiceDropdown = new BSN.Dropdown( '#voice' );
const alert = document.querySelector(".alert")
const alertText = document.querySelector("#alertText")
updateVoices();
window.speechSynthesis.onvoiceschanged = updateVoices;
