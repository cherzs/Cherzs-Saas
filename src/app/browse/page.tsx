"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MagnifyingGlassIcon, EyeIcon, HeartIcon } from "@heroicons/react/24/outline";

interface Idea {
  id: string;
  title: string;
  description: string;
  screenshots: string[];
  views: number;
  likes: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image: string | null;
    userType: string;
  };
}

interface IdeasResponse {
  ideas: Idea[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function BrowsePage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchIdeas = async (search?: string, page?: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (page) params.append("page", page.toString());
      params.append("limit", "12");

      const response = await fetch(`/api/ideas?${params}`);
      const data: IdeasResponse = await response.json();

      setIdeas(data.ideas);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    setSearchTerm(search);
    fetchIdeas(search, page);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    router.push(`/browse?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    params.append("page", page.toString());
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            SaaS Ideas
          </h1>
          <p className="text-gray-300 text-lg">
            Browse 63,956 SaaS ideas from 7,280 developers. Filter the best remote SaaS projects by category, location, and skills.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mb-6">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search SaaS ideas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </form>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              "AI/ML", "Fintech", "E-commerce", "Healthcare", "Education", "Productivity",
              "Social", "Gaming", "Real Estate", "Travel", "Food", "Fitness"
            ].map((category) => (
              <button
                key={category}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-700"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Ideas Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-700 rounded mb-4"></div>
                <div className="h-3 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-white mb-2">
              No ideas found
            </h3>
            <p className="text-gray-400">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Be the first to share an idea!"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {ideas.map((idea) => (
                <Link
                  key={idea.id}
                  href={`/ideas/${idea.id}`}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {idea.title}
                      </h3>
                      <p className="text-blue-400 text-sm mb-2">by {idea.author.name}</p>
                    </div>
                    <span className="text-gray-400 text-xs">
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {idea.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    <span>{idea.views.toLocaleString()} views</span>
                    <span className="mx-2">•</span>
                    <HeartIcon className="h-4 w-4 mr-1" />
                    <span>{idea.likes} likes</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {["SaaS", "Web3", "AI"].map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-600 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <nav className="flex space-x-2">
                  {pagination.page > 1 && (
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          page === pagination.page
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 bg-gray-800 border border-gray-700 hover:bg-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  {pagination.page < pagination.totalPages && (
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Next
                    </button>
                  )}
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 