
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContent = document.getElementById('tab-content');
    // Function to load content from an external HTML file
    // Function to load content from an external HTML file
    function loadTabContent(file) {
        fetch(file)
            .then(response => response.text())
            .then(data => {
                tabContent.innerHTML = data;  // Load the HTML content into the container
            })
            .catch(err => console.error('Error loading tab content:', err));
    }
 
    // Load the first tab content by default
    loadTabContent('home.html');
    // Add event listeners to all tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'active' class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add 'active' class to the clicked button
            this.classList.add('active');
            // Load the content for the clicked tab
            const tabFile = this.getAttribute('data-tab');
            loadTabContent(tabFile);
        });
    });
});
const tabs = document.querySelectorAll('.tab');
const contentDiv = document.getElementById('content');
//const chatBox = document.getElementById('chatBox');
const overlay = document.querySelector('.overlay');

function loadContent(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Network response is not okay.');
            return response.text();
        })
        .then(data => {
            console.log('content is loaded!'); 
            contentDiv.innerHTML = data;
            if (url === 'home.html') {
                setupScanButtonListener();
            }
            if(url === 'summary.html'){
                summaryGenerator();
            }
        })
        .catch(err => {
            contentDiv.innerHTML = `<p>Error loading the content: ${err.message}</p>`;
        });
}

function unloadContent() {
    const contentArea = document.getElementById('content');
    contentArea.innerHTML = ''; // Clear existing content
}

async function setupScanButtonListener() {
    const scanButton = document.getElementById('scanButton');

    if (scanButton) {
        scanButton.addEventListener('click', async () => {
            console.log('Button clicked!');
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            await chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: parsePageContent,
            });
            loadContent('loadContent.html'); // Ensure this runs after parsePageContent completes
        });
    } else {
        console.error('scanButton not found!');
    }
}

async function parsePageContent() {
    loadContent('loadContent.html'); // Load the loading screen initially

    let data = {};

    const htmlContent = document.documentElement.outerHTML;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    const title = doc.querySelector('h1'); // Query the title

    console.log(title);

    let jsonObject = {
        'title': title ? title.innerText : null
    };

    const paragraphs = doc.querySelectorAll('p');

    jsonObject['content'] = Array.from(paragraphs).map(paragraph => ({
        textContent: paragraph.textContent.trim(),
    }));

    // Convert to a JSON string
    let jsonString = JSON.stringify(jsonObject, null, 4);
    console.log(jsonString);

    try {
        const response = await fetch('http://localhost:5000/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonString,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const data = await response.json(); // Await the response properly
        unloadContent(); // Unload the loading content

        // Load the summary content again
        loadContent('summary.html'); // Call loadContent to load summary.html

        // You may also want to send data to the summary generator
        chrome.runtime.sendMessage({ action: "display summaries", data: data });

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}



function summaryGenerator(data){


    const summaryBox = document.getElementById("summaryBox");

    if(summaryBox){

        console.log("summary box exists");

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === 'display summaries') {

                console.log("load data message recieved");

                const data = message.data['key_highlights'];
                 // Start with a header

                // Iterate over the object using for...in
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        // Append key and value to the content variable with newlines
                        summaryBox.innerHTML += key + ": " + data[key] + "<br><br>";
                    }
                }
    
                // Set the paragraph's textContent to the assembled content
          
            }
        });
    }
}


// function summaryGenerator() {
//     const summaryBox = document.getElementById("summaryBox");

//     if (summaryBox) {
//         const handleMessage = (message, sender, sendResponse) => {
//             if (message.action === 'loadData') {
//                 const data = message.data['key_highlights'];
                
//                 // Clear the summaryBox before appending new content
//                 summaryBox.innerHTML = ''; 
                
//                 // Iterate over the object and create elements dynamically
//                 for (let key in data) {
//                     if (data.hasOwnProperty(key)) {
//                         // Create a new div for each key-value pair
//                         const item = document.createElement('div');
//                         item.textContent = `${key}: ${data[key]}`;
//                         summaryBox.appendChild(item);
//                     }
//                 }
//             }
//         };

//         // Remove any existing listeners to avoid adding multiple identical ones
//         chrome.runtime.onMessage.removeListener(handleMessage);
        
//         // Add the message listener
//         chrome.runtime.onMessage.addListener(handleMessage);
//     }
// }


tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => {
            t.classList.remove('active');
            //t.classList.remove('summary-active');
        });
        tab.classList.add('active');
        // if (tab.dataset.target === 'summary.html') {
        //     tab.classList.add('summary-active'); // Add home-active class to Home tab
        // }

        loadContent(tab.getAttribute('data-target'));

        if(tab.dataset.target === 'summary.html')
        {
            document.body.style.backgroundColor = '#00477A';
        }
        else if(tab.dataset.target === 'share.html')
        {
            document.body.style.backgroundColor = '#00477A';
        }
        // document.body.style.backgroundColor = (tab.dataset.target === 'summary.html') ? '#00477A' : ''; // Example: Change color based on active tab
        // document.body.style.backgroundColor = (tab.dataset.target === 'share.html') ? '#00477A' : ''; // Example: Change color based on active tab
        //overlay.style.opacity = (tab.dataset.target === 'summary.html') ? '0.4' : '0.5'; 
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const logo = document.querySelector('.logo'); // Select the logo element
    const chatBox = document.getElementById('chatBox'); // Select the chat box

    // Add event listener to the logo
    logo.addEventListener('click', function () {
        chatBox.classList.toggle('active'); // Toggle the chat box visibility
    });
    
});



async function parsePageContent() {

    loadContent("loadContent.html"); 

    let data = {}
  
    const htmlContent = document.documentElement.outerHTML;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
  
   
  
    const title = doc.querySelector(['h1']);
  
    console.log(title);
  
    let jsonObject = {
      'title': title ? title.innerText : null
    };
  
  
    const paragraphs = doc.querySelectorAll(['p']);
  
    
  
    jsonObject['content'] = Array.from(paragraphs).map(paragraph => ({
      textContent: paragraph.textContent.trim(),
  
    }));
  
    // Convert to a JSON string
    let jsonString = JSON.stringify(jsonObject, null, 4);
    console.log(jsonString);

    try {
        const response = await fetch('http://localhost:5000/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonString,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const data = await response.json(); // Await the response properly
        unloadContent(); 
        chrome.runtime.sendMessage( {action: "display summaries", data: data}) // Pass the fetched data to summaryGenerator

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }


 
  

  
    // Output JSON string
  
}




// Load default content
loadContent('home.html');