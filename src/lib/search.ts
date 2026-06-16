import type { Product, SearchSuggestion } from "@/types";

function getBudgetCap(query: string) {
  const match = query.match(/under\s+(\d+)/i);
  return match ? Number(match[1]) : undefined;
}

export function smartSearchProducts(products: Product[], rawQuery: string) {
  const query = rawQuery.trim().toLowerCase();

  if (!query) {
    return products;
  }

  const budgetCap = getBudgetCap(query);
  const keywords = query.split(/\s+/).filter(Boolean);

  return products.filter((product) => {
    const searchable = [
      product.name,
      product.category,
      product.description,
      ...product.tags,
      ...product.styleKeywords,
    ]
      .join(" ")
      .toLowerCase();

    const matchesKeywords = keywords.every((keyword) => searchable.includes(keyword));
    const matchesBudget = budgetCap
      ? (product.discountPrice ?? product.price) <= budgetCap
      : true;

    const giftIntent = query.includes("gift");
    const giftEligible =
      !giftIntent ||
      product.tags.some((tag) => tag.toLowerCase().includes("gift")) ||
      (product.discountPrice ?? product.price) <= 2000;

    return matchesKeywords && matchesBudget && giftEligible;
  });
}

export function getSearchSuggestions(products: Product[], rawQuery: string): SearchSuggestion[] {
  const query = rawQuery.trim().toLowerCase();

  if (!query) {
    return [
      { label: "Black dress", type: "style", value: "black dress" },
      { label: "Shoes under 1500", type: "budget", value: "shoes under 1500" },
      { label: "Gift for friend", type: "style", value: "gift for friend" },
      { label: "Beauty products", type: "category", value: "beauty products" },
    ];
  }

  const directMatches = products
    .filter((product) => {
      const searchable = [product.name, product.category, ...product.tags, ...product.styleKeywords]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    })
    .slice(0, 4)
    .map((product) => ({
      label: product.name,
      type: "product" as const,
      value: product.name,
    }));

  const styleMatches = Array.from(
    new Set(
      products.flatMap((product) => product.styleKeywords).filter((keyword) => keyword.toLowerCase().includes(query)),
    ),
  )
    .slice(0, 3)
    .map((keyword) => ({
      label: keyword,
      type: "style" as const,
      value: keyword,
    }));

  return [...directMatches, ...styleMatches].slice(0, 6);
}
