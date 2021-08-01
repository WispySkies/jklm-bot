chrome.runtime.onInstalled.addListener(function() {
  console.log("hi from background");

    function go() {
      console.log("called go");
    }

    go();
});
