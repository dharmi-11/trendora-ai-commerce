import { categories } from "@/lib/constants";
import type { CartItem, Order, Product } from "@/types";

export function getTrendingProducts(products: Product[]) {
  return [...products]
    .sort((first, second) => second.trendingScore + second.salesCount - (first.trendingScore + first.salesCount))
    .slice(0, 6);
}

export function getSimilarProducts(products: Product[], targetProduct: Product) {
  return products
    .filter((product) => product.id !== targetProduct.id)
    .sort((first, second) => scoreProduct(second, targetProduct) - scoreProduct(first, targetProduct))
    .slice(0, 4);
}

function scoreProduct(candidate: Product, reference: Product) {
  let score = 0;

  if (candidate.category === reference.category) score += 4;
  if (Math.abs((candidate.discountPrice ?? candidate.price) - (reference.discountPrice ?? reference.price)) <= 800) {
    score += 2;
  }
  const sharedKeywords = candidate.tags.filter((tag) => reference.tags.includes(tag)).length;
  score += sharedKeywords * 1.5;

  return score;
}

export function getRecommendedForUser(
  products: Product[],
  wishlistIds: string[],
  cartItems: CartItem[],
  viewedProductIds: string[],
) {
  const preferenceProducts = products.filter((product) =>
    [...wishlistIds, ...cartItems.map((item) => item.productId), ...viewedProductIds].includes(product.id),
  );

  const preferredCategories = new Set(preferenceProducts.map((product) => product.category));
  const pricePoints = preferenceProducts.map((product) => product.discountPrice ?? product.price);
  const averageBudget = pricePoints.length
    ? pricePoints.reduce((sum, value) => sum + value, 0) / pricePoints.length
    : 2000;

  return products
    .filter((product) => !wishlistIds.includes(product.id))
    .sort((first, second) => {
      const firstScore = recommendationScore(first, preferredCategories, averageBudget);
      const secondScore = recommendationScore(second, preferredCategories, averageBudget);
      return secondScore - firstScore;
    })
    .slice(0, 6);
}

function recommendationScore(product: Product, preferredCategories: Set<string>, averageBudget: number) {
  let score = product.trendingScore / 10;

  if (preferredCategories.has(product.category)) {
    score += 6;
  }

  const effectivePrice = product.discountPrice ?? product.price;
  if (Math.abs(effectivePrice - averageBudget) <= 600) {
    score += 4;
  }

  if (effectivePrice <= averageBudget) {
    score += 2;
  }

  return score;
}

export function getYouMayAlsoLike(products: Product[], cartItems: CartItem[]) {
  if (!cartItems.length) {
    return getTrendingProducts(products);
  }

  const cartCategories = new Set(
    cartItems
      .map((item) => products.find((product) => product.id === item.productId)?.category)
      .filter(Boolean) as string[],
  );

  return products
    .filter((product) => categories.includes(product.category))
    .sort((first, second) => {
      const firstScore = (cartCategories.has(first.category) ? 5 : 0) + first.rating + first.salesCount / 20;
      const secondScore = (cartCategories.has(second.category) ? 5 : 0) + second.rating + second.salesCount / 20;
      return secondScore - firstScore;
    })
    .slice(0, 6);
}

export function buildChatbotReply(products: Product[], prompt: string) {
  const query = prompt.toLowerCase();
  const budgetMatch = query.match(/under\s+(\d+)/i);
  const budget = budgetMatch ? Number(budgetMatch[1]) : undefined;

  let matches = products.filter((product) => {
    const searchable = [product.name, product.category, ...product.tags, ...product.styleKeywords]
      .join(" ")
      .toLowerCase();
    const matchesKeywords = query
      .split(/\s+/)
      .filter((part) => !["under", "for", "a", "the", "me", "show"].includes(part))
      .every((part) => searchable.includes(part));

    const matchesBudget = budget ? (product.discountPrice ?? product.price) <= budget : true;

    return matchesKeywords && matchesBudget;
  });

  if (query.includes("gift")) {
    matches = matches.filter(
      (product) =>
        product.tags.some((tag) => tag.toLowerCase().includes("gift")) ||
        (product.discountPrice ?? product.price) <= (budget ?? 2000),
    );
  }

  if (!matches.length && query.includes("party")) {
    matches = products.filter((product) => product.styleKeywords.includes("party wear"));
  }

  if (!matches.length && query.includes("skincare")) {
    matches = products.filter((product) => product.category === "Beauty products");
  }

  if (!matches.length && query.includes("bags")) {
    matches = products.filter((product) => product.category === "Bags");
  }

  const suggestions = matches.slice(0, 3);

  const summary = suggestions.length
    ? `I found ${suggestions.length} option${suggestions.length > 1 ? "s" : ""} that match your request.`
    : "I could not find an exact match, so I picked a few trending alternatives you might still like.";

  return {
    summary,
    suggestions: (suggestions.length ? suggestions : getTrendingProducts(products).slice(0, 3)).map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.discountPrice ?? product.price,
      note: product.shortNote,
    })),
  };
}

export function getMonthlySales(orders: Order[]) {
  const salesMap = new Map<string, number>();

  orders.forEach((order) => {
    const key = order.createdAt.slice(0, 7);
    salesMap.set(key, (salesMap.get(key) ?? 0) + order.total);
  });

  return [...salesMap.entries()].map(([month, sales]) => ({ month, sales }));
}
