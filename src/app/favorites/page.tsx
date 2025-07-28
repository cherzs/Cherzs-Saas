"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { HeartIcon, EyeIcon, CalendarIcon, UserIcon } from "@heroicons/react/24/outline";

interface FavoriteIdea {
  id: string;
  title: string;
  description: string;
  screenshots: string[];
  views: number;
  likes: number;
  createdAt: string;
  favoritedAt: string;
  author: {
    id: string;
    name: string;
    image: string | null;
    userType: string;
  };
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteIdea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
      return;
    }

    fetchFavorites();
  }, [session, status, router]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch("/api/favorites");
      const data = await response.json();
      
      if (response.ok) {
        setFavorites(data.favorites);
      } else {
        console.error("Error fetching favorites:", data.error);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (ideaId: string) => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}/favorite`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFavorites(prev => prev.filter(fav => fav.id !== ideaId));
      } else {
        console.error("Error removing favorite");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      {/* Page Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                <HeartIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">My Favorites</h1>
                <p className="text-sm text-gray-400">Ideas you've saved for later</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href="/browse"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Browse More Ideas
              </Link>
              <div className="text-right">
                <p className="text-sm text-gray-400">Welcome,</p>
                <p className="text-white font-medium">{session.user.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
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
        ) : favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <HeartIcon className="h-12 w-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-400 mb-6 max-w-sm mx-auto">
              Start exploring ideas and save the ones you love by clicking the heart icon
            </p>
            <Link
              href="/browse"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Browse Ideas
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-red-900/20 to-pink-900/20 border border-red-700/30 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {favorites.length} Saved Ideas
                    </h2>
                    <p className="text-gray-300">
                      Keep track of ideas that inspire you
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-red-400">
                      {favorites.reduce((sum, fav) => sum + fav.likes, 0)}
                    </div>
                    <div className="text-gray-400 text-sm">Total Likes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((idea) => (
                <div
                  key={idea.id}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Link href={`/ideas/${idea.id}`}>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors cursor-pointer">
                          {idea.title}
                        </h3>
                      </Link>
                      <div className="flex items-center text-blue-400 text-sm mb-3">
                        <UserIcon className="h-4 w-4 mr-1" />
                        <span>{idea.author.name}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFavorite(idea.id)}
                      className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-red-500/10 transition-all"
                      title="Remove from favorites"
                    >
                      <HeartIcon className="h-5 w-5 fill-current" />
                    </button>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {idea.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    <span>{idea.views.toLocaleString()}</span>
                    <span className="mx-2">•</span>
                    <HeartIcon className="h-4 w-4 mr-1" />
                    <span>{idea.likes}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>Saved {new Date(idea.favoritedAt).toLocaleDateString()}</span>
                    </div>
                    <span>
                      Created {new Date(idea.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Connect CTA */}
            <div className="mt-12 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Connect with Creators?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Reach out to the brilliant minds behind these ideas. Collaborate, provide feedback, or explore partnership opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/browse"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Discover More Ideas
                </Link>
                <button className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
                  Connect with Creators
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 