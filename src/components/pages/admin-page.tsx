"use client";

import { BarChart3, PackagePlus, Users2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { EmptyState } from "@/components/common/empty-state";
import { getMonthlySales } from "@/lib/ai";
import { formatCurrency } from "@/lib/utils";
import { useCurrentUser, useTrendoraStore } from "@/store/trendora-store";

export function AdminPage() {
  const currentUser = useCurrentUser();
  const products = useTrendoraStore((state) => state.products);
  const users = useTrendoraStore((state) => state.users);
  const orders = useTrendoraStore((state) => state.orders);
  const addProduct = useTrendoraStore((state) => state.addProduct);
  const updateProduct = useTrendoraStore((state) => state.updateProduct);
  const deleteProduct = useTrendoraStore((state) => state.deleteProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "Clothing",
    price: "1999",
    discountPrice: "",
    stock: "20",
    tags: "new, curated",
    shortNote: "",
    description: "",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const monthlySales = getMonthlySales(orders);

  const topCategories = useMemo(() => {
    const categoryMap = new Map<string, number>();
    products.forEach((product) => {
      categoryMap.set(product.category, (categoryMap.get(product.category) ?? 0) + product.salesCount);
    });
    return [...categoryMap.entries()].map(([name, value]) => ({ name, value }));
  }, [products]);

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
        <EmptyState
          title="Admin access required"
          description="Login with the demo admin account to manage products, inventory, users, orders, and analytics."
          actionLabel="Go to Login"
          href="/login"
        />
      </div>
    );
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      name: "",
      category: "Clothing",
      price: "1999",
      discountPrice: "",
      stock: "20",
      tags: "new, curated",
      shortNote: "",
      description: "",
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      name: form.name,
      category: form.category as (typeof products)[number]["category"],
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      rating: 4.5,
      stock: Number(form.stock),
      description: form.description,
      images: [form.image],
      tags: form.tags.split(",").map((item) => item.trim()),
      styleKeywords: form.tags.split(",").map((item) => item.trim()),
      colors: ["Custom"],
      sizes: ["S", "M", "L"],
      featured: false,
      trendingScore: 70,
      salesCount: 0,
      shortNote: form.shortNote,
    };

    if (editingId) {
      updateProduct(editingId, payload);
    } else {
      addProduct(payload);
    }

    resetForm();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 lg:px-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Total Products", value: products.length.toString(), icon: PackagePlus },
          { title: "Total Users", value: users.length.toString(), icon: Users2 },
          { title: "Total Orders", value: orders.length.toString(), icon: BarChart3 },
          { title: "Revenue", value: formatCurrency(totalRevenue), icon: BarChart3 },
        ].map((card) => (
          <div key={card.title} className="surface rounded-[2rem] border p-6 shadow-soft">
            <card.icon className="h-5 w-5 text-accent" />
            <p className="mt-4 text-sm text-slate-500">{card.title}</p>
            <h2 className="mt-2 font-display text-4xl font-semibold">{card.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="surface rounded-[2rem] border p-6 shadow-soft">
          <h2 className="font-display text-3xl font-semibold">Monthly Sales Overview</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#c75b39" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface rounded-[2rem] border p-6 shadow-soft">
          <h2 className="font-display text-3xl font-semibold">Best-selling Categories</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topCategories} dataKey="value" nameKey="name" outerRadius={110} fill="#5f6f52" label />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="surface rounded-[2rem] border p-6 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-3xl font-semibold">{editingId ? "Edit Product" : "Add New Product"}</h2>
            {editingId ? (
              <button type="button" onClick={resetForm} className="rounded-full border px-4 py-2 text-sm font-semibold">
                Cancel
              </button>
            ) : null}
          </div>
          <div className="mt-6 grid gap-4">
            {[
              ["name", "Product name"],
              ["category", "Category"],
              ["price", "Price"],
              ["discountPrice", "Discount price"],
              ["stock", "Stock"],
              ["tags", "Tags"],
              ["shortNote", "Short note"],
              ["image", "Image URL"],
            ].map(([key, label]) => (
              <label key={key} className="grid gap-2 text-sm font-medium">
                {label}
                {key === "category" ? (
                  <select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className="rounded-2xl border bg-white/70 px-4 py-3 dark:bg-slate-900/70">
                    <option>Clothing</option>
                    <option>Footwear</option>
                    <option>Bags</option>
                    <option>Accessories</option>
                    <option>Beauty products</option>
                  </select>
                ) : (
                  <input value={form[key as keyof typeof form]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} className="rounded-2xl border bg-white/70 px-4 py-3 dark:bg-slate-900/70" required={["name", "price", "stock", "shortNote", "image"].includes(key)} />
                )}
              </label>
            ))}
            <label className="grid gap-2 text-sm font-medium">
              Description
              <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={5} className="rounded-[1.5rem] border bg-white/70 px-4 py-3 dark:bg-slate-900/70" required />
            </label>
          </div>
          <button type="submit" className="mt-6 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white">
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </form>

        <div className="space-y-6">
          <div className="surface rounded-[2rem] border p-6 shadow-soft">
            <h2 className="font-display text-3xl font-semibold">Inventory Management</h2>
            <div className="mt-6 space-y-4">
              {products.slice(0, 8).map((product) => (
                <div key={product.id} className="rounded-[1.5rem] border bg-white/70 p-4 dark:bg-slate-900/70">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{product.category} · Stock {product.stock}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(product.id);
                          setForm({
                            name: product.name,
                            category: product.category,
                            price: String(product.price),
                            discountPrice: product.discountPrice ? String(product.discountPrice) : "",
                            stock: String(product.stock),
                            tags: product.tags.join(", "),
                            shortNote: product.shortNote,
                            description: product.description,
                            image: product.images[0],
                          });
                        }}
                        className="rounded-full border px-4 py-2 text-sm font-semibold"
                      >
                        Edit
                      </button>
                      <button type="button" onClick={() => deleteProduct(product.id)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface rounded-[2rem] border p-6 shadow-soft">
            <h2 className="font-display text-3xl font-semibold">Recent Orders</h2>
            <div className="mt-6 space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-[1.5rem] border bg-white/70 px-4 py-4 text-sm dark:bg-slate-900/70">
                  <div>
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-slate-500">{order.status}</p>
                  </div>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="surface rounded-[2rem] border p-6 shadow-soft">
            <h2 className="font-display text-3xl font-semibold">Users</h2>
            <div className="mt-6 space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between rounded-[1.5rem] border bg-white/70 px-4 py-4 text-sm dark:bg-slate-900/70">
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-slate-500">{user.email}</p>
                  </div>
                  <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-dark">{user.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
