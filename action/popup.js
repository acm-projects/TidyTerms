
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


let currentIndex = -1; // Track the current index of highlighted text
let highlights = []; // Array to store highlighted elements

function summaryGenerator() {
    const summaryBox = document.getElementById("summaryBox");
    const searchBar = document.getElementById('search-bar');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const indexDisplay = document.getElementById('index-display'); // Element to display current index and count

    if (summaryBox) {
        console.log("Summary box exists");

        // Clear previous content
        summaryBox.innerHTML = '';

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === 'display summaries') {
                console.log("Load data message received");

                const data = message.data['key_highlights'];

                // Start with a header
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        // Append key and value to the summary box
                        summaryBox.innerHTML += "<p><strong>" + key  + ":" + data[key] + "</strong> "  + "<br> <br>" + "</p>";
                    }
                }

                // Now set up the search functionality
                setupSearchFunctionality(summaryBox, searchBar, prevButton, nextButton, indexDisplay);
            }
        });
    }
}

function setupSearchFunctionality(summaryBox, searchBar, prevButton, nextButton, indexDisplay) {
    searchBar.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase(); // Normalize input for case-insensitive search
        resetHighlights(summaryBox, indexDisplay); // Clear previous highlights

        if (query) {
            const text = summaryBox.innerText.toLowerCase();
            highlights = []; // Reset highlights array
            let match;
            const regex = new RegExp(`(${query})`, 'gi');
            const originalHTML = summaryBox.innerHTML; // Store original HTML

            // Find all matches and highlight them
            summaryBox.innerHTML = originalHTML.replace(regex, (match) => {
                highlights.push(match); // Store each highlight
                return `<span class="highlight">${match}</span>`; // Wrap matches in a span
            });

            // If there are matches, enable buttons
            if (highlights.length > 0) {
                currentIndex = 0; // Reset current index to the first match
                highlightCurrent(summaryBox, currentIndex, indexDisplay);
                prevButton.disabled = false; // Enable previous button
                nextButton.disabled = false; // Enable next button
            } else {
                prevButton.disabled = true; // Disable previous button if no match
                nextButton.disabled = true; // Disable next button if no match
                indexDisplay.textContent = ''; // Clear index display
            }
        } else {
            // If the input is empty, reset to original text
            resetHighlights(summaryBox, indexDisplay);
            prevButton.disabled = true; // Disable previous button
            nextButton.disabled = true; // Disable next button
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = highlights.length - 1; // Wrap around to the last match
        }
        highlightCurrent(summaryBox, currentIndex, indexDisplay);
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < highlights.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; // Wrap around to the first match
        }
        highlightCurrent(summaryBox, currentIndex, indexDisplay);
    });
}

function highlightCurrent(summaryBox, index, indexDisplay) {
    // Remove existing highlight
    const highlightedElements = summaryBox.querySelectorAll('.highlight');
    highlightedElements.forEach((el, i) => {
        el.classList.remove('current-highlight');
        if (i === index) {
            el.classList.add('current-highlight'); // Highlight the current index
        }
    });

    // Update index display
    indexDisplay.textContent = `Result ${index + 1} of ${highlights.length}`; // Show current index and total matches

    // Scroll to the current highlight
    summaryBox.scrollTop = highlightedElements[index].offsetTop - summaryBox.offsetTop; 
}

function resetHighlights(summaryBox, indexDisplay) {
    const originalText = summaryBox.innerText; // Get original text
    summaryBox.innerHTML = originalText; // Reset to original text
    highlights = []; // Clear highlights array
    currentIndex = -1; // Reset current index
    indexDisplay.textContent = ''; // Clear index display
}

// Inside your DOMContentLoaded or appropriate event
document.addEventListener('DOMContentLoaded', function() {
    const indexDisplay = document.createElement('div');
    indexDisplay.id = 'index-display'; // Create an element to display index info
    indexDisplay.style.marginTop = '10px'; // Add some margin for visual separation
    document.body.appendChild(indexDisplay); // Append to body or a specific container

    // Load default content
    loadContent('home.html');
});





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
        chrome.runtime.sendMessage( {action: "display summaries", data: data}) // Pass the fetched data to summaryGenerator

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }


 
  

  
    // Output JSON string
  
}

// Load default content
loadContent('home.html');