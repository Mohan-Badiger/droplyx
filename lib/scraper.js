import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

// IMPORTANT: Enable Stealth Plugin to avoid bots block mechanism
puppeteer.use(StealthPlugin());

export async function scrapeProductUrl(url) {
  if (!url) return null;

  let platform = "Unknown";
  if (url.includes("amazon.in") || url.includes("amazon.com")) platform = "Amazon";
  else if (url.includes("flipkart.com")) platform = "Flipkart";
  else if (url.includes("meesho.com")) platform = "Meesho";
  else if (url.includes("ajio.com")) platform = "Ajio";

  if (platform === "Unknown") {
    throw new Error("Unsupported platform. Valid platforms: Amazon, Flipkart, Meesho, Ajio");
  }

  // Debug: use headless: false if debugging specific blocked selectors
  const browser = await puppeteer.launch({
    headless: true, // Use false if debugging locally
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
    );
    await page.setExtraHTTPHeaders({
      "accept-language": "en-US,en;q=0.9",
    });
    
    // Changing to domcontentloaded per user advice
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });
    
    // ⏳ Wait a bit (Flipkart needs time)
    await new Promise(r => setTimeout(r, 3000));

    let titleText = "";
    let priceNumber = 0;
    let imageUrlText = "";

    if (platform === "Amazon") {
      titleText = await page.$eval("#productTitle", (el) => el.innerText.trim()).catch(() => "");
      const priceText = await page.$eval(".a-price-whole", (el) => el.innerText.trim()).catch(() => "");
      priceNumber = parseInt(priceText.replace(/[^0-9]/g, ""), 10) || 0;
      imageUrlText = await page.$eval("#landingImage", (el) => el.src).catch(() => "");
      
      if (!titleText || !priceNumber) {
        throw new Error("Amazon Scrape Error: Title or Price not found.");
      }
    } 
    else if (platform === "Flipkart") {
      // 1. Close login popup if it appears (Flipkart often overlays this)
      try {
        await page.click("button._2KpZ6l._2doB4z");
        await new Promise(r => setTimeout(r, 1000));
      } catch (e) {}

      // 2. Instead of brittle CSS classes, use structured JSON-LD data!
      try {
        const jsonLdData = await page.evaluate(() => {
          const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
          for (let script of scripts) {
            try {
              const parsed = JSON.parse(script.innerText);
              const data = Array.isArray(parsed) ? parsed[0] : parsed;
              
              if (data && (data["@type"] === "Product" || data.name)) {
                return {
                  title: data.name,
                  price: data.offers ? data.offers.price : null,
                  image: data.image ? (Array.isArray(data.image) ? data.image[0] : data.image) : null
                };
              }
            } catch (err) {
              // Ignore malformed JSON
            }
          }
          return null;
        });

        if (jsonLdData && jsonLdData.title && jsonLdData.price) {
          titleText = jsonLdData.title;
          priceNumber = Number(jsonLdData.price);
          imageUrlText = jsonLdData.image || "";
        } else {
          throw new Error("JSON-LD not found or incomplete");
        }
      } catch (e) {
        // Fallback to basic selectors if JSON-LD parsing completely fails
        try {
          await page.waitForSelector("span.B_NuCI, span.VU-Tz5", { timeout: 5000 });
          titleText = await page.$eval("span.B_NuCI, span.VU-Tz5", el => el.innerText.trim());
        } catch {
          throw new Error("Title not found");
        }

        try {
          const priceText = await page.$eval("div._30jeq3._16Jk6d, div._30jeq3, div.Nx9bqj.CxhGGd", el => el.innerText);
          priceNumber = parseInt(priceText.replace(/[^0-9]/g, ""), 10) || 0;
        } catch {
          throw new Error("Price not found");
        }

        imageUrlText = await page.$eval("img._396cs4, img.v20164, img.DByuf4", el => el.src).catch(() => "");
      }
    }
    else if (platform === "Meesho") {
      titleText = await page.title();
      imageUrlText = await page.$eval("meta[property='og:image']", el => el.content).catch(() => "");
      try {
        const priceText = await page.$eval("h4, [class*='PriceRow'], .Text__StyledText-sc-oo0kvp-0", el => el.innerText);
        priceNumber = parseInt((priceText || "").replace(/[^0-9]/g, ""), 10) || 0;
      } catch {
        // Leave as 0 if not found
      }
    }
    else if (platform === "Ajio") {
      try {
        await page.waitForSelector(".prod-name", { timeout: 4000 });
        titleText = await page.$eval(".prod-name", el => el.innerText.trim()).catch(() => page.title());
        const priceText = await page.$eval(".prod-sp", el => el.innerText.trim()).catch(() => "");
        priceNumber = parseInt((priceText || "").replace(/[^0-9]/g, ""), 10) || 0;
        imageUrlText = await page.$eval("img.rilrtl-lazy-img, meta[property='og:image']", el => el.src || el.content).catch(() => "");
      } catch {
        // Fallback or handle below
        titleText = await page.title();
      }
    }

    if (titleText.toLowerCase().includes("access denied") || titleText.toLowerCase().includes("security check") || titleText.toLowerCase().includes("captcha") || titleText.toLowerCase().includes("blocked")) {
      throw new Error(`Store blocked request (Access Denied / Captcha). Title received: ${titleText}`);
    }

    return {
      title: titleText,
      currentPrice: priceNumber,
      imageUrl: imageUrlText,
      platform,
    };
  } catch (error) {
    console.error(`Flipkart/Amazon Scrape Error:`, error.message);
    throw new Error(
      `Failed to scrape ${platform}. Possible bot detection or selector issue.`
    );
  } finally {
    await browser.close();
  }
}
