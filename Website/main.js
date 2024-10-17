const tabs = document.querySelectorAll('[data-tab-target]')
const tabContents = document.querySelectorAll('[data-tab-content]')
tabs.forEach(tab => {
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
    })
})


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
