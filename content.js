var array = [];
var usedWords = [];
var usedLetters = [];
// ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

// init function
function populateDict() {
  const url = chrome.runtime.getURL("dictionary.txt");
  fetch(url).then((response) => {
    response.text().then(function(text) {
      array = text.split(/\r?\n/);
      // console.log("loaded dictionary: " + array[Math.floor(Math.random() * 1000)])
    });
  });
}

window.addEventListener("message", (event) => {
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

    /*if (validateUsedLetters(usedLetters, letters)) {
      regrowWords.push(str);
      console.log("added regrowWord: " + str)
    }*/

    if (str.includes(target.toLowerCase()) && !usedWords.includes(str) && str.length <= 30) {
      matchingWords.push(str);
    }
  }

  if (matchingWords.length == 0) {
    alert("empty...");
    return;
  }

  var longestWord = getLongestWord(matchingWords);
/*
  var longestWord = "";
  for (matchingWord of matchingWords) {
    if (regrowWords.includes(matchingWord)) {
      longestWord = matchingWord;
      break;
    }
  }
*/
  // if (longestWord == "") longestWord = getRandomWord(matchingWords);

  usedWords.push(longestWord);
  for (const c of longestWord) {
    usedLetters.push(c);
  }
  return longestWord;
}

function validateUsedLetters(arr1, arr2) {
  var larger = arr1.length > arr2.length ? arr1 : arr2;
  var smaller = arr1.length <= arr2.length ? arr2 : arr1;
  for (c of smaller) {
    if (!larger.includes(c)) larger.push(c);
  }
  if (larger.length >= 26) return true;
  return false;
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

populateDict();
