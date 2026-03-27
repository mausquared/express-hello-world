const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

// This allows your app to parse JSON (required for WhatsApp messages)
app.use(express.json());

// ---------------------------------------------------------
// 1. THIS IS THE VERIFICATION CODE META NEEDS
// ---------------------------------------------------------
app.get("/webhook", (req, res) => {
  // This grabs the verify token from your Render environment variables
  const verify_token = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// ---------------------------------------------------------
// 2. THIS RECEIVES THE ACTUAL WHATSAPP MESSAGES LATER
// ---------------------------------------------------------
app.post("/webhook", (req, res) => {
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// Just a basic home route to let you know the server is on
app.get("/", (req, res) => res.type('html').send("WhatsApp Webhook Server is Live!"));

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
