const puppeteer = require("puppeteer");
require("dotenv").config();

const genesysRefresh = async (res) => {
    async function logFirstAuthHeader() {
        return new Promise(async (resolve, reject) => {
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
            const page = await browser.newPage();
            await page.setRequestInterception(true);

            page.on("request", async (request) => {
                const authHeader = request.headers()["authorization"];
                if (authHeader) {
                    await browser.close();
                    resolve({ authHeader });
                }
                request.continue();
            });

            try {
                await page.goto(
                    `https://apps.mypurecloud.com.au/directory/#/person/${process.env.id}`
                );
                await page.setViewport({ width: 1080, height: 1024 });
                await page.locator("#email").fill(process.env.user);
                await page.locator("#password").fill(process.env.pass);
                await page.locator('button[type="submit"]').click();

                // Set a timeout in case the auth header is never found
                setTimeout(() => {
                    browser.close();
                    reject(new Error("Timeout: Authorization header not found"));
                }, 30000); // 30 seconds timeout
            } catch (error) {
                await browser.close();
                reject(error);
            }
        });
    }

    try {
        const result = await logFirstAuthHeader();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.send(`result: ${error}`);
        return { error: error.message };
    }
};

module.exports = { genesysRefresh };
