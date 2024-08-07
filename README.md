## simple-chatbot

simple-chatbot is a chatbot widget for ReactJs applications.

## Test the package locally

- Pull the project and run `npm link` to link it locally for testing.
- Open another react js project and run `npm link simple-chatbot` to link the package to your project locally

## Add the widget to project as component

- After linking it to your project you can add the widget in the root file of your project like this:
  Import statement `import Chatbot from "simple-chatbot";`
  Add the widget inside at the top level of your application like this: `<Chatbot keypass="valid-key" />`

## Add the widget to project as script tag

- To test locally as script tag run `serve .` on the root of the package
- Then on your project's index.html file inside the <head> tag add these script tags
  `<script src="https://unpkg.com/react/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
    <script src="here-copy-the-path-you-are-serving-the-dist/dist/index.js"></script>
    <script type="text/JavaScript">
      document.addEventListener("DOMContentLoaded", function () {
        window.injectChatbot({
          keypass: "valid-key",
        });
      });
    </script>`
- After package is published we can use it like this:
  `<script src="https://unpkg.com/react/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
    <script src="public-url/dist/index.js"></script>
    <script type="text/JavaScript">
      document.addEventListener("DOMContentLoaded", function () {
        window.injectChatbot({
          keypass: "valid-key",
        });
      });
    </script>`

## Make changes to the package

- After any changes made to the package run the build and the build-script scripts to see the changes in the imported project
