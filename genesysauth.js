const axios = require("axios");
const puppeteer = require("puppeteer");
require("dotenv").config();

const purecloud = async (res) => {
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
    await page.setRequestInterception(true);

    const authPromise = new Promise((resolve) => {
      page.on("request", (request) => {
        const authHeader = request.headers()["authorization"];
        if (authHeader) {
          resolve(authHeader);
          browser.close();
        } else {
          request.continue();
        }
      });
    });

    await page.goto(
      `https://apps.mypurecloud.com.au/directory/#/person/${process.env.id}`
    );
    await page.waitForSelector("#email");
    await page.type("#email", process.env.user);
    await page.type("#password", process.env.pass);
    await page.click('button[type="submit"]');

    const authHeader = await Promise.race([
      authPromise,
      new Promise((_, reject) =>
        setTimeout(() => {
          browser.close();
          reject(new Error("Timeout: Authorization header not found"));
        }, 30000)
      ),
    ]);

    const { data } = await axios.patch(
      process.env.db,
      { Bearer: authHeader },
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

module.exports = { purecloud };
