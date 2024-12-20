import puppeteer from "puppeteer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
type dataType = {
  vin: string | undefined;
  price: string | undefined;
  milage: string | undefined;
  name: string | undefined;
  suffix: string | undefined;
  imgSrc?: string | null;
  url: string;
};

function getNumberAfterSecondComma(input: string): string {
  // Split the input string by commas
  const parts = input.split(",");

  // Check if there are at least 3 parts after splitting
  if (parts.length > 2) {
    // Return the part after the second comma and trim any whitespace
    return parts[2].trim();
  } else {
    // If there aren't enough parts, return an empty string or handle the error as needed
    return "";
  }
}

async function saveDataToPrisma(data: dataType) {
  if (!data.vin || !data.price || !data.milage || !data.name) {
    console.log("Incomplete data, skipping...");
    return;
  }
  const priceValue = parseInt(data.price.replace(/\D/g, ""));
  const mileageValue = parseInt(
    getNumberAfterSecondComma(data.milage).replace(/\D/g, "")
  );

  console.log(priceValue, mileageValue);

  try {
    const existingCar = await prisma.car.findUnique({
      where: { vin: data.vin },
      include: { mileage: true, price: true },
    });

    if (existingCar) {
      // Update the car details

      // Check if the mileage is different
      const latestMileage =
        existingCar.mileage[existingCar.mileage.length - 1]?.value;
      if (latestMileage !== mileageValue) {
        await prisma.mileage.create({
          data: {
            value: mileageValue,
            carId: existingCar.id,
          },
        });
        console.log(`Added new mileage for VIN: ${data.vin}`);
      }

      // Check if the price is different
      const latestPrice =
        existingCar.price[existingCar.price.length - 1]?.value;
      if (latestPrice !== priceValue) {
        await prisma.price.create({
          data: {
            value: priceValue,
            carId: existingCar.id,
          },
        });
        console.log(`Added new price for VIN: ${data.vin}`);
      }
    } else {
      // Create a new car entry if it doesn't exist
      console.log("creating...");
      await prisma.car.create({
        data: {
          vin: data.vin,
          title: data.name,
          suffix: data.suffix || undefined,
          url: data.url,
          image: data.imgSrc as string,
          mileage: {
            create: {
              value: mileageValue,
            },
          },
          price: {
            create: {
              value: priceValue,
            },
          },
        },
      });

      console.log(`Created new car with VIN: ${data.vin}`);
    }
  } catch (error) {
    console.error(`Error saving car with VIN ${data.vin}:`, error);
  }
}

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

    await page.waitForSelector(".c-item__link", { visible: true });

    const urls = await page.$$eval(".c-item__link", (elements: Element[]) => {
      return elements.map((element: any) => element.href);
    });

    for (const url of urls) {
      await page.goto(url);
      await page.waitForSelector("body");

      const vinElement = await page.$(".c-vin-info__vin");
      const priceElement = await page.$(".c-a-basic-info__price");
      const milageElement = await page.$(".c-a-basic-info__subtitle-info");
      const nameElement = await page.$(".c-item-title__name-prefix");
      const suffixElement = await page.$(".c-item-title--suffix");
      const imgElement = await page.$(".ob-c-gallery__img");

      const imgSrc =
        imgElement &&
        ((await (await imgElement.getProperty("src")).jsonValue()) as string);

      const data: dataType = await page.evaluate(
        (
          vinElement: Element | null,
          priceElement: Element | null,
          milageElement: Element | null,
          suffixElement: Element | null,
          nameElement: Element | null,
          url: string
        ) => {
          const vin = vinElement ? vinElement.textContent?.trim() : "";
          const price = priceElement ? priceElement.textContent?.trim() : "";
          const milage = milageElement ? milageElement.textContent?.trim() : "";
          const suffix = suffixElement ? suffixElement.textContent?.trim() : "";
          const name = nameElement ? nameElement.textContent?.trim() : "";
          return { vin, price, milage, name, suffix, url };
        },
        vinElement,
        priceElement,
        milageElement,
        suffixElement,
        nameElement,
        url
      );
      data.imgSrc = imgSrc; // Add imgSrc to the data object

      await saveDataToPrisma(data);
      await new Promise((r) => setTimeout(r, 3000));

      await page.goBack(); // Go back to the previous page
    }

    const btnNext = await page.$(".c-paging__btn-next");

    if (btnNext != null) {
      await btnNext.click();
      await dataScrape(); // Await the recursive call
    }
  }

  try {
    await page.goto("https://www.sauto.cz/inzerce/osobni", {
      waitUntil: "networkidle2",
    });

    const x = 1060;
    const y = 360;

    setTimeout(() => {
      page.mouse.click(x, y);
    }, 5000);

    await dataScrape(); // Ensure the initial call is awaited
  } catch (error) {
    console.error("Error:", error);
  }
})();
