"use client";

import Link from "next/link";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useState } from "react";

import { buildChatbotReply } from "@/lib/ai";
import { formatCurrency } from "@/lib/utils";
import { useTrendoraStore } from "@/store/trendora-store";

interface Message {
  id: string;
  role: "assistant" | "user";
  text: string;
  suggestions?: {
    id: string;
    slug: string;
    name: string;
    price: number;
    note: string;
  }[];
}

const quickPrompts = ["Gift for friend", "Party wear", "Skincare under 1000", "Bags under 1500"];

export function ChatbotAssistant() {
  const products = useTrendoraStore((state) => state.products);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi, I am Trendora Assist. Ask me for gifting ideas, party wear, skincare, or budget-based shopping help.",
    },
  ]);

  function sendMessage(rawInput: string) {
    const prompt = rawInput.trim();
    if (!prompt) return;

    const reply = buildChatbotReply(products, prompt);
    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-user`, role: "user", text: prompt },
      { id: `${Date.now()}-assistant`, role: "assistant", text: reply.summary, suggestions: reply.suggestions },
    ]);
    setInput("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-3 rounded-full bg-accent px-5 py-4 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-1"
      >
        <MessageCircle className="h-5 w-5" />
        Chat with Trendora AI
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-slate-950/30 p-4 md:p-6">
          <div className="surface flex h-[78vh] w-full max-w-md flex-col overflow-hidden rounded-[2rem] border shadow-glow">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-accent/15 p-3 text-accent">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Trendora Assist</p>
                  <p className="text-xs text-slate-500">Rule-based shopping companion</p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full border p-2">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full border px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-accent hover:text-accent dark:text-slate-300"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[88%] rounded-[1.5rem] px-4 py-3 text-sm leading-6 ${
                      message.role === "user"
                        ? "bg-accent text-white"
                        : "border bg-white/75 text-slate-700 dark:bg-slate-900/75 dark:text-slate-100"
                    }`}
                  >
                    <p>{message.text}</p>
                    {message.suggestions?.length ? (
                      <div className="mt-3 grid gap-2">
                        {message.suggestions.map((suggestion) => (
                          <Link
                            key={suggestion.id}
                            href={`/products/${suggestion.slug}`}
                            className="rounded-2xl border bg-white/80 p-3 text-slate-700 transition hover:border-accent dark:bg-slate-950/80 dark:text-slate-100"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-semibold">{suggestion.name}</span>
                              <span className="text-sm text-accent">{formatCurrency(suggestion.price)}</span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{suggestion.note}</p>
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t px-4 py-4">
              <div className="flex items-center gap-3 rounded-full border bg-white/90 px-4 py-3 dark:bg-slate-950/90">
                <Sparkles className="h-4 w-4 text-accent" />
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      sendMessage(input);
                    }
                  }}
                  placeholder="Try 'casual shoes' or 'gift under 1500'"
                  className="w-full bg-transparent text-sm outline-none"
                />
                <button type="button" onClick={() => sendMessage(input)} className="rounded-full bg-accent p-2 text-white">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
