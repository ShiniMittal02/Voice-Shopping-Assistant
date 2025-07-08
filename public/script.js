let list = [];

function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
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
  const addMatch = command.match(/add (.*)/i);
  const removeMatch = command.match(/remove (.*)/i);

  if (addMatch) {
    const item = addMatch[1];
    list.push(item);
    updateList();
  } else if (removeMatch) {
    const item = removeMatch[1];
    list = list.filter(i => i !== item);
    updateList();
  } else {
    alert("❓ Command not recognized. Try 'Add milk' or 'Remove apples'");
  }
}

function updateList() {
  const ul = document.getElementById("shopping-list");
  ul.innerHTML = "";
  list.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  });
}
