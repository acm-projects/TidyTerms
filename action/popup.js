
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

function setupScanButtonListener() {
    const scanButton = document.getElementById('scanButton');

    if (scanButton) {
        console.log('Button exists!');
        scanButton.addEventListener('click', () => {
            console.log('Button clicked!');
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    function: parsePageContent,
                });
                loadContent('summary.html');
            });
        });
    } else {
        console.error('scanButton not found!');
    }

}


function summaryGenerator(){


    const summaryBox = document.getElementById("summaryBox");

    if(summaryBox){
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === 'loadData') {

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



function parsePageContent() {


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
  
    chrome.runtime.sendMessage({ action: "call summarize endpoint", data: jsonString }, function(response) {
      console.log("Response from background:", response);
    });
  
    // Output JSON string
  
}




// Load default content
loadContent('home.html');

