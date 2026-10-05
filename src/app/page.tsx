"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Repository data for the featured repos
const repositories = [
  {
    owner: "microsoft",
    name: "vscode",
    description: "Visual Studio Code",
    stars: "179.7k",
  },
  {
    owner: "facebook",
    name: "react",
    description: "The library for web and n...",
    stars: "234k",
  },
  {
    owner: "vercel",
    name: "next.js",
    description: "The React Framework for t...",
    stars: "131k",
  },
  {
    owner: "denoland",
    name: "deno",
    description: "A modern runtime for Jav...",
    stars: "98.7k",
  },
  {
    owner: "tailwindlabs",
    name: "tailwindcss",
    description: "A utility-first CSS fram...",
    stars: "85.2k",
  },
  {
    owner: "rust-lang",
    name: "rust",
    description: "Empowering everyone to...",
    stars: "101k",
  },
  {
    owner: "sveltejs",
    name: "svelte",
    description: "Cybernetically enhanced...",
    stars: "81.4k",
  },
  {
    owner: "oven-sh",
    name: "bun",
    description: "Incredibly fast JavaScript...",
    stars: "76.3k",
  },
  {
    owner: "microsoft",
    name: "typescript",
    description: "TypeScript is a superset...",
    stars: "103k",
  },
];

// Fixed widths for sidebar lines (deterministic to avoid hydration mismatch)
const sidebarLineWidths = {
  left: [52, 78, 45, 68, 55, 72, 48, 65],
  right: [65, 48, 72, 55, 68, 45, 78, 52],
};

// Sidebar decorative lines component
function SidebarLines({ side }: { side: "left" | "right" }) {
  const widths = sidebarLineWidths[side];
  return (
    <div
      className={`hidden lg:flex fixed top-24 ${side === "left" ? "left-8" : "right-8"} flex-col gap-3 opacity-30`}
    >
      {widths.map((width, i) => (
        <div
          key={i}
          className="h-[1px] bg-[#484338]"
          style={{ width: `${width}px` }}
        />
      ))}
    </div>
  );
}

// GitHub icon component
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

// Star icon component
function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
    </svg>
  );
}

// Arrow icon for search
function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// Repogrep logo icon - gear/cog design
function RepoLogo({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="3" stroke="#b7af9d" strokeWidth="1.5" />
      <path
        d="M12 2v2m0 16v2M2 12h2m16 0h2"
        stroke="#666156"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"
        stroke="#b7af9d"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="8" stroke="#484338" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
}

// Avatar colors for different orgs
const avatarColors: Record<string, string> = {
  microsoft: "#0078d4",
  facebook: "#1877f2",
  vercel: "#000000",
  denoland: "#16161d",
  tailwindlabs: "#38bdf8",
  "rust-lang": "#f74c00",
  sveltejs: "#ff3e00",
  "oven-sh": "#fbf0df",
};

// Avatar component with fallback
function OrgAvatar({ owner }: { owner: string }) {
  const bgColor = avatarColors[owner] || "#484338";
  const textColor = owner === "oven-sh" ? "#000" : "#fff";
  return (
    <div
      className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {owner.slice(0, 2).toUpperCase()}
    </div>
  );
}

// Repository card component
function RepoCard({
  owner,
  name,
  description,
  stars,
  onClick,
}: {
  owner: string;
  name: string;
  description: string;
  stars: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group bg-[#1a1917] border border-[#2a2722] rounded-lg p-4 hover:border-[#3a3732] transition-all cursor-pointer overflow-hidden text-left w-full"
    >
      <div className="flex items-start gap-3">
        <OrgAvatar owner={owner} />
        <div className="flex-1 min-w-0 overflow-hidden">
          <h3 className="mono text-sm font-medium text-white group-hover:text-[#4aa39d] transition-colors truncate">
            {owner}/<span className="text-[#b7af9d]">{name}</span>
          </h3>
          <p className="text-xs text-[#666156] mt-1 truncate">{description}</p>
          <div className="flex items-center gap-1 mt-2">
            <StarIcon className="w-3 h-3 text-[#666156] flex-shrink-0" />
            <span className="text-xs text-[#666156]">{stars}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

// Close icon component
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// Main page component
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showBanner, setShowBanner] = useState(true);
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <main className="min-h-screen bg-[#141414] relative">
      {/* Top banner */}
      {showBanner && (
        <div className="w-full bg-[#1a1814] border-b border-[#2a2520] py-2 px-4">
          <div className="max-w-4xl mx-auto relative">
            <p className="text-center text-sm text-[#d4a853] pr-8">
              You are viewing Ami in read-only mode. Install the desktop app for full functionality.{" "}
              <a
                href="https://ami.dev/download"
                className="underline hover:text-[#e8bc67] transition-colors"
              >
                Download
              </a>
            </p>
            <button
              type="button"
              onClick={() => setShowBanner(false)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1 hover:bg-[#2a2520] rounded transition-colors"
              aria-label="Dismiss banner"
            >
              <CloseIcon className="w-4 h-4 text-[#d4a853]" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="w-full px-6 py-4 border-b border-[#222]">
        <div className="flex items-center gap-2">
          <RepoLogo size={20} />
          <span className="text-white font-medium">Repogrep</span>
          <svg
            className="w-4 h-4 text-[#666156] ml-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12" y2="18" />
          </svg>
        </div>
      </header>

      {/* Decorative sidebars */}
      <SidebarLines side="left" />
      <SidebarLines side="right" />

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <RepoLogo size={48} />
          </div>
          <h1 className="text-4xl font-semibold text-white mb-2">Repogrep</h1>
          <p className="text-2xl text-[#b7af9d] font-light">
            Ultra fast codebase search
          </p>
        </div>

        {/* Description */}
        <p className="text-center text-[#666156] mb-10 max-w-md mx-auto">
          Repogrep is an AI coding agent that can search across any public GitHub repository
        </p>

        {/* Search input */}
        <div className="relative mb-12">
          <div className="flex items-center bg-[#1a1917] border border-[#2a2722] rounded-lg px-4 py-3 focus-within:border-[#3a3732] transition-colors">
            <span className="text-[#666156] mr-2">Paste</span>
            <GitHubIcon className="w-4 h-4 text-[#666156] mr-2" />
            <input
              type="text"
              placeholder="GitHub repo URL or search by keyword"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-[#b7af9d] placeholder-[#484338] outline-none text-sm"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="p-1 hover:bg-[#2a2722] rounded transition-colors"
            >
              <ArrowIcon className="w-5 h-5 text-[#666156]" />
            </button>
          </div>
        </div>

        {/* Repository grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {repositories.map((repo) => (
            <RepoCard
              key={`${repo.owner}/${repo.name}`}
              owner={repo.owner}
              name={repo.name}
              description={repo.description}
              stars={repo.stars}
              onClick={() => router.push(`/search?q=${encodeURIComponent(`${repo.owner}/${repo.name}`)}`)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
