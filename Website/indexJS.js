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










