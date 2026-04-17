# DropLyx - Premium Price Tracking Platform

DropLyx is a modern, production-ready price tracking platform built with Next.js 14 App Router, MongoDB, and Tailwind CSS. It empowers users to automatically track product prices across major e-commerce platforms like Amazon, Flipkart, Meesho, and Ajio, ensuring they never miss a price drop.

## Features

- **🛍️ Multi-Platform URL Scraping**: Automatically fetch product details (Title, Image, Price) by simply pasting a URL.
- **📈 Price History Charting**: Visualise historical price trends using responsive Recharts line graphs.
- **🔐 Secure Authentication**: Custom JWT and Email OTP verification for a passwordless, secure user experience.
- **🔔 Smart Price Alerts**: Set a target price and receive email notifications automatically when the price drops.
- **🎯 Premium Dashboard**: A beautiful, modern interface highlighting tracked items, price drops, and account stats.
- **⚙️ Automated Jobs**: A background scraper script designed to frequently update database entries effortlessly.

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

**5. Run the background price tracker job**
This script checks all tracked URLs and sends email alerts if prices drop. Run it via cron locally or on a server every 30 minutes:
```bash
node jobs/priceTracker.js
```

## Folder Structure
- `/app`: Next.js App Router (pages: home, dashboard, wishlist, product details)
- `/app/api`: All backend endpoints (auth, products, alerts)
- `/components`: Reusable UI elements (Navbar, Cards, Charts, AuthModal)
- `/context`: Global React State (AuthContext)
- `/lib`: Core utilities (scraper logic, db connection, token verification)
- `/models`: Mongoose Database Schemas
- `/jobs`: Standalone Node.js scripts for automation

## API Endpoints
- **POST** `/api/auth/request-otp`: Request an email OTP
- **POST** `/api/auth/verify-otp`: Validate OTP and login
- **POST** `/api/product/add`: Start tracking a new product via URL
- **GET** `/api/product/user-products`: List tracked products for a user
- **GET** `/api/product/:id`: Get a specific product with historical price data
- **POST** `/api/alert/create`: Create a price drop alert
- **GET** `/api/alert/user`: List user's active alerts

## Future Improvements
- WhatsApp Integrations using Twilio or Meta Graph API.
- Support for more localized e-commerce platforms.
- Containerization and Cloud Run deployment for background workers.