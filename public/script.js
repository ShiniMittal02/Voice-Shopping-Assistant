// 🛒 List of items: {name, qty, category}
let list = [];
// History of items added
let history = [];

// Categories (mock)
const categories = {
  apple: "produce", milk: "dairy", bread: "bakery",
  eggs: "dairy", banana: "produce"
};

// Substitutes map
const substitutes = { milk: "almond milk", bread: "whole-grain bread" };

/**
 * 🎤 Voice recognition
 */
function startListening() {
  showFeedback("🎤 Listening...", "#333");
  const lang = document.getElementById("languageSelect").value;
  const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  rec.lang = lang;
  rec.start();

  rec.onresult = e => processCommand(e.results[0][0].transcript);
  rec.onerror = e => showFeedback("Error: " + e.error, "red");
}

/**
 * 🧠 Interpret and act on command
 */
function processCommand(cmd) {
  const lower = cmd.toLowerCase();
  // Add with quantity
  let match = lower.match(/(add|buy|get)\s+(\d+)?\s*(.+)/i);
  if (match) {
    let qty = parseInt(match[2]) || 1;
    let item = match[3].trim();
    addItem(item, qty);
    return;
  }
  // Remove
  match = lower.match(/(remove|delete)\s+(.+)/i);
  if (match) {
    removeItem(match[2].trim());
    return;
  }
  // Search brand/price
  match = lower.match(/find me (.+?)( under)?\s*(\d+)?/i);
  if (match) {
    let item = match[1].trim();
    let price = parseInt(match[3]);
    searchItem(item, price);
    return;
  }
  speakBack("Sorry, didn't understand. Try " +
    "'Add 2 apples', 'Remove milk', or 'Find organic apples under 5'");
}

/**
 * ➕ Add item to shopping list
 */
function addItem(item, qty) {
  const cat = categories[item] || "others";
  list.push({ name: item, qty, category: cat });
  history.push(item);
  speakBack(`Added ${qty} × ${item}`);
  updateList(); suggestIfLow(item); seasonalSuggestion(item); checkSubstitute(item);
}

/**
 * ➖ Remove item
 */
function removeItem(item) {
  list = list.filter(i => i.name !== item);
  speakBack(`Removed ${item}`);
  updateList();
}

/**
 * 🔍 Search items (mock)
 */
function searchItem(query, price) {
  let msg = `Found search results for ${query}`;
  if (price) msg += ` under ₹${price}`;
  speakBack(msg);
}

/**
 * 🗣️ Speak + display feedback
 */
function speakBack(text) {
  const u = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(u);
  showFeedback(text);
}

/**
 * 🛍️ Update list UI
 */
function updateList() {
  const ul = document.getElementById("shopping-list");
  ul.innerHTML = "";
  list.forEach(i => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="quantity">${i.qty}×</span> ${i.name} ` +
                   `<span class="category">(${i.category})</span>`;
    ul.appendChild(li);
  });
}

/**
 * 💬 Show visual feedback
 */
function showFeedback(msg, color = "green") {
  const f = document.getElementById("feedback");
  f.textContent = msg; f.style.color = color;
}

/**
 * 📉 Suggest if running low (history based)
 */
function suggestIfLow(item) {
  const count = history.filter(i => i === item).length;
  if (count > 2) {
    speakBack(`You often buy ${item}. Want to add it again?`);
  }
}

/**
 * 🌱 Seasonal suggestion (mock)
 */
function seasonalSuggestion(item) {
  // Mock seasons: apples & bananas
  if (["apple", "banana"].includes(item)) {
    speakBack(`Reminder: ${item}s are in season now!`);
  }
}

/**
 * 🥛 Substitute suggestion
 */
function checkSubstitute(item) {
  if (substitutes[item]) {
    speakBack(`If ${item} is unavailable, try ${substitutes[item]}`);
  }
}
