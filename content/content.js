



function parsePageContent() {


  let data = {}

  const htmlContent = document.documentElement.outerHTML;
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");


  const paragraphs = doc.querySelectorAll(['p', 'h1']);

  let jsonObject = Array.from(paragraphs).map(paragraph => ({
    id: paragraph.getAttribute('data-id'),
    textContent: paragraph.textContent.trim(),

  }));

  // Convert to a JSON string
  let jsonString = JSON.stringify(jsonObject, null, 4);

  chrome.runtime.sendMessage({ data: jsonString }, function(response) {
    console.log("Response from background:", response);
  });

  // Output JSON string

}


parsePageContent();
