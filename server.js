const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const { Readable } = require("stream");

console.log("Loading environment variables");
dotenv.config();

console.log("Creating Express app");
const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
console.log("Enabling CORS");
app.use(cors());

console.log("Setting up body parser");
app.use(bodyParser.json());

console.log("Setting up route");
app.post("/api/chat-completion", async (req, res) => {
  console.log("Received request at /api/chat-completion");
  const { messages } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages,
        stream: true,
      }),
    });

    if (!response.body) throw new Error("No response body");

    // Stream the response back to the client
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const readableStream = new Readable({
      read() {
        reader
          .read()
          .then(({ done, value }) => {
            if (done) {
              this.push(null);
              return;
            }
            const chunk = decoder.decode(value);
            console.log(chunk);
            this.push(chunk);
          })
          .catch((err) => {
            console.error("Error reading stream:", err);
            this.push(null);
          });
      },
    });

    readableStream.pipe(res);
  } catch (error) {
    console.error("Error fetching chat completion:", error);
    res.status(500).json({ error: "Error processing request" });
  }
});

console.log("Starting server");
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
