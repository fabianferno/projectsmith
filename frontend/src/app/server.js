const express = require("express");
// Cors will allow our browser to interact with our command line.
const cors = require("cors");
const path = require("path");
const fs = require("fs");
// Here we are importing our cli wrapper we just created
const { runCliCommand } = require("./pages/api/cliWrapper");
// Create an instance of Express to set up the server
const app = express();
// Define the port number on which the server will listen
const port = 3001;

// Enable CORS middleware to handle cross-origin requests
app.use(cors());
// Use express.json middleware to parse JSON requests
app.use(express.json());
// Use express.urlencoded middleware to handle URL-encoded data (useful for form submissions)
app.use(express.urlencoded({ extended: true }));

// Here we will serve images from the directory Lilypad saves files to/
app.use("/images", express.static("/tmp/lilypad/data/downloaded-files"));

// When a user submits their prompt, this will run our CLI Wrapper with their prompt.
app.post("/api/cliWrapper", (req, res) => {
  // Grab the user's input
  const userInput = req.body.userInput;
  // Run our CLI Wrapper with their input
  runCliCommand(userInput, (error, filePath, cid) => {
    if (error) {
      return res.status(500).send("Error processing command");
    }
    // Convert file path to URL
    console.log(filePath);
    const filePath1 = path.join(
      "/tmp/lilypad/data/downloaded-files",
      cid,
      "outputs",
      "response.json"
    );

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // File not found, return 404
        res.status(404).send("File not found");
        return;
      }

      // Read and serve the JSON file
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          // Error reading the file, return 500
          res.status(500).send("Error reading the file");
          return;
        }
        // Parse JSON and send it as response
        const jsonData = JSON.parse(data);
        res.json(jsonData);
      });
    });
  });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
