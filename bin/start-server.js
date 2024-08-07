#!/usr/bin/env node
const { exec } = require("child_process");
const path = require("path");

const serverPath = path.resolve(__dirname, "../server.js");
console.log(`Starting server at ${serverPath}`);

const child = exec(`node ${serverPath}`);

child.stdout.on("data", (data) => {
  console.log(`Server stdout: ${data}`);
});

child.stderr.on("data", (data) => {
  console.error(`Server stderr: ${data}`);
});

child.on("close", (code) => {
  console.log(`Server process exited with code ${code}`);
});
