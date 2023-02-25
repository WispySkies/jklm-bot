var array = [];
var usedWords = [];
var usedLetters = [];
var receivedLanguage = false;
// ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]


window.addEventListener("message", (event) => {

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
    if (!receivedLanguage) {
      chrome.runtime.sendMessage({dict: event.data.language}, function(dict) {
        array = dict;
        sendWord(findWord(event.data.syllable));
        receivedLanguage = true;
      });
    } else sendWord(findWord(event.data.syllable));
  }
});

function sendWord(word) {
  if (word == "WORD NOT FOUND") return;
  document.querySelector("body > div.pages > div.main.page > div.game > iframe").contentWindow.postMessage({flag: "typeWord", word: word}, "*");
}

function findWord(target) {
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

  var regrowWord = regrowFocus(matchingWords);
  var word = regrowWord == "" ? getRandomWord(matchingWords) : regrowWord;

  word = getLongestWord(matchingWords)

  /* add its letters to the list */
  for (const c of word) {
    if (!usedLetters.includes(c)) {
      usedLetters.push(c);
    }
  }

  usedWords.push(word);

  return word;
}

function regrowFocus(matchingWords) {
  var regen = regrowComplete(matchingWords);
  if (regen != "") return regen;

  var set = [];
  for (word of matchingWords) {
    var uniqueLetters = [];
    for (const c of word) {
      if (!uniqueLetters.includes(c) && !usedLetters.includes(c)) {
        uniqueLetters.push(c);
      }
    }
    set.push([word, uniqueLetters.length]);
  }
  return set.sort((a, b) => {a[1].length - b[1].length}).pop()[0];
}

function regrowComplete(matchingWords) {
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
  return regrowWord;
}

function getLongestWord(arr) {
  return arr.sort((a, b) => {a.length - b.length}).pop();
}

function getRandomWord(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}
