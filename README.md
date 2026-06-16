# Trendora

Design and Development of an AI-Assisted E-Commerce Website with User-Centric UI & UX

Trendora is a premium fashion and lifestyle e-commerce web application built with Next.js, TypeScript, and Tailwind CSS. The project is designed for final-year BCA submission and focuses on polished UI/UX, responsive shopping flows, and rule-based AI-assisted shopping features such as smart search, product recommendations, and a floating shopping assistant.

## Project Overview

Trendora delivers a complete shopping experience for clothing, footwear, bags, accessories, and beauty products. It includes a storefront, protected user profile area, wishlist and cart flows, checkout, demo authentication, and an admin dashboard with analytics, product management, users, orders, and inventory visibility.

## Core Features

### User Side

- Premium landing page with hero, category discovery, offers, featured products, trending products, and AI recommendation sections
- Product listing page with category, rating, and price filters
- Smart search with query suggestions while typing
- Product details page with image gallery, description, rating, reviews, related products, and quick actions
- Wishlist / favorites support
- Cart with quantity updates and removal
- Checkout page with address form, payment option UI, and order summary
- Authentication flows for sign up, login, logout, and protected profile experience
- Profile page with personal details, wishlist, and order history
- Dark and light mode support
- Mobile-first responsive design

### AI-Assisted Features

- `Recommended For You`: rule-based recommendations using wishlist, cart, viewed items, preferred categories, and budget alignment
- `You May Also Like`: complementary recommendation logic based on cart context and trending items
- `Similar Products`: product detail recommendations based on category, shared tags, and price range
- `Trending Products`: ranking using trend score and demo sales behavior
- Floating chatbot shopping assistant for:
  - finding products
  - gift suggestions
  - budget-based recommendations
  - party wear and casual styling help
  - beauty and skincare assistance
- Smart search that understands queries like:
  - `black dress`
  - `shoes under 1500`
  - `gift for friend`
  - `beauty products`
  - `bags under 1000`

### Admin Side

- Admin login experience
- Add, edit, and delete products
- Inventory visibility
- View users and recent orders
- Analytics cards and charts for:
  - total products
  - total users
  - total orders
  - total revenue
  - best-selling categories
  - monthly sales overview

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Zustand for client state and persistence
- Recharts for analytics
- MongoDB Atlas-ready schema models using Mongoose
- Vercel deployment target

## Demo Credentials

### Customer

- Email: `anaya@trendora.in`
- Password: `trendora123`

### Admin

- Email: `admin@trendora.in`
- Password: `admin123`

## Folder Structure

```text
src/
  app/
    admin/
    cart/
    checkout/
    login/
    products/
    profile/
    signup/
    wishlist/
  components/
    ai/
    common/
    home/
    layout/
    pages/
    product/
    search/
    ui/
  hooks/
  lib/
  models/
  store/
  types/
```

## Database Collections / Models

MongoDB-ready schemas are included for:

- `User`
- `Product`
- `Order`
- `Wishlist`
- `Cart`
- `Admin`
- `Review`

The current demo runs without a mandatory database connection so the app can build and deploy immediately. When `MONGODB_URI` is provided, the project is ready for Atlas-backed extension through the included Mongoose model layer.

## Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file based on `.env.example`.

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
NEXTAUTH_SECRET=your_long_random_secret
NEXTAUTH_URL=http://localhost:3000
```

## Build Verification

```bash
npm run lint
npm run build
```

## Screenshots

Suggested README screenshots to add after deployment:

- Home page hero and AI recommendation sections
- Product listing with filters and smart search
- Product detail page with reviews and related products
- Admin analytics dashboard
- Checkout and profile pages

## GitHub Repository Link

- Add your repository URL here after pushing the project

## Live Deployment Link

- Add your Vercel deployment URL here after publishing the project

## Future Scope

- Integrate real MongoDB-backed CRUD and order persistence
- Replace demo auth with NextAuth or production JWT flow
- Add payment gateway integration
- Add coupon engine and delivery tracking
- Add image upload for admin product management
- Expand AI layer with conversational memory and personalized style journeys

## Submission Notes

Trendora is intentionally designed to be more polished than a basic CRUD demo. The interface, transitions, recommendation logic, and admin analytics are presentation-friendly for viva, PPT demos, resume projects, and GitHub showcases.
