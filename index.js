PORT = 8000;
const axios = require("axios");
const cherio = require("cherio");
const express = require("express");
const download = require("image-downloader");
const fs = require("fs");
const app = express();
let date = new Date();

//SEM ZADAT URL AKCE
const urls = [
  "https://www.dafit.cz/produkt/akce-1-1-extrifit-rice-oat-mash-900-g-345625/",
  "https://www.dafit.cz/produkt/akce-nutrend-100-whey-protein-1000-g-zdarma-vzorky-364449/",
  "https://www.dafit.cz/produkt/akce-atp-100-pure-whey-protein-2000-g-zdarma-sejkr-dafit-700-ml-364479/",
  "https://www.dafit.cz/produkt/akce-1-1-extrifit-crea-monohydrate-400-g-356069/",
  "https://www.dafit.cz/produkt/akce-extrifit-carni-120000-liquid-1000ml-syne-60tbl-carnifresh-850ml-2x-shot-90ml-364450/",
  "https://www.dafit.cz/produkt/akce-kevin-levrone-levrone-mass-3000-g-zdarma-protein-spread-500-g-2x-tycinka-364451/",
  "https://www.dafit.cz/produkt/akce-extrifit-hardcore-gain-21-3000-g-zdarma-white-force-3000-970-ml-364452/",
  "https://www.dafit.cz/produkt/akce-1-1-atp-nutrition-bcaas-nitro-dma-300-g-362382/",
  "https://www.dafit.cz/produkt/akce-usn-495g-proteinu-diet-fuel-ultralean-9x55g-zdarma-sejkr-750ml-sklenice-500ml-363122/",
  "https://www.dafit.cz/produkt/prom-in-essential-bcaa-synergy-550-g-325248/",
  "https://www.dafit.cz/produkt/akce-1-1-atp-nutrition-tri-creatine-malate-180-tob-364453/",
  "https://www.dafit.cz/produkt/akce-biotech-100-pure-whey-2270-g-zdarma-sejkr-600-ml-4x-vzorek-362381/",
  "https://www.dafit.cz/produkt/akce-nutrend-glutamine-500-g-glutamine-300-g-360874/",
  "https://www.dafit.cz/produkt/czech-virus-supervita-pro-v2-0-winter-500-ml-limitovana-edice-3x-vzorek-supervita-pro-364463/",
  "https://www.dafit.cz/produkt/slozeno-kolagen-240-cps-364325/",
  "https://www.dafit.cz/produkt/akce-prom-in-essential-nitrox-pump-extreme-10-x-15-g-zdarma-2x-vzorek-362704/",
  "https://www.dafit.cz/produkt/akce-prom-in-100-magnesium-bisglycinate-390g-lemon-zdarma-100-zinc-bisglycinate-120tbl-364466/",
  "https://www.dafit.cz/produkt/skull-labs-angel-dust-270-g-344660/",
  "https://www.dafit.cz/produkt/akce-1-1-webber-naturals-kidzown-vitamin-d-600-iu-60-gummies-364460/",
  "https://www.dafit.cz/produkt/biotech-zero-sauce-350-ml-334520/",
  "https://www.dafit.cz/produkt/nutrend-qwizz-35-protein-bar-60-g-348184/",
  "https://www.dafit.cz/produkt/akce-2-1-survival-multivitam-fair-power-60-cps-343478/",
];

var writeLine = (line) => logger.write(`\n${line}`);

var logger = fs.createWriteStream("log.txt", {
  //flags: "a", // 'a' means appending (old data will be preserved)
});

const dirpath =
  "/Users/filipvlk/Desktop/Dafit/Img/" + date.getDate() + date.getMonth();
writeLine(urls.length.toString());

urls.forEach((url) => {
  axios
    .get(url, {
      headers: {
        "Accept-Encoding": "*",
      },
    })
    .then((response) => {
      fs.mkdirSync(dirpath, { recursive: true });

      const html = response.data;
      const $ = cherio.load(html);

      const head = $(".part_ui_heading", ".elm_comp_heading").text();
      writeLine(head); // append string to your file

      const descrip = $(".part_ui_wsw", ".elm_comp_text").text();
      writeLine(descrip);
      const price = $(".part_price", ".elm_comp_basket").text();
      writeLine(price);
      writeLine(url);

      let imgUrl = $(".elm_gallery_image").attr("href");
      imgUrl = "https://www.dafit.cz" + imgUrl;

      download
        .image({
          url: imgUrl,
          dest: dirpath, // will be saved to /path/to/dest/image.jpg
        })
        .then(({ filename }) => {
          console.log("Saved to", filename); // saved to /path/to/dest/image.jpg
        })
        .catch((err) => console.error(err));

      writeLine("");
      writeLine("");
    });
});
app.listen(PORT);
