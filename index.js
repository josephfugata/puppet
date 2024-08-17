const express = require("express");
const app = express();
const { scrapeLogic } = require("./scrapeLogic");
const { genesysRefresh } = require("./genesysRefresh");

app.get("/scrape", (req, res) => {
  scrapeLogic(res);
});

app.get("/genesys", (req, res) => {
  genesysRefresh(res);
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
