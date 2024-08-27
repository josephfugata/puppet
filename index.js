const express = require("express");
const app = express(); 
const { ms } = require("./msauth");
const { purecloud } = require("./genesysauth");

app.get("/", (req, res) => {
  res.send("Puppeteer server is up and running!");
});

app.get("/ms", (req, res) => {
  ms(res);
});

app.get("/genesys", (req, res) => {
  purecloud(res);
}); 

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
