import puppeteer from "puppeteer";

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

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    // Set a common user agent to avoid being blocked easily
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
    
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    let titleText = "";
    let priceNumber = 0;
    let imageUrlText = "";

    if (platform === "Amazon") {
      titleText = await page.$eval("#productTitle", (el) => el.innerText.trim()).catch(() => "");
      
      const priceText = await page.$eval(".a-price-whole", (el) => el.innerText.trim()).catch(() => "");
      priceNumber = parseInt(priceText.replace(/[^0-9]/g, ""), 10);

      imageUrlText = await page.$eval("#landingImage", (el) => el.src).catch(() => "");
    } 
    else if (platform === "Flipkart") {
      titleText = await page.$eval(".VU-Tz5", (el) => el.innerText.trim()).catch(() => "");
      
      const priceText = await page.$eval(".Nx9bqj.CxhGGd", (el) => el.innerText.trim()).catch(() => "");
      priceNumber = parseInt(priceText.replace(/[^0-9]/g, ""), 10);

      imageUrlText = await page.$eval(".v20164, .DByuf4", (el) => el.src).catch(() => "");
    }
    // Simple fallbacks for Meesho and Ajio can be implemented similarly with their specific selectors.
    else if (platform === "Meesho" || platform === "Ajio") {
      // Basic fallback using standard tags for demo/minimal implementation.
      titleText = await page.title();
      // Trying to find generic schema or meta og tags for MVP
      imageUrlText = await page.$eval("meta[property='og:image']", el => el.content).catch(() => "");
      priceNumber = 0; // Requires deep inspection of their react DOM structure
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
    console.error("Scraping error:", error);
    throw error;
  } finally {
    await browser.close();
  }
}
