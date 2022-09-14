let synth = window.speechSynthesis;
let voiceDropdown

let voices


function setSpeech() {
    return new Promise(
        function (resolve, reject) {
            let id;
            id = setInterval(() => {
                if (synth.getVoices().length !== 0) {
                    resolve(synth.getVoices());
                    clearInterval(id);
                }
            }, 10);
        }
    )
}

function populateDropdown(voices) {
  for(const v of voices){
  	if(v.lang.split("-")[0] === "en"){
      if(v.default){
      	changeVoice(v)
      	}
  		let a = document.createElement("a")
  		a.classList.add("dropdown-item")
  		a.textContent = v.name
  		a.addEventListener("click", ()=>{changeVoice(v)})
  		document.querySelector("#voiceMenu").appendChild(a)
    	    }
  }
	voiceDropdown = new BSN.Dropdown( '#voice' );
}

function changeVoice(voice){
	document.querySelector("#voice").textContent = voice.name
	currentVoice = voice.name
	if(typeof voiceDropdown !== "undefined"){
			voiceDropdown.hide()
	}
}

async function speak(){
	synth.cancel()
	let msg = new SpeechSynthesisUtterance()
	for(const voice of window.speechSynthesis.getVoices()){
		if(voice.name === currentVoice){
			msg.voice = voice
			break
		}
	}
	msg.text = document.querySelector("#textInput").value
	msg.pitch = parseFloat(document.querySelector("#pitch").value)
	msg.rate = parseFloat(document.querySelector("#rate").value)

	msg.volume = 1
	msg.onboundary = onboundaryHandler;
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
	document.querySelector("textArea").setSelectionRange(0,0)
}

function onboundaryHandler(event){
    var textarea = document.getElementById('textInput');
    var value = textarea.value;
    var index = event.charIndex;
    var word = getWordAt(value, index);
    var anchorPosition = getWordStart(value, index);
    var activePosition = anchorPosition + word.length;

    textarea.focus();

    if (textarea.setSelectionRange) {
       textarea.setSelectionRange(anchorPosition, activePosition);
    }
    else {
       var range = textarea.createTextRange();
       range.collapse(true);
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


document.querySelector("#speak").addEventListener("click", speak)
document.querySelector("#pause").addEventListener("click", pause)
document.querySelector("#stop").addEventListener("click", stop)

let s = setSpeech();
s.then((v) => populateDropdown(v));
