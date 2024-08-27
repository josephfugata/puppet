const axios = require("axios");
const puppeteer = require("puppeteer");
const { setTimeout } = require("timers/promises");
require("dotenv").config();

const ms = async (res) => {
  const browser = await puppeteer.launch({
    // headless: false,
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  try {
    const page = await browser.newPage();
    await page.goto(
      "https://developer.microsoft.com/en-us/graph/graph-explorer"
    );
    await page.waitForSelector('button[aria-label="Sign in"]');
    await page.click('button[aria-label="Sign in"]');
    const popup = (await browser.pages()).pop();
    await popup.waitForNetworkIdle(0);
    await popup.bringToFront();
    await popup.waitForSelector("#i0116");
    await popup.type("#i0116", process.env.msuser);
    await popup.click("#idSIButton9");
    await popup.waitForSelector("#idA_PWD_ForgotPassword");
    await popup.type("#i0118", process.env.mspass);
    await popup.click("#idSIButton9");
    await popup.waitForSelector("#KmsiCheckboxField");
    await popup.click("#idSIButton9");
    await page.bringToFront();
    await page.waitForNetworkIdle();
    await page.waitForSelector(".ms-Image-image.is-loaded.ms-Image-image");
    await page.click("#Pivot58-Tab3");
    const token = await page.$eval(
      "#access-tokens-tab",
      (element) => element.textContent
    );

    await browser.close();

    const { data } = await axios.patch(
      process.env.msauth,
      { msauth: token },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log(data);
    res.send("Successfully updated DB");
  } catch (error) {
    console.error(error);
    res.send(`Result: ${error.message}`);
  }
};

module.exports = { ms };
