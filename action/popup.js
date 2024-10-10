

// const button = document.getElementById("button")

// button.onclick = function() {
//     chrome.runtime.sendMessage('this is a test message')

// }

document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContent = document.getElementById('tab-content');
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
                    files: ["content/content.js"]
                });
            });
        });
    } else {
        console.error('scanButton not found!');
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




// Load default content
loadContent('home.html');

