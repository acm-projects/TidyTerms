
// Initialize Auth0
const auth0 = new Auth0Client({
    domain: 'YOUR_AUTH0_DOMAIN',
    client_id: 'YOUR_AUTH0_CLIENT_ID'
});

// Load summaries on page load
loadSummaries();

const tabs = document.querySelectorAll('[data-tab-target]')
const tabContents = document.querySelectorAll('[data-tab-content]')

// Event listeners for tab changes
tabs.forEach(tab => {
    const currentTab = document.querySelector(tab.dataset.tabTarget);

    if (currentTab.id === 'mySummaries') {
        loadSummaries();
    }

    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.tabTarget);
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active');
        });

        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        tab.classList.add('active');
        target.classList.add('active');

        console.log(target.id);

        if (target.id === 'mySummaries') {
            loadSummaries();
        }
    });
});

// Function to load summaries
async function loadSummaries() {
    const apiUrl = 'http://localhost:5000/documents'; // Your API endpoint

    // Get the access token
    try {
        const token = await auth0.getTokenSilently();
        
        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        const summaries = await response.json();

        // Get the container where the summaries will be displayed
        var summaryContainer = document.getElementById('summaryContainer');
        summaryContainer.innerHTML = '<div></div>';  // Clear previous content

        // Loop through the summaries and generate buttons for each
        summaries.forEach(summary => {
            const summaryButton = document.createElement('button');
            summaryButton.classList.add('styled-button', 'zen-kaku-gothic-new-regular');
            summaryButton.innerHTML = `
                ${summary.title} 
                <div class="icon-container">
                    <i class="fas fa-share"></i>
                </div>
            `;
            summaryButton.addEventListener('click', () => {
                const content = { title: "Summary loaded", text: summary.summary };
                loadNewContent(content);
            });
            summaryContainer.appendChild(summaryButton);
        });
    } catch (error) {
        console.error('Error fetching summaries:', error);
    }
}

// Overlay functionality for content display
const overlay = document.getElementById("overlay");
const overlayContent = document.getElementById("overlayContent");

// Function to load new content based on button clicked
function loadNewContent(content) {
    document.getElementById("mainContent").style.display = "none"; // Hide main content
    overlay.style.display = "flex"; // Show overlay
    overlayContent.innerHTML = `
        <h2>${content.title}</h2>
        <p>${content.text}</p>
        <button id="backButton" class="styled-button">Back to Main Content</button>
    `;

    // Add event listener for back button
    document.getElementById("backButton").addEventListener("click", resetContent);
}

// Function to reset content and show main content
function resetContent() {
    overlay.style.display = "none"; // Hide overlay
    document.getElementById("mainContent").style.display = "block"; // Show main content again
}

// Add event listeners to buttons
const loadButtons = document.querySelectorAll(".styled-button");
loadButtons.forEach(button => {
    button.addEventListener("click", function() {
        const buttonId = this.id;
        
        // Define content based on which button was pressed
        let content;
        switch(buttonId) {
            case "loadContent1":
                content = { title: "Content 1 Loaded", text: "This is the content for button 1." };
                break;
            case "loadContent2":
                content = { title: "Content 2 Loaded", text: "This is the content for button 2." };
                break;
            case "loadContent3":
                content = { title: "Content 3 Loaded", text: "This is the content for button 3." };
                break;
            case "newSummary":
                content = { title: "New Summary Loaded", text: "This is the content for new summary." };
                break;
            case "summaryOne": 
                content = { title: "Summary One Loaded", text: "This is the content for summary one." };
                break;
            default:
                content = { title: "Unknown", text: "No content available." };
        }
        
        // Load the new content into the overlay
        loadNewContent(content);
    });
});

        
   
// document.addEventListener('DOMContentLoaded', function () {
//     const logo = document.querySelector('.logo'); // Select the logo element
//     const chatBox = document.getElementById('chatBox'); // Select the chat box

//     // Add event listener to the logo
//     logo.addEventListener('click', function () {
//         chatBox.classList.toggle('active'); // Toggle the chat box visibility
//     });
    
// });