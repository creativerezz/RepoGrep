"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";

interface Repository {
  id: number;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
}

interface SearchResponse {
  total_count: number;
  items: Repository[];
}

// Format star count (e.g., 179700 -> "179.7k")
function formatStars(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
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

// Back arrow icon
function BackIcon({ className }: { className?: string }) {
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
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

// Repogrep logo icon
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

// Language color mapping
const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Vue: "#41b883",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
  Svelte: "#ff3e00",
};

// Repository result card
function RepoResultCard({ repo }: { repo: Repository }) {
  const languageColor = repo.language ? languageColors[repo.language] || "#858585" : null;

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-[#1a1917] border border-[#2a2722] rounded-lg p-4 hover:border-[#3a3732] transition-all cursor-pointer block overflow-hidden"
    >
      <div className="flex items-start gap-3">
        <img
          src={repo.owner.avatar_url}
          alt={repo.owner.login}
          className="w-10 h-10 rounded-md"
        />
        <div className="flex-1 min-w-0 overflow-hidden">
          <h3 className="mono text-sm font-medium text-white group-hover:text-[#4aa39d] transition-colors truncate">
            {repo.owner.login}/<span className="text-[#b7af9d]">{repo.name}</span>
          </h3>
          <p className="text-xs text-[#666156] mt-1 line-clamp-2">
            {repo.description || "No description"}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <StarIcon className="w-3 h-3 text-[#666156] flex-shrink-0" />
              <span className="text-xs text-[#666156]">{formatStars(repo.stargazers_count)}</span>
            </div>
            {repo.language && (
              <div className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: languageColor || "#858585" }}
                />
                <span className="text-xs text-[#666156]">{repo.language}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-[#1a1917] border border-[#2a2722] rounded-lg p-4 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-md bg-[#2a2722]" />
            <div className="flex-1">
              <div className="h-4 bg-[#2a2722] rounded w-1/3 mb-2" />
              <div className="h-3 bg-[#2a2722] rounded w-2/3 mb-2" />
              <div className="h-3 bg-[#2a2722] rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
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

// Search content component (uses useSearchParams)
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<Repository[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(query);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        // Determine if query is a GitHub URL or search term
        let searchQuery = query;
        const githubUrlMatch = query.match(/github\.com\/([^\/]+)\/([^\/\s]+)/);
        if (githubUrlMatch) {
          searchQuery = `${githubUrlMatch[1]}/${githubUrlMatch[2].replace(/\.git$/, "")}`;
        }

        const response = await fetch(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=30`
        );

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error("GitHub API rate limit exceeded. Please try again later.");
          }
          throw new Error("Failed to fetch results");
        }

        const data: SearchResponse = await response.json();
        setResults(data.items);
        setTotalCount(data.total_count);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleSearch = () => {
    if (searchInput.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchInput.trim())}`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <main className="min-h-screen bg-[#141414]">
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
      <header className="w-full px-6 py-4 border-b border-[#222] sticky top-0 bg-[#141414] z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BackIcon className="w-5 h-5 text-[#666156]" />
            <RepoLogo size={20} />
            <span className="text-white font-medium">Repogrep</span>
          </Link>

          {/* Search bar in header */}
          <div className="flex-1 max-w-xl">
            <div className="flex items-center bg-[#1a1917] border border-[#2a2722] rounded-lg px-3 py-2 focus-within:border-[#3a3732] transition-colors">
              <GitHubIcon className="w-4 h-4 text-[#666156] mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-[#b7af9d] placeholder-[#484338] outline-none text-sm"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="p-1 hover:bg-[#2a2722] rounded transition-colors"
              >
                <ArrowIcon className="w-4 h-4 text-[#666156]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Results header */}
        {query && !loading && !error && (
          <div className="mb-6">
            <h1 className="text-xl text-white font-medium">
              Search results for "<span className="text-[#4aa39d]">{query}</span>"
            </h1>
            <p className="text-sm text-[#666156] mt-1">
              {totalCount.toLocaleString()} repositories found
            </p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div>
            <div className="mb-6">
              <div className="h-6 bg-[#2a2722] rounded w-1/3 mb-2 animate-pulse" />
              <div className="h-4 bg-[#2a2722] rounded w-1/4 animate-pulse" />
            </div>
            <LoadingSkeleton />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <p className="text-[#ff6b6b] mb-4">{error}</p>
            <Link
              href="/"
              className="text-[#4aa39d] hover:underline"
            >
              Go back home
            </Link>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && query && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#666156] mb-4">No repositories found for "{query}"</p>
            <Link
              href="/"
              className="text-[#4aa39d] hover:underline"
            >
              Go back home
            </Link>
          </div>
        )}

        {/* Results grid */}
        {!loading && !error && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((repo) => (
              <RepoResultCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}

        {/* No query state */}
        {!query && (
          <div className="text-center py-12">
            <p className="text-[#666156] mb-4">Enter a search query to find repositories</p>
            <Link
              href="/"
              className="text-[#4aa39d] hover:underline"
            >
              Go back home
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

// Main page component with Suspense boundary
export default function SearchPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#141414]">
        <header className="w-full px-6 py-4 border-b border-[#222]">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 bg-[#2a2722] rounded w-32 animate-pulse" />
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <LoadingSkeleton />
        </div>
      </main>
    }>
      <SearchContent />
    </Suspense>
  );
}
