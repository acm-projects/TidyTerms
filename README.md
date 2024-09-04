<p align="center">
  <img src="download.jpg" alt="Cleaning Panda">
</p>

<h1 align="center">🧹 TidyTerms</h1>

### <p align="center">❓ Problem Statement:</p>
<p align="center">
Users often struggle to understand lengthy and complex terms and conditions documents, leading to uninformed decisions and potential legal pitfalls. TidyTerms is a Chrome extension designed to simplify the process of understanding terms and conditions. The extension scans lengthy legal documents and provides concise, easy-to-understand highlights, helping users quickly grasp important points such as privacy policies, data usage, cancellation terms, and hidden fees. By leveraging OpenAI's GPT for AI-driven analysis, TidyTerms provides accurate and meaningful summaries, empowering users with clear and actionable information to foster informed decision-making and protect consumer rights. TidyTerms helps users understand complex legal documents quickly, enabling them to make informed decisions and avoid potential legal issues.
</p>

## 🛠️ Minimum Viable Product (MVP) Features

- **Document Scanning:**
  - Ability to scan terms and conditions documents directly from web pages.
  
- **Key Highlights Extraction:**
  - AI-driven analysis using OpenAI's GPT to extract and summarize key points, such as privacy policies, data sharing practices, and cancellation terms.
  
- **User-Friendly Summary:**
  - Easy-to-read summaries that break down complex legal language into understandable bullet points.
  
- **Search Functionality:**
  - Allows users to search for specific terms or clauses within the document.
  
- **Save & Share:**
  - Options to save the summaries and share them via email or social media.


## 🚀 Stretch Goals

- **Custom Alerts:**
  - Notifications for users when significant changes are detected in the terms and conditions of services they use.
  
- **Legal Jargon Glossary:**
  - In-app glossary to explain common legal terms and jargon.
  
- **Comparison Feature:**
  - Compare terms and conditions across different services to help users make informed choices.
  
- **Interactive Tutorials:**
  - Guides and tutorials on understanding common clauses and their implications.
  
- **Integration with E-Signature Services:**
  - Direct integration with e-signature platforms to provide highlights before signing documents.


## 📅 Milestones

| Week      | Tasks                                                                                                                                             |
|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| **Week One: Setup** | - Team Organization: Define roles and responsibilities.<br> - Version Control: Set up a Git repository.<br> - Environment Setup: Initialize your project with Node.js, React, and Express.<br> - Design Prototypes: Create UI designs using Figma. |
| **Week Two: Finish Prototyping and Initial Setup** | - Figma Designs: Finalize design prototypes.<br> **Backend:**<br> - Set up the Express server.<br> - Implement registration and login functionality.<br> **Frontend:**<br> - Set up the Chrome extension manifest.<br> - Implement the registration and login pages using React.<br> - Create a basic popup UI. |
| **Week Three: Core Feature Development** | **Backend:**<br> - Develop AI-driven key highlights extraction using OpenAI's GPT.<br> - Set up endpoints to process document scans.<br> **Frontend:**<br> - Implement document scanning functionality.<br> - Create the key highlights extraction page. |
| **Week Four: User-Friendly Summary and Profile Page** | **Backend:**<br> - Develop user-friendly summary generation.<br> **Frontend:**<br> - Implement the summary page.<br> - Implement the profile page. |
| **Week Five: Search Functionality and Save & Share** | **Backend:**<br> - Develop search functionality and save/share options.<br> **Frontend:**<br> - Implement search functionality.<br> - Implement save/share options. |
| **Week Six: Custom Alerts and Comparison Feature** | **Backend:**<br> - Develop custom alerts for significant changes in terms.<br> - Implement comparison feature.<br> **Frontend:**<br> - Integrate custom alerts.<br> - Implement the comparison feature. |
| **Week Seven: Integration and Testing** | - Integration: Integrate frontend with backend services.<br> - Testing: Conduct end-to-end testing.<br> - Fix bugs and ensure seamless functionality. |
| **Week Eight: Last Minute Work** | - Address any remaining issues or refinements.<br> - Finalize all features.<br> - Prepare the project for presentation. |
| **Week Nine: Presentation Preparation** | - Develop presentation materials.<br> - Rehearse presentations.<br> - Refine presentation based on feedback. |
| **Week Ten: Presentations** | - Finalize presentation.<br> - Present the project to stakeholders or in a public setting. |


## 💻 Tech Stack

<details>
  <summary><strong>HTML:</strong> For creating the popup UI.</summary>
  <ul>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML">Official Documentation: MDN Web Docs: HTML</a></li>
    <li><a href="https://www.w3schools.com/html/">Beginner's Guide: HTML for Beginners</a></li>
    <li><a href="https://www.youtube.com/watch?v=pQN-pnXPaVg">YouTube Tutorial: HTML Full Course - Build a Website Tutorial</a></li>
  </ul>
</details>

<details>
  <summary><strong>CSS:</strong> For styling the popup UI.</summary>
  <ul>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS">Official Documentation: MDN Web Docs: CSS</a></li>
    <li><a href="https://www.w3schools.com/css/">Beginner's Guide: CSS for Beginners</a></li>
    <li><a href="https://www.youtube.com/watch?v=yfoY53QXEnI">YouTube Tutorial: CSS Crash Course</a></li>
  </ul>
</details>

<details>
  <summary><strong>JavaScript:</strong> For the logic of the extension.</summary>
  <ul>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">Official Documentation: MDN Web Docs: JavaScript</a></li>
    <li><a href="https://www.w3schools.com/js/">Beginner's Guide: JavaScript for Beginners</a></li>
    <li><a href="https://www.youtube.com/watch?v=PkZNo7MFNFg">YouTube Tutorial: JavaScript Full Course</a></li>
  </ul>
</details>

<details>
  <summary><strong>JSON:</strong> For the manifest file.</summary>
  <ul>
    <li><a href="https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON">Official Documentation: MDN Web Docs: JSON</a></li>
    <li><a href="https://www.w3schools.com/js/js_json_intro.asp">Beginner's Guide: JSON Introduction</a></li>
    <li><a href="https://www.youtube.com/watch?v=iiADhChRriM">YouTube Tutorial: JSON Tutorial for Beginners</a></li>
  </ul>
</details>

<details>
  <summary><strong>OpenAI API:</strong> For AI text analysis and summarization.</summary>
  <ul>
    <li><a href="https://beta.openai.com/docs/">Official Documentation: OpenAI API Documentation</a></li>
    <li><a href="https://beta.openai.com/docs/quickstart">Getting Started Guide: Quickstart Tutorial</a></li>
    <li><a href="https://www.youtube.com/watch?v=fDLjsWCcKvQ">YouTube Tutorial: Using OpenAI API</a></li>
    <li><a href="https://beta.openai.com/examples">Example Projects: OpenAI API Examples</a></li>
  </ul>
</details>

  
## 🚧 Roadblocks and Possible Solutions

- **⚠️ Roadblock:** Ensuring AI-driven analysis accurately summarizes key points.
- **💡 Solution:** Utilize robust machine learning models and continuously train them with a diverse dataset of legal documents.


## 🛠️ Required Tools

<details>
  <summary><strong>IDE:</strong> Visual Studio Code</summary>
  <ul>
    <li><a href="https://code.visualstudio.com/docs">Official Documentation: Visual Studio Code Documentation</a></li>
    <li><a href="https://code.visualstudio.com/docs/introvideos/basics">Beginner's Guide: Getting Started with Visual Studio Code</a></li>
    <li><a href="https://www.youtube.com/watch?v=WPqXP_kLzpo">YouTube Tutorial: Visual Studio Code Crash Course</a></li>
    <li><a href="https://code.visualstudio.com/docs/editor/extension-marketplace">Extensions Guide: Top Visual Studio Code Extensions</a></li>
  </ul>
</details>

<details>
  <summary><strong>Design:</strong> Figma</summary>
  <ul>
    <li><a href="https://help.figma.com/hc/en-us">Official Documentation: Figma Help Center</a></li>
    <li><a href="https://figma101.com/">Beginner's Guide: Figma 101: Introduction to Figma</a></li>
    <li><a href="https://www.youtube.com/watch?v=9Gf5iVyzTKI">YouTube Tutorial: Figma Tutorial for Beginners</a></li>
    <li><a href="https://www.figma.com/design-systems/">Design System Guide: Creating a Design System in Figma</a></li>
  </ul>
</details>

<details>
  <summary><strong>Version Control:</strong> Git</summary>
  <ul>
    <li><a href="https://git-scm.com/doc">Official Documentation: Git Documentation</a></li>
    <li><a href="https://rogerdudler.github.io/git-guide/">Beginner's Guide: Git - The Simple Guide</a></li>
    <li><a href="https://www.youtube.com/watch?v=RGOj5yH7evk">YouTube Tutorial: Git and GitHub for Beginners</a></li>
  </ul>
</details>

<details>
  <summary><strong>API:</strong> OpenAI API for GPT-based text summarization</summary>
  <ul>
    <li><a href="https://beta.openai.com/docs/">Official Documentation: OpenAI API Documentation</a></li>
    <li><a href="https://beta.openai.com/docs/quickstart">Getting Started Guide: Quickstart Tutorial</a></li>
    <li><a href="https://www.youtube.com/watch?v=fDLjsWCcKvQ">YouTube Tutorial: Using OpenAI API</a></li>
    <li><a href="https://beta.openai.com/examples">Example Projects: OpenAI API Examples</a></li>
  </ul>
</details>

<details>
  <summary><strong>Cloud:</strong> Any cloud service for hosting (e.g., Heroku, AWS, DigitalOcean)</summary>
  <ul>
    <li><strong>Heroku:</strong>
      <ul>
        <li><a href="https://devcenter.heroku.com/">Official Documentation: Heroku Dev Center</a></li>
        <li><a href="https://devcenter.heroku.com/start">Beginner's Guide: Getting Started on Heroku</a></li>
        <li><a href="https://www.youtube.com/watch?v=ZKbmrF4Ync0">YouTube Tutorial: Deploying Applications with Heroku</a></li>
        <li><a href="https://devcenter.heroku.com/articles/heroku-cli">Heroku CLI Guide: Heroku CLI Documentation</a></li>
      </ul>
    </li>
    <li><strong>AWS:</strong>
      <ul>
        <li><a href="https://aws.amazon.com/documentation/">Official Documentation: AWS Documentation</a></li>
        <li><a href="https://aws.amazon.com/getting-started/">Beginner's Guide: Getting Started with AWS</a></li>
        <li><a href="https://www.youtube.com/watch?v=Ia-UEYYR44s">YouTube Tutorial: AWS Full Course - Learn Cloud Computing</a></li>
        <li><a href="https://aws.amazon.com/free/">AWS Free Tier Guide: Using the AWS Free Tier</a></li>
      </ul>
    </li>
    <li><strong>DigitalOcean:</strong>
      <ul>
        <li><a href="https://docs.digitalocean.com/">Official Documentation: DigitalOcean Documentation</a></li>
        <li><a href="https://www.digitalocean.com/docs/getting-started/">Beginner's Guide: Getting Started with DigitalOcean</a></li>
        <li><a href="https://www.youtube.com/watch?v=lwh1vFcCkFY">YouTube Tutorial: Deploy a Web App on DigitalOcean</a></li>
        <li><a href="https://www.digitalocean.com/docs/droplets/">Droplet Management Guide: Droplets Documentation</a></li>
      </ul>
    </li>
  </ul>
</details>


## 🏆 Competition

- **Terms of Service; Didn't Read (ToS;DR):**
  - Provides crowdsourced summaries and ratings of terms and conditions.
  
- **Guard:**
  - An AI-driven app that analyzes and highlights key points in terms and conditions and privacy policies.
  
- **Clausehound:**
  - Offers legal document analysis and summary, primarily for businesses.
  
- **Legalese Decoder:**
  - Translates legal jargon into plain language.


## 🔧 Miscellaneous

### Building a Chrome Extension YouTube Videos:
- **Basic Setup:** [Building and Publishing a Chrome Extension in 10 minutes](https://www.youtube.com/watch?v=pkY7anV5Whk)
- **Beginners Course:** [Build a Chrome Extension](https://www.youtube.com/watch?v=qubIt5p2t04)
- **Step-by-Step:** [Building a Chrome extension steps](https://www.youtube.com/watch?v=hfWkBzOKe3g)
- **Techstack Chrome Extension:** [Chrome Extension with JS and HTML](https://www.youtube.com/watch?v=qG4VEYJ7Nro)
- **Open AI + Chrome Extension:** [Integrating the two together](https://www.youtube.com/watch?v=3JXV_8GctDQ)
- **Text Summarizer:** [Example of an open AI + Chrome extension that summarizes](https://www.youtube.com/watch?v=RZBkKt7mzx4)

### Git Commands

| Command                        | What it does                                |
|--------------------------------|---------------------------------------------|
| `git branch`                   | Lists all the branches                      |
| `git branch "branch name"`     | Creates a new branch                        |
| `git checkout "branch name"`   | Switches to the specified branch            |
| `git checkout -b "branch name"`| Combines branch creation and checkout       |
| `git add .`                    | Stages all changed files                    |
| `git commit -m "Testing123"`   | Commits with a message                      |
| `git push origin "branch"`     | Pushes to the specified branch              |
| `git pull origin "branch"`     | Pulls updates from the specified branch     |


## 🧑‍⚖️ The Court

- **Judge** (Project Manager): Shreya S Ramani
- **Jury** (Industry Mentor):
- **Lawyer 1**: Vivian Nguyen
- **Lawyer 2**: Atreya Ghosh
- **Lawyer 3**: Srinitya Chirravuri
- **Lawyer 4**: Arshia Puri
