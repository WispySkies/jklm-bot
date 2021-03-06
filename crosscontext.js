window.addEventListener("message", (event) => {
  if (event.data.flag == "requestSyllable") {
    var payload = {flag: "syllable", syllable: window.document.getElementsByClassName("syllable")[0].innerText, language: document.querySelector("body > div.main.page > div.middle > div.canvasArea > div.quickRules > div > span.dictionary").textContent};
    window.parent.postMessage(payload, "*");
  } else if (event.data.flag == "typeWord") {
    typeWord(event.data.word);
    // lightning(event.data.word);
  }
});

function typeWord(word) {
  var currentTime = 500;
  var submitTime = currentTime + (175 * word.length);
  for (const c of word) {
    setTimeout(dispatchKeyDown, currentTime, c);
    currentTime += (Math.random() * 175);
  }
  // setTimeout(submitForm, submitTime);
}
function lightning(word) {
  for (const c of word) {
    dispatchKeyDown(c);
  }
}

function dispatchKeyDown(letter) {
  var input = window.document.getElementsByClassName("selfTurn")[0].children[0].children[0];
  input.value += letter;
  var ev = document.createEvent("Event");
  ev.initEvent("input");
  input.dispatchEvent(ev);
}
