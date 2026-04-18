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
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36");
    await page.setExtraHTTPHeaders({
      "accept-language": "en-US,en;q=0.9",
    });
    
    // Changing to networkidle2 is safer for React-powered SPAs like Flipkart
    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });
    
    // Add brief human-like delay
    await new Promise(r => setTimeout(r, 2000));

    let titleText = "";
    let priceNumber = 0;
    let imageUrlText = "";

    if (platform === "Amazon") {
      titleText = await page.$eval("#productTitle", (el) => el.innerText.trim()).catch(() => "");
      
      const priceText = await page.$eval(".a-price-whole", (el) => el.innerText.trim()).catch(() => "");
      priceNumber = parseInt(priceText.replace(/[^0-9]/g, ""), 10) || 0;

      imageUrlText = await page.$eval("#landingImage", (el) => el.src).catch(() => "");
    } 
    else if (platform === "Flipkart") {
      // 1. Close login popup if it appears (Flipkart often overlays this)
      try {
        await page.click("button._2KpZ6l._2doB4z");
      } catch (e) {
        // Ignored, meaning popup didn't show
      }

      // 2. Wait explicitly for the title so React logic can fully paint
      await page.waitForSelector("span.B_NuCI", { timeout: 10000 }).catch(() => {});
      titleText = await page.$eval("span.B_NuCI", el => el.innerText.trim()).catch(() => "");
      
      // Fallback selector for different layout structures
      if (!titleText) {
        titleText = await page.$eval("span.VU-Tz5", el => el.innerText.trim()).catch(() => "");
      }

      // 3. Price (try multiple selectors commonly used by Flipkart)
      let priceText = "";
      try {
        priceText = await page.$eval("div._30jeq3._16Jk6d", el => el.innerText);
      } catch {
        try {
          priceText = await page.$eval("div._30jeq3", el => el.innerText);
        } catch {
          // Fallback if they changed class name
          priceText = await page.$eval("div.Nx9bqj.CxhGGd", el => el.innerText.trim()).catch(() => "");
        }
      }
      priceNumber = parseInt(priceText.replace(/[^0-9]/g, ""), 10) || 0;

      // 4. Image
      imageUrlText = await page.$eval("img._396cs4, img.v20164, img.DByuf4", el => el.src).catch(() => "");
    }
    else if (platform === "Meesho" || platform === "Ajio") {
      titleText = await page.title();
      imageUrlText = await page.$eval("meta[property='og:image']", el => el.content).catch(() => "");
      priceNumber = 0; 
    }

    if (!titleText || !priceNumber) {
      throw new Error(`Failed to scrape product details for ${platform}. Target may have changed structure or blocked the request.`);
    }

    return {
      title: titleText,
      currentPrice: priceNumber,
      imageUrl: imageUrlText,
      platform,
    };
  } catch (error) {
    console.error(`Scraping error for ${platform}:`, error);
    throw error;
  } finally {
    await browser.close();
  }
}
