const puppeteer = require("puppeteer");
const fs = require("fs");
const data = [];

(async () => {
  const browser = await puppeteer.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: false,
    args: ["--netifs-to-ignore=INTERFACE_TO_IGNORE"],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1710,
    height: 1000,
    deviceScaleFactor: 1,
  });

  async function dataScrape() {
    while (true) {
      await new Promise((r) => setTimeout(r, 2000)); // Proper delay

      const urls = await page.$$eval(
        ".ahron--products-image-wrapper ",
        (elements) => {
          return elements.map((element) => element.getAttribute("data-href"));
        }
      );

      for (const url of urls) {
        await page.goto("https://www.extrifit.cz" + url);
        await page.waitForSelector("body");
        await new Promise((r) => setTimeout(r, 1000));
        const product = {
          reviews: [],
          code: "",
          ratingValue: "",
          ratingCount: "",
        };
        let loop = true;

        product.code = await page.$eval(
          ".pd-desc-info .font-size-sm:last-child",
          (el) => el.textContent
        );

        const { ratingValue, ratingCount } = await page.evaluate(() => {
          const ratingValue = document
            .querySelector('meta[itemprop="ratingValue"]')
            ?.getAttribute("content");
          const ratingCount = document
            .querySelector('span[itemprop="ratingCount"]')
            ?.textContent.trim();

          return { ratingValue, ratingCount };
        });

        product.ratingCount = ratingCount;
        product.ratingValue = ratingValue;
        // Wait for the element to appear in the DOM
        try {
          console.log("Waiting for #reviews-tab...");
          await page.waitForSelector("#reviews-tab", { timeout: 2000 }); // Adjust timeout as needed
          console.log("#reviews-tab found!");
        } catch (err) {
          data.push(product);
          console.error("Element #reviews-tab not found:", err.message);
          await page.goBack();
          continue; // Call the goback function when the element isn't found
        }
        await page.click("#reviews-tab");

        const selector = "a.SNInextButton";

        // Get the text content of the <span> element

        try {
          while (loop) {
            console.log("Waiting for the button to become visible...");
            const isVisible = await page
              .waitForSelector(selector, { visible: true, timeout: 2000 })
              .then(() => true)
              .catch(() => false); // Handle timeout if the button isn't found

            if (!isVisible) {
              console.log("Button not visible for 2 seconds. Exiting loop.");
              loop = false; // Exit the loop if the button isn't visible
              break;
            }

            console.log("Button is visible. Clicking...");
            await page.click(selector);
            await new Promise((r) => setTimeout(r, 1000));
          }
        } catch (err) {
          console.error("Error or element no longer found:", err.message);
        }

        const reviewsSelector = ".SNIcontainer .SNIitem";

        const reviews = await page.$$eval(reviewsSelector, (reviewElements) => {
          return reviewElements.map((review) => {
            const customerId =
              review.getAttribute("data-customer-id") || undefined;
            const authorName =
              review.querySelector('[itemprop="name"]')?.innerText || undefined;
            const date = review.querySelector("time")?.innerText || undefined;
            const ratingValue =
              review
                .querySelector('[itemprop="ratingValue"]')
                ?.getAttribute("content") || undefined;
            const positive =
              review.querySelector(".positive")?.textContent.trim().slice(5) ||
              undefined;
            const negative =
              review.querySelector(".negative")?.textContent.trim().slice(6) ||
              undefined;

            return {
              customerId,
              authorName,
              date,
              ratingValue,
              positive,
              negative,
            };
          });
        });

        product.reviews = reviews;

        data.push(product);
        await page.goBack();
      }

      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      const hasNextPage = await page
        .waitForSelector('a[aria-label="Pagination - Další stránka"]', {
          timeout: 2000,
        })
        .then(() => true)
        .catch(() => false);

      if (!hasNextPage) {
        console.log("No more pages. Exiting...");
        break;
      }

      await page.click('a[aria-label="Pagination - Další stránka"]');
    }
  }

  try {
    await page.goto("https://www.extrifit.cz/sejkry-a-lahve-extrifit", {
      waitUntil: "networkidle2",
    });

    const x = 1060;
    const y = 360;

    setTimeout(() => {
      page.mouse.click(x, y);
    }, 5000);

    await dataScrape();
    console.log(data);
    await page.close();
    saveToJsonFile();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
})();

// Function to save data array to a JSON file
function saveToJsonFile() {
  const filePath = "shaker.json";
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Data saved to ${filePath}`);
}
