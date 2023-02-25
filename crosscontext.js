// service workers switch setTimeout to alarms due to process killing, see:
// https://developer.chrome.com/docs/extensions/mv3/migrating_to_service_workers/
/* afaik, setTimeout still works */

/*
TODO:
update setTimeout to using alarms -> scheduling process with SW as can be killed
Figure out validating key{down/up} - debugger has promise, validate with trusted true
then update typeWord() and lightning() to use keyup/down implementation
*/

window.addEventListener("keydown", (event) => {
  console.log(event);
});

window.addEventListener("message", (event) => {
  if (event.data.flag == "requestSyllable") {
    var payload = {
      flag: "syllable",
      syllable: window.document.getElementsByClassName("syllable")[0].innerText,
      language: document.querySelector("body > div.main.page > div.middle > div.canvasArea > div.quickRules > div > span.dictionary").textContent};
    window.parent.postMessage(payload, "*");
  } else if (event.data.flag == "typeWord") {
    typeWord(event.data.word);
    // lightning(event.data.word);
  }
});

function typeWord(word) {
  var currentTime = 500;
  var submitTime = currentTime + (175 * word.length) + 87;
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
  // submitForm();
}

// TODO: implement this as keydown and keyup events to better hide from the server
function dispatchKeyDown(letter) {
  /* not actual keydown event, appends and dispatches the element update */
  var input = window.document.getElementsByClassName("selfTurn")[0].children[0].children[0];
  input.value += letter;
  var ev = document.createEvent("Event");
  ev.initEvent("input");
  input.dispatchEvent(ev);
}

/*causes the frame to reload, doesn't actually submit the text
function submitForm() {
  document.querySelector("body > div.main.page > div.bottom > div.round > div.selfTurn > form").submit();
}
*/
/*
const carriageDown = new KeyboardEvent('keydown', {
    code: 'Enter',
    key: 'Enter',
    charCode: 13,
    keyCode: 13,
    view: window,
    bubbles: true
});

const carriageUp = new KeyboardEvent('keyup', {
    code: 'Enter',
    key: 'Enter',
    charCode: 13,
    keyCode: 13,
    view: window,
    bubbles: true
});*/

/*function submitForm() {

  seems this is un-usable, no time to debug further
  user actions are validated with read-only DOM fields, and actions by extension are invalid
  JKLM likely picks up this difference... seems debugger can circumvent this but this isn't working..


  // var input = window.document.getElementsByClassName("selfTurn")[0].children[0].children[0];
  // chrome.debugger.attach(window, "1.2", function() {
  //     chrome.debugger.sendCommand(window, "Input.dispatchKeyEvent", carriageDown);
  //     chrome.debugger.sendCommand(window, "Input.dispatchKeyEvent", carriageUp);
  // });
}*/
