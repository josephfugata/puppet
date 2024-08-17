const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res) => {
    const browser = await puppeteer.launch({
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

        await page.goto(`https://apps.mypurecloud.com.au/directory/#/person/${process.env.id}`);
        await page.locator('#email').fill(process.env.user);
        await page.locator('#password').fill(process.env.pass);
        await page.locator('button[type='submit']').click('button[type='submit']');
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        res.send('The is genesysRefresh file');

    } catch (e) {
        console.error(e);
        res.send(`Something went wrong while running Puppeteer: ${e}`);
    } finally {
        await browser.close();
    }
};

module.exports = { scrapeLogic };
