const puppeteer = require("puppeteer");

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
  }); // Enable request interception

  try {
    await page.goto("https://www.extrifit.cz/proteiny", {
      waitUntil: "networkidle2",
    });

    const x = 1060;
    const y = 360;
    setTimeout(() => {
      page.mouse.click(x, y);
    }, 3000);

    await page.waitForSelector(".c-item__link", { visible: true });

    await page.waitForSelector(".fa fa-chevron-right", { visible: true });

    const btnnNext = await page.$(".fa fa-chevron-right");

    aw btnnNext.click();
    // const urls = await page.$$eval(".c-item__link", (elements) => {
    //   return elements.map((element) => element.href);
    // });

    for (const url of urls) {
      await page.goto(url);
      await page.waitForSelector("body");
      const vinElement = await page.$(".c-vin-info__vin");
      const priceElement = await page.$(".c-a-basic-info__price");
      const milageElement = await page.$(".c-a-basic-info__subtitle-info");
      const nameElement = await page.$(".c-item-title__name-prefix");
      const suffixElement = await page.$(".c-item-title--suffix");
      const imgElement = await page.$(".ob-c-gallery__img");

      const imgSrc = await (await imgElement.getProperty("src")).jsonValue();

      // Extract the VIN value
      const data = await page.evaluate(
        (
          vinElement,
          priceElement,
          milageElement,
          suffixElement,
          nameElement
        ) => {
          const vin = vinElement ? vinElement.textContent.trim() : "";
          const price = priceElement ? priceElement.textContent.trim() : "";
          const milage = milageElement ? milageElement.textContent.trim() : "";
          const suffix = suffixElement ? suffixElement.textContent.trim() : "";
          const name = nameElement ? nameElement.textContent.trim() : "";
          return { vin, price, milage, name, suffix };
        },
        vinElement,
        priceElement,
        milageElement,
        suffixElement,
        nameElement
      );

      data.imgSrc = imgSrc; // Add imgSrc to the data object

      console.log(data);

      await new Promise((r) => setTimeout(r, 1000));

      await page.goBack(); // Go back to the previous page
    }
    const btnNext = await page.$(".c-paging__btn-next");

    if (btnNext != null) {
      await btnNext.click();
    }
  } catch (error) {
    console.error("Error:", error);
  }
})();
