document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
    const exitButton = document.getElementById('exitButton');
    const tabContainer = document.querySelector('.tab-container');
    const tabs = document.querySelectorAll('[data-tab-target]');
    const tabContents = document.querySelectorAll('[data-tab-content]');

    // Show the tabs when the toggle button is clicked
    toggleButton.addEventListener('click', () => {
        tabContainer.classList.remove('hidden'); // Show tabs
        toggleButton.classList.add('hidden'); // Hide toggle button
        exitButton.classList.remove('hidden'); // Show exit button
    });

    // Hide the tabs and show the toggle button when exit is clicked
    exitButton.addEventListener('click', () => {
        tabContainer.classList.add('hidden'); // Hide tabs
        toggleButton.classList.remove('hidden'); // Show toggle button
        exitButton.classList.add('hidden'); // Hide exit button
    });

    // Tab switching functionality
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = document.querySelector(tab.dataset.tabTarget);
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            tabs.forEach(t => {
                t.classList.remove('active');
            });
            tab.classList.add('active');
            target.classList.add('active');
        });
    });
});


//import { text} from 'express';

loadSummaries();

const tabs = document.querySelectorAll('[data-tab-target]')
const tabContents = document.querySelectorAll('[data-tab-content]')


tabs.forEach(tab => {

    const currentTab = document.querySelectorAll(tab.dataset.tabTarget);

    if (currentTab.id === 'mySummaries'){
        loadSummaries();
    }

    tab.addEventListener('click',() => {
        const target = document.querySelector(tab.dataset.tabTarget)
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active')
        })


        tabs.forEach(tab => {
            tab.classList.remove('active')
        })
        tab.classList.add('active')


        target.classList.add('active')

        console.log(target.id);

        if (target.id === 'mySummaries'){
            loadSummaries();
        }


    })
})



async function loadSummaries() {
    const apiUrl = 'http://localhost:5000/documents'; // Your API endpoint


    try {
        const response = await fetch(apiUrl);
        const summaries = await response.json();

        // Get the container where the summaries will be displayed
        var summaryContainer = document.getElementById(id='summaryContainer');
        summaryContainer.innerHTML = '<div></div>';  // Clear previous content


        // Loop through the summaries and generate buttons for each
        summaries.forEach(summary => {
            console.log(summary.toString());
            
            const summaryButton = document.createElement('button');
            summaryButton.classList.add('styled-button', 'zen-kaku-gothic-new-regular');
            //summaryButton.id = "summaryOne"
            summaryButton.innerHTML = `
                ${summary.title} 
                <div class="icon-container">
                    <i class="fas fa-share"></i>
                </div>
            `;
            summaryButton.addEventListener('click', () => {
                const content = {title: "Summary loaded", text: summary.summary}
                loadNewContent(content);
            });
            summaryContainer.appendChild(summaryButton);
        });
    } catch (error) {
        console.error('Error fetching summaries:', error);
    }
}


// // Get the button and main content container
// const loadButton = document.getElementById("loadContentButton");
// const mainContent = document.getElementById("mainContent");

// // Function to load the new content and show a back button
// function loadNewContent() {
//     // Populate the empty content div with new content
//     mainContent.innerHTML = `
//         <h2>New Content Loaded</h2>
//         <p>This is the new content that was dynamically added.</p>
//         <button id="backButton" class="styled-button">Back to Main Content</button>
//     `;

//     // Hide the load button
//     loadButton.style.display = "none";

//     // Add event listener for the back button
//     const backButton = document.getElementById("backButton");
//     backButton.addEventListener("click", resetContent);
// }

// // Function to reset content (back to the empty state)
// function resetContent() {
//     // Clear the main content
//     mainContent.innerHTML = "";

//     // Show the load button again
//     loadButton.style.display = "block";
// }

// // Add event listener to load content when the button is clicked
// loadButton.addEventListener("click", loadNewContent);

// Get references to the buttons and overlay elements
const overlay = document.getElementById("overlay");
const overlayContent = document.getElementById("overlayContent");
const loadButtons = document.querySelectorAll(".styled-button");

// Function to load new content based on button clicked
function loadNewContent(content) {
    // Hide main content
    document.getElementById("mainContent").style.display = "none";
    
    // Show overlay
    overlay.style.display = "flex";
    
    // Populate overlay with new content and back button
    overlayContent.innerHTML = `
        <h2>${content.title}</h2>
        <p>${content.text}</p>
        <button id="backButton" class="styled-button">Back to Main Content</button>
    `;
    
    // Add event listener for back button
    document.getElementById("backButton").addEventListener("click", function() {
        resetContent();
    });
}

// Function to reset content and show main content
function resetContent() {
    // Hide overlay
    overlay.style.display = "none";
    
    // Show main content again
    document.getElementById("mainContent").style.display = "block";
}

// Add event listeners to buttons
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