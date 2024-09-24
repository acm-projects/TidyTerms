
document.getElementById('button').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: parsePageContent
      });
    });
  });
  
  function parsePageContent() {


    let data = {}

    const htmlContent = document.documentElement.outerHTML;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");


    const paragraphs = doc.querySelectorAll(['p', 'h1']);

    let jsonObject = Array.from(paragraphs).map(paragraph => ({
      textContent: paragraph.textContent,

    }));

    // Convert to a JSON string
    let jsonString = JSON.stringify(jsonObject, null, 4);

    // Output JSON string
    console.log(jsonString);



  }
  