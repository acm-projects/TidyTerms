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