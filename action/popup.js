const tabs = document.querySelectorAll('.tab');
const contentDiv = document.getElementById('content');
//const chatBox = document.getElementById('chatBox');

function loadContent(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Network response is not okay.');
            return response.text();
        })
        .then(data => {
          console.log('content is loaded!'); 
            contentDiv.innerHTML = data;
        })
        .catch(err => {
            contentDiv.innerHTML = `<p>Error loading the content: ${err.message}</p>`;
        });
}



tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');


        loadContent(tab.getAttribute('data-target'));
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
