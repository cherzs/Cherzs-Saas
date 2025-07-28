"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { 
  MagnifyingGlassIcon, 
  EyeIcon, 
  HeartIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  ClockIcon,
  UserIcon,
  TagIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

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

const categories = [
  { name: "All", count: "63,956", color: "gray" },
  { name: "AI/ML", count: "2,341", color: "blue" },
  { name: "Fintech", count: "1,892", color: "green" },
  { name: "E-commerce", count: "987", color: "purple" },
  { name: "Healthcare", count: "1,456", color: "red" },
  { name: "Education", count: "1,203", color: "yellow" },
  { name: "Productivity", count: "856", color: "indigo" },
  { name: "Social", count: "743", color: "pink" },
  { name: "Gaming", count: "621", color: "orange" },
  { name: "Real Estate", count: "534", color: "teal" },
  { name: "Travel", count: "489", color: "cyan" },
  { name: "Food", count: "376", color: "lime" },
  { name: "Fitness", count: "298", color: "emerald" }
];

export default function BrowsePage() {
  const { data: session } = useSession();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [likingIdeas, setLikingIdeas] = useState<Set<string>>(new Set());
  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchIdeas = async (search?: string, page?: number, category?: string, sort?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (page) params.append("page", page.toString());
      if (category && category !== "All") params.append("category", category);
      if (sort) params.append("sort", sort);
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

  const fetchFavorites = async () => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch("/api/favorites");
      const data = await response.json();
      
      if (response.ok) {
        const favoriteIds = new Set<string>(data.favorites.map((fav: any) => fav.id));
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const category = searchParams.get("category") || "All";
    const sort = searchParams.get("sort") || "newest";
    
    setSearchTerm(search);
    setSelectedCategory(category);
    setSortBy(sort);
    fetchIdeas(search, page, category, sort);
  }, [searchParams]);

  useEffect(() => {
    if (session) {
      fetchFavorites();
    }
  }, [session]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({ search: searchTerm, page: 1 });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateURL({ category, page: 1 });
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    updateURL({ sort, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page });
  };

  const updateURL = (updates: { search?: string; category?: string; sort?: string; page?: number }) => {
    const params = new URLSearchParams();
    
    const newSearch = updates.search !== undefined ? updates.search : searchTerm;
    const newCategory = updates.category !== undefined ? updates.category : selectedCategory;
    const newSort = updates.sort !== undefined ? updates.sort : sortBy;
    const newPage = updates.page !== undefined ? updates.page : pagination.page;

    if (newSearch) params.append("search", newSearch);
    if (newCategory && newCategory !== "All") params.append("category", newCategory);
    if (newSort && newSort !== "newest") params.append("sort", newSort);
    if (newPage > 1) params.append("page", newPage.toString());

    router.push(`/browse?${params.toString()}`);
  };

  const handleFavorite = async (ideaId: string) => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }

    if (likingIdeas.has(ideaId)) return;

    setLikingIdeas(prev => new Set([...prev, ideaId]));

    try {
      const isFavorited = favorites.has(ideaId);
      const method = isFavorited ? "DELETE" : "POST";
      
      const response = await fetch(`/api/ideas/${ideaId}/favorite`, {
        method,
      });

      if (response.ok) {
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          if (isFavorited) {
            newFavorites.delete(ideaId);
          } else {
            newFavorites.add(ideaId);
          }
          return newFavorites;
        });

        setIdeas(prev => prev.map(idea => 
          idea.id === ideaId 
            ? { ...idea, likes: idea.likes + (isFavorited ? -1 : 1) }
            : idea
        ));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setLikingIdeas(prev => {
        const newSet = new Set(prev);
        newSet.delete(ideaId);
        return newSet;
      });
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <SparklesIcon className="h-10 w-10 text-blue-400 mr-3" />
                SaaS Ideas
              </h1>
              <p className="text-gray-300 text-lg">
                Discover 63,956 innovative SaaS ideas from 7,280 developers worldwide
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-2xl">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search brilliant SaaS ideas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className={`space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
            {/* Categories */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <TagIcon className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-white">Categories</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryChange(category.name)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                      selectedCategory === category.name
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="ml-2 text-xs opacity-75">({category.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-white">Sort by</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "newest", label: "Latest" },
                  { value: "popular", label: "Most Popular" },
                  { value: "trending", label: "Trending" },
                  { value: "most_liked", label: "Most Liked" }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      sortBy === option.value
                        ? "bg-green-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        {!loading && (
          <div className="flex items-center justify-between mb-6 text-sm text-gray-400">
            <div>
              Showing {ideas.length} of {pagination.total} ideas
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
              {searchTerm && ` for "${searchTerm}"`}
            </div>
            <div>
              Page {pagination.page} of {pagination.totalPages}
            </div>
          </div>
        )}

        {/* Ideas Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              No ideas found
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm
                ? `No results for "${searchTerm}"`
                : selectedCategory !== "All"
                ? `No ideas in ${selectedCategory} category`
                : "Be the first to share an idea!"}
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                updateURL({ search: "", category: "All", page: 1 });
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Link href={`/ideas/${idea.id}`}>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors cursor-pointer line-clamp-2">
                          {idea.title}
                        </h3>
                      </Link>
                      <div className="flex items-center text-blue-400 text-sm mb-3">
                        <UserIcon className="h-4 w-4 mr-1" />
                        <span>{idea.author.name}</span>
                        <span className="mx-2 text-gray-500">•</span>
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span className="text-gray-400">{getTimeAgo(idea.createdAt)}</span>
                      </div>
                    </div>
                    {session && (
                      <button
                        onClick={() => handleFavorite(idea.id)}
                        disabled={likingIdeas.has(idea.id)}
                        className={`p-2 rounded-full transition-all duration-200 ${
                          favorites.has(idea.id)
                            ? "text-red-500 hover:text-red-400 bg-red-500/10"
                            : "text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                        } ${likingIdeas.has(idea.id) ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {favorites.has(idea.id) ? (
                          <HeartSolidIcon className="h-5 w-5" />
                        ) : (
                          <HeartIcon className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {idea.description}
                  </p>
                  
                  {/* Metrics */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4 text-gray-400">
                      <div className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        <span>{idea.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <HeartIcon className="h-4 w-4 mr-1" />
                        <span>{idea.likes}</span>
                      </div>
                      <div className="text-green-400">
                        {idea.views > 0 ? `${((idea.likes / idea.views) * 100).toFixed(1)}%` : "0%"} engagement
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {["SaaS", "Web3", "AI"].slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full text-xs hover:bg-gray-600/50 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <nav className="flex space-x-2">
                  {pagination.page > 1 && (
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
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
                      className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
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