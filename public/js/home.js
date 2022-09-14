let synth = window.speechSynthesis;
let voiceDropdown = new BSN.Dropdown( '#voice' );

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
      // if(v.name === voice){
      // 	currentVoice = v
      // 	}
  		let a = document.createElement("a")
  		a.classList.add("dropdown-item")
  		a.textContent = v.name.substring(0,20)
  		a.addEventListener("click", function(){
  			document.querySelector("#voice").textContent = v.name.substring(0,20)
  			currentVoice = v.name
  		})
  		document.querySelector("#voiceMenu").appendChild(a)
    	    }
  }
}

function speak(){
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

 	synth.speak(msg);
}



document.querySelector("#speak").addEventListener("click", speak)

let s = setSpeech();
s.then((v) => populateDropdown(v));
