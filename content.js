var array = [];
var usedWords = [];
var hasLoadedDict = false;
var language = "";
// ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

window.addEventListener("message", (event) => {
  if (event.data.flag == "Language") {
    language = event.data.language;
    // console.log(language)
  }
  if (!hasLoadedDict) {
    var payload = {flag: "Language"};
    document.querySelector("body > div.pages > div.main.page > div.game > iframe").contentWindow.postMessage(payload, "*");
    if (language == "") {
      console.log("Dict error");
      return;
    }
    chrome.runtime.sendMessage({dict: language}, function(dict) {
      array = dict;
      // console.log("loaded dictionary: " + array[Math.floor(Math.random() * 1000)]) -- This spams a lot, need to fix...works for now
      // also causes bug where first word doesn't autofill in...goodluck
      hasLoadedDict = true;
    });
  }
  if (event.data.name == "focusGameWindow") {
    var payload = {flag: "requestSyllable"};
    document.querySelector("body > div.pages > div.main.page > div.game > iframe").contentWindow.postMessage(payload, "*");
  } else if (event.data.name == "appendToChat") {
    if (event.data.text.startsWith("💣 Round lasted")) {
      usedWords = [];
    }
  } else if (event.data.flag == "syllable") {
    var payload = {};
    payload.flag = "typeWord";
    payload.word = findWord(event.data.syllable);
    document.querySelector("body > div.pages > div.main.page > div.game > iframe").contentWindow.postMessage(payload, "*");
  } else if (event.data.flag == "usedWord") {
    console.log("Got used word: " + event.data.word);
    usedWords.push(event.data.word);
  }
});

function findWord(target) {
  var matchingWords = [];
  var regrowWords = [];
  for (str of array) {
    var letters = [];
    for (const c of str) {
      if (!letters.includes(c)) {
        letters.push(c);
      }
    }

    if (str.includes(target.toLowerCase()) && !usedWords.includes(str) && str.length <= 30) {
      matchingWords.push(str);
    }
  }

  if (matchingWords.length == 0) {
    alert("empty...");
    return;
  }

  // var longestWord = getLongestWord(matchingWords);
  var longestWord = getRandomWord(matchingWords);

  usedWords.push(longestWord);

  return longestWord;
}

function getLongestWord(arr) {
  var longestWordCount = 0;
  var longestWord = "";
  for (str of arr) {
    if (str.length > longestWordCount)  {
      longestWord = str;
      longestWordCount = str.length;
    }
  }
  return longestWord;
}

function getRandomWord(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}
