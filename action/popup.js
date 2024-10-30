
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
const loadingScreen = document.getElementById('loading-screen'); // Ensure this element exists in DOM
const homeContent = document.getElementById('home-content'); // Home content element


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

// function setupScanButtonListener() {
//     const scanButton = document.getElementById('scanButton');

//     if (scanButton) {
//         console.log('Button exists!');
//         scanButton.addEventListener('click', () => {
//             console.log('Button clicked!');
//             chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//                 chrome.scripting.executeScript({
//                     target: { tabId: tabs[0].id },
//                     function: parsePageContent,
//                 });
//                 loadContent('summary.html'); 
//             });
//         });
//     } else {
//         console.error('scanButton not found!');
//     }

// }

function setupScanButtonListener() {
    const scanButton = document.getElementById('scanButton');
    if (scanButton) {
        scanButton.addEventListener('click', () => {
            showLoadingScreen(); // Show loading screen
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    function: parsePageContent,
                }).then(() => {
                    hideLoadingScreen(); // Hide loading screen after parsing
                    loadContent('summary.html');
                }).catch(err => console.error('Error executing script:', err));
            });
        });
    } else {
        console.error('scanButton not found!');
    }
}

function showLoadingScreen() {
    if (loadingScreen && homeContent) {
        loadingScreen.style.display = 'block'; // Show loading screen
        homeContent.style.display = 'none'; // Hide home content
    } else {
        console.error('Loading screen or home content element not found!');
    }
}

function hideLoadingScreen() {
    if (loadingScreen && homeContent) {
        loadingScreen.style.display = 'none'; // Hide loading screen
        homeContent.style.display = 'block'; // Show home content
    } else {
        console.error('Loading screen or home content element not found!');
    }
}

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

        const data = await response.json();
        chrome.runtime.sendMessage({ action: "display summaries", data: data }); // Pass the fetched data to summaryGenerator

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
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

let originalHTML; // Declare it in the global scope


function setupSearchFunctionality(summaryBox, searchBar, prevButton, nextButton, indexDisplay) {
    originalHTML = summaryBox.innerHTML; // Store original HTML once

    searchBar.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        resetHighlights(summaryBox, indexDisplay); // Clear previous highlights

        if (query) {
            highlights = []; // Reset highlights array
            const regex = new RegExp(`(${query})`, 'gi');

            // Highlight matches without losing other styling
            summaryBox.innerHTML = originalHTML.replace(regex, (match) => {
                highlights.push(match);
                return `<span class="highlight">${match}</span>`;
            });

            // Enable or disable buttons based on match count
            if (highlights.length > 0) {
                currentIndex = 0; // Start with the first match
                highlightCurrent(summaryBox, currentIndex, indexDisplay);
                prevButton.disabled = false;
                nextButton.disabled = false;
            } else {
                prevButton.disabled = true;
                nextButton.disabled = true;
                indexDisplay.textContent = '';
            }
        } else {
            resetHighlights(summaryBox, indexDisplay); // Restore original state
            prevButton.disabled = true;
            nextButton.disabled = true;
        }
    });

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : highlights.length - 1; // Wrap around
        highlightCurrent(summaryBox, currentIndex, indexDisplay);
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex < highlights.length - 1) ? currentIndex + 1 : 0; // Wrap around
        highlightCurrent(summaryBox, currentIndex, indexDisplay);
    });
}

function highlightCurrent(summaryBox, index, indexDisplay) {
    const highlightedElements = summaryBox.querySelectorAll('.highlight');
    highlightedElements.forEach((el, i) => {
        el.classList.remove('current-highlight');
        if (i === index) {
            el.classList.add('current-highlight'); // Mark current index
        }
    });

    indexDisplay.textContent = `Result ${index + 1} of ${highlights.length}`; // Update index info
    summaryBox.scrollTop = highlightedElements[index].offsetTop - summaryBox.offsetTop; // Scroll to current highlight
}

function resetHighlights(summaryBox, indexDisplay) {
    summaryBox.innerHTML = originalHTML; // Restore original HTML
    highlights = [];
    currentIndex = -1; 
    indexDisplay.textContent = '';
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

document.addEventListener("DOMContentLoaded", function () {
    const letters = document.querySelectorAll('.letter');
    const loadingMessages = document.querySelectorAll('.loading-message');
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContent = document.getElementById('mainContent');

    // Function to randomize initial positions for letters
    function randomizeLetters() {
        letters.forEach(letter => {
            letter.style.opacity = 1;
            const randomX = (Math.random() - 0.5) * 50;
            const randomY = (Math.random() - 0.5) * 50;
            const randomRotate = Math.random() * 180 - 90;
            letter.style.transform = `rotate(${randomRotate}deg) translate(${randomX}px, ${randomY}px)`;
            letter.style.transition = 'all 0.38s ease';
        });
    }

    // Show loading messages gradually
    function showLoadingMessages() {
        loadingMessages.forEach((message, index) => {
            setTimeout(() => {
                message.style.opacity = 1;
            }, index * 2000);
        });
    }

    // Tidy letters back to original positions
    function tidyLetters() {
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.style.transform = `rotate(0deg) translate(0, 0)`;
            }, index * 250); // No delay between letters
        });
    }

    // Start summarization process
    function startSummarization() {
        // Show loading screen
        loadingScreen.style.display = 'block';
        mainContent.style.display = 'none';

        // Simulate the summarization process (e.g., an API call or processing)
        setTimeout(() => {
            // Tidy up letters before hiding the loading screen
            tidyLetters();
            // Set a delay to allow tidy animation to complete
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                mainContent.style.display = 'block';

                // Here you can dynamically insert the summary content
                const contentDiv = document.getElementById('content');
                contentDiv.innerHTML = '<h2>Summary complete!</h2><p>This is the summarized content.</p>'; // Simulated content
            }, letters.length * 250 + 1000); // Wait for all letters to tidy + 1 second
        }, 2000); // Adjust this to your initial loading time
    }

    // Set the looping animation
    setInterval(() => {
        randomizeLetters(); // Randomize positions before tidying
        animateBroom(); 
        tidyLetters(); // Tidy up letters
    }, 4000); // Change this timing based on how long you want the randomization to last

    // Start the animation
    randomizeLetters();
    showLoadingMessages();
    animateBroom();
    tidyLetters(); // Initial tidy to ensure letters are in place

    // Show loading screen and simulate summarization when tab for 'summary' is clicked
    const summaryTab = document.querySelector('.tab[data-target="summary.html"]');
    summaryTab.addEventListener('click', function () {
        startSummarization(); // Trigger summarization process
    });

    // Handle other tabs (e.g., home, share)
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            if (tab.getAttribute('data-target') !== 'summary.html') {
                loadContent(tab.getAttribute('data-target'));
            }
        });
    });

    // Function to load content for other tabs (home, share)
    function loadContent(page) {
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = `<h2>Loading ${page}...</h2>`; // Simulated content
    }
});


// Function to animate the broom sweeping across the letters
function animateBroom() {
    const broomContainer = document.querySelector('.broom-container');
    broomContainer.style.animation = 'sweep 4s linear forwards'; // Adjust duration as needed

    // Reset the animation after it completes
    broomContainer.addEventListener('animationend', () => {
        broomContainer.style.animation = 'none'; // Reset animation
        broomContainer.offsetHeight; // Trigger reflow
        broomContainer.style.animation = 'sweep 4s linear forwards'; // Restart
    });
}



// async function parsePageContent() {


//     let data = {}
  
//     const htmlContent = document.documentElement.outerHTML;
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(htmlContent, "text/html");
  
   
  
//     const title = doc.querySelector(['h1']);
  
//     console.log(title);
  
//     let jsonObject = {
//       'title': title ? title.innerText : null
//     };
  
  
//     const paragraphs = doc.querySelectorAll(['p']);
  
    
  
//     jsonObject['content'] = Array.from(paragraphs).map(paragraph => ({
//       textContent: paragraph.textContent.trim(),
  
//     }));
  
//     // Convert to a JSON string
//     let jsonString = JSON.stringify(jsonObject, null, 4);
//     console.log(jsonString);

//     try {
//         const response = await fetch('http://localhost:5000/summarize', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: jsonString,
//         });

//         if (!response.ok) {
//             throw new Error('Network response was not ok: ' + response.statusText);
//         }

//         console.log('herenoe'); 
//         const data = await response.json(); // Await the response properly
//         chrome.runtime.sendMessage( {action: "display summaries", data: data}) // Pass the fetched data to summaryGenerator

//     } catch (error) {
//         console.error('There was a problem with the fetch operation:', error);
//     }


 
  

  
//     // Output JSON string
  
// }

// Load default content

loadContent('home.html'); 

