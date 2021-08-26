var array = [];
var usedWords = [];
var usedLetters = [];
const time = Date.now();
// ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]


window.addEventListener("message", (event) => {

  /* get our specific dictionary */
  if (event.data.flag == "Language") {
    if (event.data.language == ""
  || event.data.language == null) { // will likely always fire, content script bug where Xcontext loads after DOM but before iFrames
      langRequest();
      return;
    }
    console.log("Identified language: " + event.data.language + " (" + (Date.now() - time) + "ms)");
    chrome.runtime.sendMessage({dict: event.data.language}, function(dict) {
      array = dict;
      // console.log(array[5])
    });
  }

  /* our turn to type the letters */
  if (event.data.name == "focusGameWindow") {
    var payload = {flag: "requestSyllable"};
    document.querySelector("body > div.pages > div.main.page > div.game > iframe").contentWindow.postMessage(payload, "*");
  }

  /* game chat message */
  if (event.data.name == "appendToChat") {
    if (event.data.text.startsWith("💣 Round lasted")) {
      usedWords = [];
    }
  }

  /* received syllable from X-context */
  if (event.data.flag == "syllable") {
    if (array.length == 0) {
      console.log("Empty dictionary error");
      return;
    }

    var payload = {};
    payload.flag = "typeWord";
    payload.word = findWord(event.data.syllable);
    if (payload.word == "WORD NOT FOUND") return;
    document.querySelector("body > div.pages > div.main.page > div.game > iframe").contentWindow.postMessage(payload, "*");
  }
});

function findWord(target) {
  // console.log(usedLetters);
  var matchingWords = [];
  for (str of array) {
    if (str.includes(target.toLowerCase()) && !usedWords.includes(str) && str.length <= 30) {
      matchingWords.push(str);
    }
  }

  if (matchingWords.length == 0) {
    console.log("No matching words for the provided syllable: " + target);
    return "WORD NOT FOUND";
  }

  /* finds the word that will give us another life */
  var regrowWord = "";
  for (word of matchingWords) {
    var uniqueLetters = [];
    for (const c of word) {
      if (!uniqueLetters.includes(c) && !usedLetters.includes(c)) {
        uniqueLetters.push(c);
      }
    }
    if (uniqueLetters.length + usedLetters.length == 26) {
      regrowWord = word;
      usedLetters = [];
      console.log("Found word that will give us another life: " + word);
      break; // will always get 1st word that gives a life in alphabetical order
    }
  }

  var word = regrowWord == "" ? getRandomWord(matchingWords) : regrowWord;

  /* add its letters to the list */
  for (const c of word) {
    if (!usedLetters.includes(c)) {
      usedLetters.push(c);
    }
  }

  usedWords.push(word);

  return word;
}

function getLongestWord(arr) {
  return arr.sort((a, b) => {a.length - b.length}).pop();
}

function getRandomWord(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}

function langRequest() {
  if (document.querySelector("body > div.pages > div.main.page > div.game > iframe") == null) {
    setTimeout(langRequest, 750);
    return;
  }
  document.querySelector("body > div.pages > div.main.page > div.game > iframe").contentWindow.postMessage({flag: "langRequest"}, "*");
}

langRequest();
