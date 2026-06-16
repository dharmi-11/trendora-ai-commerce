import { Suspense } from "react";

import { ProductsPage } from "@/components/pages/products-page";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="surface rounded-[2rem] border p-8 shadow-soft">
            <p className="text-sm text-slate-500">Loading products...</p>
          </div>
        </div>
      }
    >
      <ProductsPage />
    </Suspense>
  );
}
