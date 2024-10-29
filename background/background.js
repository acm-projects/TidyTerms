


// chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {


//   console.log("summarize message recieved in content script");
//   if (message.action === "call summarize endpoint") {
//     if (message.data) {
      


//       try {
//         // Perform the asynchronous fetch call
//         const response = await fetch('http://localhost:5000/summarize', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: message.data,
//         });

//         if (!response.ok) {
//           throw new Error('Network response was not ok: ' + response.statusText);
//         }

//         // Parse the JSON response
//         const data = await response.json();

//         // Log the response data
//         console.log('Response Data:', JSON.stringify(data, null, 2));



//         // Send the data back to the popup (or whichever part is listening)
//         chrome.runtime.sendMessage({ action: 'display summaries', data: data });

//         // Send the response back to the caller (optional)
//         sendResponse({ status: 'Data received', summaries: data });
//       } catch (error) {
//         console.error('There was a problem with the fetch operation:', error);

//         // Send error response
//         sendResponse({ status: 'Fetch error', error: error.message });
//       }

//       // Keep the service worker alive until the asynchronous fetch and message sending is done
//       return true;
//     }
//   }

//   // Ensure the listener continues for async responses
//   return true;
// });













// // chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {

// //   if (message.action === "call summarize endpoint"){

// //     if (message.data) {

// //       fetch('http://localhost:5000/summarize', {
// //         method: 'POST', // Specify the HTTP method
// //         headers: {
// //           'Content-Type': 'application/json', // Specify the content type as JSON
// //         },
// //         body: message.data
// //       })
// //       .then((response) => {
// //         if (!response.ok) {
// //           throw new Error('Network response was not ok ' + response.statusText);
// //         }
// //         return response.json(); // Convert the response to JSON
// //         })
// //       .then(data => {

        
// //           console.log('Response Data:', JSON.stringify(data, null, 2));

          

// //           chrome.runtime.sendMessage( { action: 'display summaries', data: data });



// //       })
// //       .catch((error) => {
// //         console.error('There was a problem with the fetch operation:', error);
// //       });

      


      
      
// //       // Optionally send a response back
// //       sendResponse({ status: "Data received" });
// //     }

// //   }
// //   return true; // Required if you want to send an asynchronous response



// // });

