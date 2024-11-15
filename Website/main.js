
//import { text} from 'express';

loadSummaries();

const tabs = document.querySelectorAll('[data-tab-target]');
const tabContents = document.querySelectorAll('[data-tab-content]');
const toggleButton = document.getElementById('toggleButton');
const exitButton = document.getElementById('exitButton');
const tabContainer = document.querySelector('.tab-container');
const loadButtons = document.querySelectorAll(".styled-button");


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
        const summaryContainer = document.getElementById('summaryContainer');
        summaryContainer.innerHTML = '';  // Clear previous content

        // Loop through the summaries and generate buttons for each
        summaries.forEach(summary => {
            const summaryButton = document.createElement('button');
            summaryButton.classList.add('styled-button', 'zen-kaku-gothic-new-regular');
            summaryButton.innerHTML = `
                ${summary.title} 
                <div class="icon-container">
                    <i class="fas fa-volume-up tts-icon" title="Read aloud"></i>
                </div>
            `;
            summaryButton.addEventListener('click', () => {
                const content = { title: summary.title, text: summary.summary };
                loadNewContent(content);
            });

            const ttsIcon = summaryButton.querySelector('.tts-icon');
            ttsIcon.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent parent button from triggering
                readTextAloud(summary.summary); // Call text-to-speech function with summary text
            });
            summaryContainer.appendChild(summaryButton);
        });

    } catch (error) {
        console.error('Error fetching summaries:', error);
    }
}

// Flag to track if TTS is active
let isSpeaking = false;

function readTextAloud(text) {
    if (isSpeaking) {
        // Stop speech if currently speaking
        speechSynthesis.cancel();
        isSpeaking = false;
    } else {
        // Start speech if not currently speaking
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
            isSpeaking = false; // Reset flag when speech ends
        };
        speechSynthesis.speak(utterance);
        isSpeaking = true;
    }
}


// Variables for overlay and buttons
const overlay = document.getElementById("overlay");
const overlayContent = document.getElementById("overlayContent");

// Function to load new content based on button clicked
// function loadNewContent(content) {
//     // Hide main content
//     document.getElementById("mainContent").style.display = "none";
    
//     // Show overlay with slide-down animation
//     overlay.style.display = "flex"; // Make overlay visible
//     setTimeout(() => overlay.classList.add('zoom-in'), 10); // Add class slightly after display change
    
//     // Populate overlay with new content and back button
//     overlayContent.innerHTML = `
//         <h2>${content.title}</h2>
//     `;

//     // Create a scrollable wrapper for the content text
//     const textWrapper = document.createElement('div');
//     textWrapper.style.maxHeight = '300px';  // Adjust max height as needed
//     textWrapper.style.overflowY = 'auto';   // Enable vertical scrolling for content
//     textWrapper.innerHTML = content.text;

//     // Append the scrollable content to the overlay
//     overlayContent.appendChild(textWrapper);

//     // Add a back button with an event listener to return to the main content
//     const backButton = document.createElement('button');
//     backButton.id = 'backButton';
//     backButton.classList.add('styled-button');
//     backButton.textContent = 'Back to Main Content';
//     backButton.addEventListener('click', resetContent);
//     overlayContent.appendChild(backButton);
// }

function loadNewContent(content) {
    // Hide main content
    document.getElementById("mainContent").style.display = "none";
    
    // Show overlay with slide-down animation
    overlay.style.display = "flex"; // Make overlay visible
    setTimeout(() => overlay.classList.add('zoom-in'), 10); // Add class slightly after display change
    
    // Populate overlay with new content
    overlayContent.innerHTML = `
        <h2>${content.title}</h2>
    `;

    // Create a scrollable wrapper for the content text inside a box
    const summaryBox = document.createElement('div');
    summaryBox.classList.add('summary-box'); // Add a class for styling the box
    summaryBox.style.textAlign = 'left';     // Left-align the content within the box
    summaryBox.style.padding = '15px';       // Optional: padding for better spacing
    summaryBox.style.border = '1px solid #ccc'; // Optional: box border for visual separation
    summaryBox.style.borderRadius = '8px';   // Optional: rounded corners

    // Create a scrollable container for the summary text
    const textWrapper = document.createElement('div');
    textWrapper.style.maxHeight = '300px';       // Adjust max height as needed
    textWrapper.style.overflowY = 'auto';        // Enable vertical scrolling for content
    textWrapper.innerHTML = content.text;

    // Append the text to the box and the box to the overlay
    summaryBox.appendChild(textWrapper);
    overlayContent.appendChild(summaryBox);

    // Add a TTS icon container for bottom-right positioning
    const ttsIconContainer = document.createElement('div');
    ttsIconContainer.classList.add('tts-icon-container'); // New container for TTS icon
    const ttsIcon = document.createElement('i');
    ttsIcon.classList.add('fas', 'fa-volume-up', 'tts-icon');
    ttsIcon.title = 'Read aloud';
    ttsIcon.addEventListener('click', () => {
        readTextAloud(textWrapper.textContent); // Use the summary text for TTS
    });
    ttsIconContainer.appendChild(ttsIcon);
    overlayContent.appendChild(ttsIconContainer);

    // Add a back button with an event listener to return to the main content
    const backButton = document.createElement('button');
    backButton.id = 'backButton';
    backButton.classList.add('styled-button');
    backButton.textContent = 'Back to Main Content';
    backButton.addEventListener('click', resetContent);
    overlayContent.appendChild(backButton);
}


// Function to reset content to main view
function resetContent() {
    // Start slide-up animation for overlay
    overlay.classList.remove('zoom-in');
    overlay.classList.add('zoom-out');

    // Delay hiding the overlay to let the animation finish
    setTimeout(() => {
        overlay.style.display = "none";
        overlay.classList.remove('zoom-out'); // Reset class for next time
        document.getElementById("mainContent").style.display = "block";
    }, 500); // Match this to your CSS transition time (0.5s)
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

const editButton = document.getElementById('editButton');
const updateButton = document.getElementById('updateButton');
const cancelButton = document.getElementById('cancelButton');
const editForm = document.querySelector('.edit-form');
const box = document.querySelector('.box'); // Select the main box

// Show the edit form and set a fixed height for the main box when Edit is clicked
editButton.addEventListener('click', function() {
    editForm.style.display = 'block'; // Show the edit form
    // Populate the input fields with current values
    document.getElementById('nameInput').value = document.getElementById('profileName').innerText.replace('Name: ', '');
    document.getElementById('emailInput').value = document.getElementById('profileEmail').innerText.replace('Email: ', '');
    document.getElementById('passwordInput').value = ''; // Clear password input for security
});

// Update profile and reset box height when Update is clicked
updateButton.addEventListener('click', function() {
    const newName = document.getElementById('nameInput').value;
    const newEmail = document.getElementById('emailInput').value;
    const newPassword = document.getElementById('passwordInput').value;

    if (newName) {
        document.getElementById('profileName').innerText = `Name: ${newName}`;
    }
    if (newEmail) {
        document.getElementById('profileEmail').innerText = `Email: ${newEmail}`;
    }
    if (newPassword) {
        document.getElementById('profilePassword').innerText = `Password: ${newPassword}`;
    }

    // Clear input fields and hide the edit form
    editForm.style.display = 'none';
    // box.style.height = 'auto'; // Reset height after update
    document.getElementById('nameInput').value = '';
    document.getElementById('emailInput').value = '';
    document.getElementById('passwordInput').value = '';
});

// Cancel editing and reset box height when Cancel is clicked
cancelButton.addEventListener('click', function() {
    editForm.style.display = 'none'; // Hide the edit form
  
});


function setupSignOut() {
    const signOut = document.getElementById('signOutButton');
    if (signOut) {
        //console.log('Login Button exists!'); // Log message to confirm the button is found
        signOut.addEventListener('click', () => {
            console.log('Sign Out Button');
            // Redirect the user to the backend login route
            window.location.href = 'http://localhost:5000/logout';
        });
    } else {
        console.error('Login button not found!'); // Error message if button is missing
    }
}
setupSignOut();
