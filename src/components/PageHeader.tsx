import type { ReactNode } from "react";

type PageHeaderProps = {
  /** Small uppercase label shown above the title (e.g. "/clientes"). */
  eyebrow?: string;
  /** Main page title. Accepts inline markup (e.g. coloured spans). */
  title: ReactNode;
  /** Subtitle / supporting copy. */
  description?: ReactNode;
  /** Optional right-aligned actions (buttons, toggles, etc.). */
  actions?: ReactNode;
};

/**
 * Standardized page title block. Replaces the ad-hoc `<header>` snippets
 * each page used to render with hand-coded Tailwind classes.
 */
export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
        )}
        <h1 className="mt-2 text-3xl md:text-4xl font-bold text-heading">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}
