var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var puppeteer = require("puppeteer");
(function () { return __awaiter(_this, void 0, void 0, function () {
    function dataScrape() {
        return __awaiter(this, void 0, void 0, function () {
            var urls, _i, urls_1, url, vinElement, priceElement, milageElement, nameElement, suffixElement, imgElement, imgSrc, data, btnNext;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 2000); })];
                    case 1:
                        _a.sent(); // Proper delay
                        return [4 /*yield*/, page.waitForSelector(".c-item__link", { visible: true })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.$$eval(".c-item__link", function (elements) {
                                return elements.map(function (element) { return element.href; });
                            })];
                    case 3:
                        urls = _a.sent();
                        _i = 0, urls_1 = urls;
                        _a.label = 4;
                    case 4:
                        if (!(_i < urls_1.length)) return [3 /*break*/, 19];
                        url = urls_1[_i];
                        return [4 /*yield*/, page.goto(url)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector("body")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, page.$(".c-vin-info__vin")];
                    case 7:
                        vinElement = _a.sent();
                        return [4 /*yield*/, page.$(".c-a-basic-info__price")];
                    case 8:
                        priceElement = _a.sent();
                        return [4 /*yield*/, page.$(".c-a-basic-info__subtitle-info")];
                    case 9:
                        milageElement = _a.sent();
                        return [4 /*yield*/, page.$(".c-item-title__name-prefix")];
                    case 10:
                        nameElement = _a.sent();
                        return [4 /*yield*/, page.$(".c-item-title--suffix")];
                    case 11:
                        suffixElement = _a.sent();
                        return [4 /*yield*/, page.$(".ob-c-gallery__img")];
                    case 12:
                        imgElement = _a.sent();
                        return [4 /*yield*/, imgElement.getProperty("src")];
                    case 13: return [4 /*yield*/, (_a.sent()).jsonValue()];
                    case 14:
                        imgSrc = _a.sent();
                        return [4 /*yield*/, page.evaluate(function (vinElement, priceElement, milageElement, suffixElement, nameElement) {
                                var _a, _b, _c, _d, _e;
                                var vin = vinElement ? (_a = vinElement.textContent) === null || _a === void 0 ? void 0 : _a.trim() : "";
                                var price = priceElement ? (_b = priceElement.textContent) === null || _b === void 0 ? void 0 : _b.trim() : "";
                                var milage = milageElement ? (_c = milageElement.textContent) === null || _c === void 0 ? void 0 : _c.trim() : "";
                                var suffix = suffixElement ? (_d = suffixElement.textContent) === null || _d === void 0 ? void 0 : _d.trim() : "";
                                var name = nameElement ? (_e = nameElement.textContent) === null || _e === void 0 ? void 0 : _e.trim() : "";
                                return { vin: vin, price: price, milage: milage, name: name, suffix: suffix };
                            }, vinElement, priceElement, milageElement, suffixElement, nameElement)];
                    case 15:
                        data = _a.sent();
                        data.imgSrc = imgSrc; // Add imgSrc to the data object
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 1000); })];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, page.goBack()];
                    case 17:
                        _a.sent(); // Go back to the previous page
                        _a.label = 18;
                    case 18:
                        _i++;
                        return [3 /*break*/, 4];
                    case 19: return [4 /*yield*/, page.$(".c-paging__btn-next")];
                    case 20:
                        btnNext = _a.sent();
                        if (!(btnNext != null)) return [3 /*break*/, 23];
                        return [4 /*yield*/, btnNext.click()];
                    case 21:
                        _a.sent();
                        return [4 /*yield*/, dataScrape()];
                    case 22:
                        _a.sent(); // Await the recursive call
                        _a.label = 23;
                    case 23: return [2 /*return*/];
                }
            });
        });
    }
    var browser, page, x_1, y_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, puppeteer.launch({
                    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                    headless: false,
                    args: ["--netifs-to-ignore=INTERFACE_TO_IGNORE"],
                })];
            case 1:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _a.sent();
                return [4 /*yield*/, page.setViewport({
                        width: 1710,
                        height: 1000,
                        deviceScaleFactor: 1,
                    })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _a.trys.push([4, 7, , 8]);
                return [4 /*yield*/, page.goto("https://www.sauto.cz/inzerce/osobni", {
                        waitUntil: "networkidle2",
                    })];
            case 5:
                _a.sent();
                x_1 = 1060;
                y_1 = 360;
                setTimeout(function () {
                    page.mouse.click(x_1, y_1);
                }, 5000);
                return [4 /*yield*/, dataScrape()];
            case 6:
                _a.sent(); // Ensure the initial call is awaited
                return [3 /*break*/, 8];
            case 7:
                error_1 = _a.sent();
                console.error("Error:", error_1);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); })();
