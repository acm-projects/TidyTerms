const tabs = document.querySelectorAll('[data-tab-target]');
const tabContents = document.querySelectorAll('[data-tab-content]');
tabs.forEach(tab => {
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
    });
});
function setupLoginButtonListener() {
    const login = document.getElementById('loginButton');
    if (login) {
        console.log('Login Button exists!'); // Log message to confirm the button is found
        login.addEventListener('click', () => {
            console.log('Login button clicked! Redirecting...');
            // Redirect the user to the backend login route
            window.location.href = 'http://localhost:5000/login';
        });
    } else {
        console.error('Login button not found!'); // Error message if button is missing
    }
}
setupLoginButtonListener();


// Content and image data
const data = [
    {
        image: "image1.jpg",
        title: "Content Title 1",
        text: "This is the first content section. It describes Image 1."
    },
    {
        image: "image2.jpg",
        title: "Content Title 2",
        text: "This is the second content section. It describes Image 2."
    },
    {
        image: "image3.jpg",
        title: "Content Title 3",
        text: "This is the third content section. It describes Image 3."
    },
    {
        image: "image4.jpg",
        title: "Content Title 4",
        text: "This is the fourth content section. It describes Image 4."
    },
    {
        image: "image5.jpg",
        title: "Content Title 5",
        text: "This is the fifth content section. It describes Image 5."
    }
];

const mainImage = document.getElementById('mainImage');
const mainContentTitle = document.getElementById('mainContentTitle');
const mainContentText = document.getElementById('mainContentText');
const buttons = document.querySelectorAll('.button');

// Function to update content and image with smooth scroll effect
function updateContent(index) {
    // Slide out the current image and content
    mainImage.style.transform = 'translateY(-100%)'; // Move image up
    mainContentTitle.style.transform = 'translateY(100%)'; // Move title down
    mainContentText.style.transform = 'translateY(100%)'; // Move text down

    // Wait for the transition to complete
    setTimeout(() => {
        // Update the image and content
        mainImage.src = data[index].image;
        mainContentTitle.textContent = data[index].title;
        mainContentText.textContent = data[index].text;

        // Reset the transform for new content
        mainImage.style.transform = 'translateY(0)';
        mainContentTitle.style.transform = 'translateY(0)';
        mainContentText.style.transform = 'translateY(0)';

        // // Scroll down to show the new content
        // const scrollToY = window.innerHeight * index; // Calculate scroll position
        // window.scrollTo({
        //     top: scrollToY,
        //     behavior: 'smooth' // Smooth scrolling
        // });
    }, 500); // Match timeout duration with CSS transition duration
}

// Event listener for button images
buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        const index = event.target.dataset.index; // Get the index from the data attribute
        updateContent(index);
    });
});

// Initialize with the first image and content
updateContent(0);


const words = ["Privacy", "Terms", "Data", "Security", "Agreements", "Contracts", "Confidentiality", "Usage", "Consent", "Encryption"]; // Add more words as needed

function getRandomPosition() {
    
    const x = Math.random() * (window.innerWidth - 100); // Random X position
    const y = Math.random() * (window.innerHeight - 50); // Random Y position
    return { x, y };
}

function createWordElement(word) {
    const wordElement = document.createElement('div');
    wordElement.classList.add('word');
    wordElement.textContent = word;

    // Get a random position for the word
    const { x, y } = getRandomPosition();
    wordElement.style.left = `${x}px`;
    wordElement.style.top = `${y}px`;

    document.body.appendChild(wordElement);

    // Remove the word after the animation is done (5s)
    setTimeout(() => {
        wordElement.remove();
    }, 5000);
}

function displayRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    createWordElement(randomWord);
}

// Display words at random intervals
setInterval(displayRandomWord, 1000); // New word every second