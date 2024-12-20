const puppeteer = require("puppeteer");

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

      // Wait for the element to appear in the DOM
      try {
        console.log("Waiting for #reviews-tab...");
        await page.waitForSelector("#reviews-tab", { timeout: 2000 }); // Adjust timeout as needed
        console.log("#reviews-tab found!");
      } catch (err) {
        console.error("Element #reviews-tab not found:", err.message);
        await page.goBack();
        continue; // Call the goback function when the element isn't found
      }
      await page.click("#reviews-tab");

      const selector = "a.SNInextButton";

      // Get the text content of the <span> element

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
          const customerId = review.getAttribute("data-customer-id") || null;
          const authorName =
            review.querySelector('[itemprop="name"]')?.innerText || null;
          const date = review.querySelector("time")?.innerText || null;
          const ratingValue =
            review
              .querySelector('[itemprop="ratingValue"]')
              ?.getAttribute("content") || null;
          const positive =
            review.querySelector(".positive")?.textContent.trim().slice(5) ||
            null;
          const negative =
            review.querySelector(".negative")?.textContent.trim().slice(6) ||
            null;

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
    await page
      .waitForSelector('a[aria-label="Pagination - Další stránka"]')
      .then(async () => {
        await page.click('a[aria-label="Pagination - Další stránka"]');
      });

    await dataScrape();
  }

  try {
    await page.goto("https://www.extrifit.cz/kreatin", {
      waitUntil: "networkidle2",
    });

    const x = 1060;
    const y = 360;

    setTimeout(() => {
      page.mouse.click(x, y);
    }, 5000);

    await dataScrape(); // Ensure the initial call is awaited
    page.close();
  } catch (error) {
    console.error("Error:", error);
  }
})();
