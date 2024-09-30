

chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
    if (message.data) {
      console.log("Received data:", message.data);

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
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });


      
      
      // Optionally send a response back
      sendResponse({ status: "Data received" });
    }
    return true; // Required if you want to send an asynchronous response



});