document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContent = document.getElementById('tab-content');
    const tabs = document.querySelectorAll('.tab');
    const contentDiv = document.getElementById('content');
    const overlay = document.querySelector('.overlay');
    const loadingScreen = document.getElementById('loading-screen');
    const homeContent = document.getElementById('home-content');
    const letters = document.querySelectorAll('.letter');
    const loadingMessages = document.querySelectorAll('.loading-message');
    const logo = document.querySelector('.logo');
    const chatBox = document.getElementById('chatBox');

    // Load home page by default on extension load
    loadContent('home.html');

    // Add event listeners to all tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            loadTabContent(this.getAttribute('data-tab'));
        });
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadContent(tab.getAttribute('data-target'));

            document.body.style.backgroundColor = (tab.dataset.target === 'summary.html' || tab.dataset.target === 'share.html') ? '#00477A' : '';
        });
    });

    // Logo click event to toggle chat box
    logo.addEventListener('click', function() {
        chatBox.classList.toggle('active');
    });

    // Content loading function
    function loadTabContent(file) {
        fetch(file)
            .then(response => response.text())
            .then(data => { tabContent.innerHTML = data; })
            .catch(err => console.error('Error loading tab content:', err));
    }

    function loadContent(url) {
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Network response is not okay.');
                return response.text();
            })
            .then(data => {
                contentDiv.innerHTML = data;
                if (url === 'home.html') setupScanButtonListener();
                if (url === 'summary.html') summaryGenerator();
            })
            .catch(err => { contentDiv.innerHTML = `<p>Error loading the content: ${err.message}</p>`; });
    }

    // Loading screen control
    function showLoadingScreen() {
        if (loadingScreen && homeContent) {
            loadingScreen.style.display = 'block';
            homeContent.style.display = 'none';
            startAnimations();
        } else {
            console.error('Loading screen or home content element not found!');
        }
    }

    function hideLoadingScreen() {
        if (loadingScreen && homeContent) {
            stopAnimations();
            loadingScreen.style.display = 'none';
            homeContent.style.display = 'block';
        } else {
            console.error('Loading screen or home content element not found!');
        }
    }

    // Scan button functionality
    function setupScanButtonListener() {
        const scanButton = document.getElementById('scanButton');
        if (scanButton) {
            scanButton.addEventListener('click', () => {
                showLoadingScreen();
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        function: parsePageContent,
                    }).then(() => {

                        hideLoadingScreen();
                        loadContent('summary.html');
                    }).catch(err => console.error('Error executing script:', err));
                });
            });
        } else {
            console.error('scanButton not found!');
        }
    }

    function showAlmostReadyMessage() {
        const almostReadyMessage = document.querySelector('.loading-message');
        almostReadyMessage.textContent = "Almost Ready";
        almostReadyMessage.style.opacity = 1; // Make it visible
    
        // Optionally, you can add a timeout to fade it out after a few seconds
        setTimeout(() => {
            almostReadyMessage.style.opacity = 0; // Fade it out after a delay
        }, 2000); // Adjust the timing as needed
    }
    

    // Animation functions
    let mainAnimationInterval, loadingMessageInterval;

    function startAnimations() {
        randomizeLetters();
        showLoadingMessages();
       // animateBroom();
        tidyLetters();
        mainAnimationInterval = setInterval(() => {
            randomizeLetters();
           // animateBroom();
            tidyLetters();
        }, 4000);
    }

    function stopAnimations() {
        clearInterval(mainAnimationInterval);
        clearInterval(loadingMessageInterval);
        tidyLetters();
    }

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

    function showLoadingMessages() {
        const messages = ["Loading", "Please Wait"];
        let currentIndex = 0;
    
        loadingMessageInterval = setInterval(() => {
            // Set the text for both messages
            loadingMessages.forEach((messageElement, index) => {
                // Show both messages for the current index
                if (index === currentIndex) {
                    messageElement.style.opacity = 1; // Show current message
                } else {
                    messageElement.style.opacity = 0; // Hide other messages
                }
            });
    
            // Gradually transition to the next index after a delay
            setTimeout(() => {
                // Switch to the next index after showing the current messages
                currentIndex = (currentIndex + 1) % messages.length;
            }, 1000); // Time to show the current messages before switching
        }, 2000); // Interval for switching messages (total cycle duration)
    }
    
    

    
    

    function tidyLetters() {
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.style.transform = `rotate(0deg) translate(0, 0)`;
            }, index * 250);
        });
    }

    // function animateBroom() {
    //     const broomContainer = document.querySelector('.broom-container');
    //     broomContainer.style.animation = 'sweep 2s linear forwards';

    //     broomContainer.addEventListener('animationend', () => {
    //         broomContainer.style.animation = 'none';
    //         broomContainer.offsetHeight;
    //         broomContainer.style.animation = 'sweep 2s linear forwards';
    //     });
    // }

    // Parse content and summarize
    async function parsePageContent() {
        const htmlContent = document.documentElement.outerHTML;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");
        const title = doc.querySelector('h1');
        let jsonObject = {
            title: title ? title.innerText : null,
            content: Array.from(doc.querySelectorAll('p')).map(p => ({ textContent: p.textContent.trim() }))
        };

        try {
            const response = await fetch('http://localhost:5000/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonObject, null, 4),
            });

            if (!response.ok) throw new Error('Network response was not ok: ' + response.statusText);

            const data = await response.json();
            chrome.runtime.sendMessage({ action: "display summaries", data: data });
        } catch (error) {
            console.error('Fetch operation problem:', error);
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
    
});
