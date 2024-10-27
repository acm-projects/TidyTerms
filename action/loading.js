chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getLoadingData") {
        const letters = document.querySelectorAll('.letter');
        const loadingMessages = document.querySelectorAll('.loading-message');

        sendResponse({
            lettersCount: letters.length,
            loadingMessagesCount: loadingMessages.length
        });
    }
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

