import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({ eyebrow, title, description, align = "left" }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-accent">{eyebrow}</p>
      ) : null}
      <h2 className="font-display text-3xl font-semibold text-balance md:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p> : null}
    </div>
  );
}
