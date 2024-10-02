

chrome.runtime.onMessage.addListener(message => {
  // 2. A page requested user data, respond with a copy of `user`

  if(message ==  'button clicked')
  {

    chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, function(tabs) {
      // and use that tab to fill in out title and url
      var tab = tabs[0];
      console.log(tab.url);

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: fetchPageContent
      });
  
     
  
    })
  }

});

function fetchPageContent() {
  // This will fetch the HTML content of the current page
  const htmlContent = document.documentElement.outerHTML;

  // Now you can do something with the HTML content, like sending it to your extension's background script
  console.log('Page HTML:', htmlContent);

  // Optionally, you can send the content to the background script
  //chrome.runtime.sendMessage({ html: htmlContent });
}



  