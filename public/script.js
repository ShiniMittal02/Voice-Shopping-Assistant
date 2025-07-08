let list = [];


function startListening() {
  const lang = document.getElementById("languageSelect").value;
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = lang;
  recognition.start();

  recognition.onresult = function (event) {
    const speech = event.results[0][0].transcript;
    processCommand(speech);
  };

  recognition.onerror = function (event) {
    alert('Error: ' + event.error);
  };
}


function processCommand(command) {
  const lower = command.toLowerCase();

  if (lower.includes("add") || lower.includes("buy") || lower.includes("get")) {
    const item = lower.replace(/(i want to buy|add|buy|get)\s+/i, '').trim();
    list.push(item);
    speakBack(`Added ${item} to your list`);
  } else if (lower.includes("remove") || lower.includes("delete")) {
    const item = lower.replace(/(remove|delete)\s+/i, '').trim();
    list = list.filter(i => i !== item);
    speakBack(`Removed ${item} from your list`);
  } else {
    speakBack("Sorry, I didn't understand. Please say something like 'Add apples' or 'Remove milk'");
  }

  updateList();
}
function speakBack(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
}
