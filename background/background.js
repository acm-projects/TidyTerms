

chrome.runtime.onMessage.addListener(message => {
    // 2. A page requested user data, respond with a copy of `user`



    chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, function(tabs) {
      // and use that tab to fill in out title and url
      var tab = tabs[0];
      console.log(tab.url);

      url = tab.url



      fetch(url)
      .then(response => response.text())  // Get the HTML as plain text
      .then(data => {

        chrome.tabs.sendMessage(tab.id, { html: data });

      })
      .catch(error => console.error('Error fetching the page:', error));

















    //   fetch("http://127.0.0.1:5000/data", {
    //     method: 'POST', // HTTP method
    //     headers: {
    //         'Content-Type': 'application/json', // Specify that we're sending JSON data
    //     },
    //     body: JSON.stringify(data) // Convert the data object to a JSON string
    //   })
    //   .then(response => {
    //     if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //     }
    //     return response.json(); // Parse the JSON response
    //   })

    })








  
  });