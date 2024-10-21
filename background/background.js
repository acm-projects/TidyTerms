
chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {

  if (message.action === "call summarize endpoint"){

    if (message.data) {

      fetch('http://localhost:5000/summarize', {
        method: 'POST', // Specify the HTTP method
        headers: {
          'Content-Type': 'application/json', // Specify the content type as JSON
        },
        body: message.data
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Convert the response to JSON
        })
      .then(data => {
          //console.log('Response Data:', JSON.stringify(data, null, 2));

          chrome.runtime.sendMessage( { action: 'loadData', data: data });



      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });

      


      
      
      // Optionally send a response back
      sendResponse({ status: "Data received" });
    }

  }
  return true; // Required if you want to send an asynchronous response



});

