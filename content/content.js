
function parsePageContent() {


  let data = {}

  const htmlContent = document.documentElement.outerHTML;
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");

 

  const title = doc.querySelector(['h1']);

  console.log(title);

  let jsonObject = {
    'title': title ? title.innerText : null
  };


  const paragraphs = doc.querySelectorAll(['p']);

  

  jsonObject['content'] = Array.from(paragraphs).map(paragraph => ({
    textContent: paragraph.textContent.trim(),

  }));

  // Convert to a JSON string
  let jsonString = JSON.stringify(jsonObject, null, 4);
  console.log(jsonString);

  chrome.runtime.sendMessage({ data: jsonString }, function(response) {
    console.log("Response from background:", response);
  });

  // Output JSON string

}


parsePageContent();

