# DropLyx - Premium Price Tracking Platform

DropLyx is a modern, production-ready price tracking platform built with Next.js 14 App Router, MongoDB, and Tailwind CSS. It empowers users to automatically track product prices across major e-commerce platforms like Amazon, Flipkart, Meesho, and Ajio, ensuring they never miss a price drop.

## Features

- **🛍️ Multi-Platform URL Scraping**: Automatically fetch product details (Title, Image, Price) by simply pasting a URL.
- **📈 Price History Charting**: Visualise historical price trends using responsive Recharts line graphs.
- **🔐 Secure Authentication**: Custom JWT and Email OTP verification for a passwordless, secure user experience.
- **🔔 Smart Price Alerts**: Set a target price and receive email notifications automatically when the price drops.
- **✨ New SaaS Features**:
    - **Shared Product Tracking**: A globally synchronized database structure where multiple users can track the exact same URL seamlessly without duplicating records.
    - **URL Normalization Algorithm**: Identifies structurally identical URLs across distinct query permutations automatically mapping the item internally to the "Master" database tracker block.
    - **Lowest Price & Trend Analytics**: "Buy Now" and "Wait" recommendation tags powered by time-sequence logic mapping recent price trends against global averages. Let DropLyx act as your financial intuition.
    - **Social Proof Highlights**: Dynamic visual indicators representing current community tracking mass across trending items (`trackingCount`).
- **💿 Run Migration Script**:
    If upgrading an instance of DropLyx from individual user scoping to the new globally unified model, you MUST run the legacy deduplication sequence string:
    ```bash
    node scripts/migrateProducts.js
    ```
    *This binds your legacy price histories onto the newly formed global Master product links.*
- **🎯 Premium Dashboard**: A beautiful, modern interface highlighting tracked items, price drops, and account stats.
- **⚙️ Automated Jobs**: A background scraper script designed to frequently update database entries effortlessly.

## New Features Added

* Product tracking
* Price history
* Alerts system

## How to use

1. Login
2. Paste product URL
3. Track product
4. View dashboard

## Tech Stack

- **Frontend:** Next.js 14, React 19, Tailwind CSS v4, Lucide React, Recharts
- **Backend:** Next.js API Routes
- **Database:** MongoDB (Mongoose ODMs)
- **Authentication:** Custom JWT via HttpOnly Cookies, Nodemailer for OTP
- **Scraping:** Puppeteer

## Setup Instructions

**1. Clone the repository**
```bash
git clone <repository_url>
cd droplyx
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up Environment Variables**
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=a_super_secret_string
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

**4. Run the development server**
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the platform.

## Run price tracker
node jobs/priceTracker.js
```
