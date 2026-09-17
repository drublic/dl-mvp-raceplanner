import { readFileSync } from "node:fs";
import path from "node:path";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppHeader } from "@/components/AppHeader";
import HomePage from "@/app/page";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("next/image", () => ({
  default: function MockImage({
    alt,
    src,
  }: {
    alt: string;
    src: string;
  }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} src={src} />;
  },
}));

vi.mock("next/link", () => ({
  default: function MockLink({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

const globalsCss = readFileSync(
  path.join(__dirname, "../app/globals.css"),
  "utf8",
);

describe("app shell", () => {
  it("renders sticky shared header with brand, nav stubs, and account placeholder", () => {
    render(
      <div className="app-shell">
        <AppHeader />
        <main className="app-main">
          <HomePage />
        </main>
      </div>,
    );

    const header = screen.getByTestId("app-header");
    expect(header).toHaveClass("app-header");
    expect(header).toBeVisible();
    expect(globalsCss).toMatch(/position:\s*sticky/);
    expect(globalsCss).toMatch(/\.app-header\s*\{/);

    expect(within(header).getByAltText("DSD")).toHaveAttribute(
      "src",
      "/images/dsd-logo.png",
    );
    expect(within(header).getByRole("link", { name: "Home" })).toBeVisible();
    expect(within(header).getByRole("link", { name: "Kalender" })).toBeVisible();
    expect(within(header).getByRole("link", { name: "Startgeld" })).toBeVisible();
    expect(within(header).getByTestId("account-placeholder")).toHaveTextContent(
      "Account",
    );
  });

  it("applies club look signals on the home shell", () => {
    render(
      <div className="app-shell">
        <AppHeader />
        <main className="app-main">
          <HomePage />
        </main>
      </div>,
    );

    expect(screen.getByAltText("DSD")).toBeInTheDocument();
    expect(globalsCss).toMatch(/--cream:\s*#f5f1e8/);
    expect(globalsCss).toMatch(/--ink:\s*#1c1a14/);
    expect(globalsCss).toMatch(/--links:\s*#2c5e7a/);
    expect(globalsCss).toMatch(/--accent:\s*#ff4801/);
    expect(globalsCss).toMatch(/Bricolage Grotesque/);
    expect(globalsCss).toMatch(/Lato/);
  });

  it("shows minimal empty home without calendar or start-list content", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "Startlist" })).toBeVisible();
    expect(screen.getByTestId("empty-home")).toBeVisible();
    expect(screen.queryByText(/Kalender/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Startliste|start list/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("links to the club website from the home empty state", () => {
    render(<HomePage />);

    const clubLink = screen.getByRole("link", { name: "Zur Club-Website" });
    expect(clubLink).toHaveAttribute("href", "https://rtcdsd.de/");
    expect(clubLink).toHaveAttribute("target", "_blank");
    expect(clubLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
