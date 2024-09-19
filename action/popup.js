const button = document.getElementById("button")

button.onclick = function() {
    chrome.runtime.sendMessage('this is a test message')

}