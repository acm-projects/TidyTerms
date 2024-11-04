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
        image: "ShreyaPicture.jpg",
        title: "Shreya Ramani",
        text: "My name is Shreya and I am currently a junior majoring in Computer Science with a minor in finance. I'm the Project Manager for Tidy Terms."
    },
    {
        image: "NityaPicture.jpg",
        title: "Nitya Chirravuri",
        text: "My name is Nitya and I am currently a freshman majoring in Computer Science. I'm one of the frontend developers for Tidy Terms."
    },
    {
        image: "VivianPicture.jpg",
        title: "Vivian Nguyen",
        text: "My name is Vivian and I am currently a sophmore majoring in Computer Science. I'm one of the frontend developers for Tidy Terms."
    },
    {
        image: "ArshiaPicture.jpg",
        title: "Arshia Puri",
        text: "My name is Arshia and I am currently a sophmore majoring in Computer Science. I'm one of the backend developers for Tidy Terms."
    },
    {
        image: "AtreyaPicture.jpg",
        title: "Atreya Ghosh",
        text: "My name is Atreya and I am currently a sophmore majoring in Computer Science. I'm one of the backend developers for Tidy Terms."
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


const words = ["Privacy", "Information", "Security", "Agreements", "Contracts", "Confidentiality", "Usage", "Consent", "Encryption", "Permissions", "Policies", "Disclosure", "Anonymity", "Rights", "Regulations", "Transparency", "Ownership"]; // Add more words as needed

function getRandomPosition() {
    const x = Math.random() * (window.innerWidth - 100); // Random X position
    const y = 25 + Math.random() * (window.innerHeight - 150); // Random Y position
    return { x, y };
}

function typeAndErase(word, element) {
    let index = 0;
    let typing = true;
    
    function type() {
        if (typing) {
            if (index < word.length) {
                element.textContent += word[index];
                index++;
                setTimeout(type, 200); // Typing speed
            } else {
                typing = false;
                setTimeout(type, 1000); // Pause before erasing
            }
        } else {
            if (index > 0) {
                element.textContent = element.textContent.slice(0, -1);
                index--;
                setTimeout(type, 100); // Erasing speed
            } else {
                element.remove(); // Remove the word element after erasing
            }
        }
    }
    
    type();
}

function createWordElement(word) {
    const wordElement = document.createElement('div');
    wordElement.classList.add('word');
    
    // Get a random position for the word
    const { x, y } = getRandomPosition();
    wordElement.style.position = 'absolute';
    wordElement.style.left = `${x}px`;
    wordElement.style.top = `${y}px`;
    
    document.body.appendChild(wordElement);
    
    // Start typing and erasing effect
    typeAndErase(word, wordElement);
}

function displayRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    createWordElement(randomWord);
}

// Display words at random intervals
setInterval(displayRandomWord, 800);

// const words = ["Privacy", "Terms", "Data", "Security", "Agreements", "Contracts", "Confidentiality", "Usage", "Consent", "Encryption"]; // Add more words as needed

// function getRandomPosition() {
//     const x = Math.random() * (window.innerWidth - 100); // Random X position
//     const y = 75 + Math.random() * (window.innerHeight - 125); // Random Y position (adjusted for margin)
//     return { x, y };
// }

// function typeWord(word, wordElement) {
//     let currentCharIndex = 0;

//     function type() {
//         if (currentCharIndex < word.length) {
//             wordElement.textContent += word.charAt(currentCharIndex);
//             currentCharIndex++;
//             setTimeout(type, 150); // Typing speed
//         } else {
//             setTimeout(untype, 1000); // Pause before untyping
//         }
//     }

//     function untype() {
//         if (currentCharIndex > 0) {
//             wordElement.textContent = wordElement.textContent.slice(0, -1);
//             currentCharIndex--;
//             setTimeout(untype, 150); // Un-typing speed
//         } else {
//             wordElement.remove(); // Remove the element when done
//         }
//     }

//     type(); // Start typing
// }

// function createWordElement(word) {
//     const wordElement = document.createElement('div');
//     wordElement.classList.add('word');

//     // Get a random position for the word
//     const { x, y } = getRandomPosition();
//     wordElement.style.left = `${x}px`;
//     wordElement.style.top = `${y}px`;

//     document.body.appendChild(wordElement);

//     // Call the typing function with the word and word element
//     typeWord(word, wordElement);
// }

// // Display words at random intervals
// setInterval(displayRandomWord, 2000); // New word every 2 seconds