var pokemonDict, englishDict = [];

chrome.runtime.onInstalled.addListener(function() {
  console.log("hi from background");

    fetch(chrome.runtime.getURL("dictionary.txt")).then((response) => {
      response.text().then(function(text) {
        englishDict = text.split(/\r?\n/);
        console.log("loaded english dictionary: " + englishDict[Math.floor(Math.random() * 1000)])
      });
  });
    fetch(chrome.runtime.getURL("pokemon.txt")).then((response) => {
      response.text().then(function(text) {
        pokemonDict = text.split(/\r?\n/);
        console.log("loaded pokemon dictionary: " + pokemonDict[Math.floor(Math.random() * 1000)])
    });
  });
});

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
  if (req.dict == "English") {
    sendResponse(englishDict);
  } else if (req.dict == "Pokemon") {
    sendResponse(pokemonDict);
  }
});
