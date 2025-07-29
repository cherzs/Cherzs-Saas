"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  ArrowLeftIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  CalendarIcon,
  UserIcon,
  RocketLaunchIcon,
  ChatBubbleLeftRightIcon,
  BookmarkIcon
} from "@heroicons/react/24/outline";

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
    image?: string;
    userType: string;
  };
}

export default function IdeaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Get the source page from URL parameters
  const source = searchParams.get('from') || 'browse';

  useEffect(() => {
    if (params.id) {
      fetchIdeaDetails();
    }
  }, [params.id]);

  const fetchIdeaDetails = async () => {
    try {
      const response = await fetch(`/api/ideas/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setIdea(data.idea);
      } else {
        setError("Idea not found");
      }
    } catch (error) {
      setError("Failed to load idea");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`/api/ideas/${params.id}/like`, {
        method: "POST",
      });
      if (response.ok) {
        setIsLiked(!isLiked);
        if (idea) {
          setIdea({
            ...idea,
            likes: isLiked ? idea.likes - 1 : idea.likes + 1,
          });
        }
      }
    } catch (error) {
      console.error("Error liking idea:", error);
    }
  };

  const handleFavorite = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`/api/ideas/${params.id}/favorite`, {
        method: "POST",
      });
      if (response.ok) {
        setIsFavorited(!isFavorited);
      }
    } catch (error) {
      console.error("Error favoriting idea:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-700 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-700 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <RocketLaunchIcon className="h-12 w-12 text-gray-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Idea Not Found</h1>
            <p className="text-gray-400 mb-6">
              The idea you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/browse"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <ArrowLeftIcon className="mr-2 h-5 w-5" />
              Browse Ideas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href={
              source === 'dashboard' ? '/dashboard' : 
              source === 'favorites' ? '/favorites' : 
              '/browse'
            }
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to {
              source === 'dashboard' ? 'Dashboard' : 
              source === 'favorites' ? 'Favorites' : 
              'Browse'
            }
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">{idea.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      <span>{idea.author.name}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleFavorite}
                    className={`p-2 rounded-lg transition-colors ${
                      isFavorited
                        ? "bg-red-600 text-white"
                        : "bg-gray-700 text-gray-400 hover:text-white hover:bg-gray-600"
                    }`}
                  >
                    <BookmarkIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 bg-gray-700 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors">
                    <ShareIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center text-gray-400">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  <span>{idea.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <HeartIcon className="h-4 w-4 mr-1" />
                  <span>{idea.likes} likes</span>
                </div>
                <div className="flex items-center text-green-400">
                  <span>{idea.views > 0 ? ((idea.likes / idea.views) * 100).toFixed(1) : 0}% engagement</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{idea.description}</p>
            </div>

            {/* Screenshots */}
            {idea.screenshots && idea.screenshots.length > 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">Screenshots</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {idea.screenshots.map((screenshot, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4">
                      <div className="w-full h-48 bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                        {screenshot.startsWith('data:') ? (
                          <img 
                            src={screenshot} 
                            alt={`Screenshot ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">Screenshot {index + 1}</span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mt-2">
                        {screenshot.startsWith('data:') ? `Screenshot ${index + 1}` : screenshot}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400 mr-2" />
                <h2 className="text-xl font-semibold text-white">Comments</h2>
              </div>
              <div className="text-center py-8">
                <p className="text-gray-400">Comments coming soon!</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Like Button */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
              <button
                onClick={handleLike}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                  isLiked
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                }`}
              >
                <HeartIcon className="h-5 w-5 mr-2" />
                {isLiked ? "Liked" : "Like"}
              </button>
            </div>

            {/* Author Info */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">About the Creator</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">{idea.author.name}</p>
                  <p className="text-gray-400 text-sm">
                    {idea.author.userType === "DEVELOPER" ? "🛠️ Creator" : "👤 Explorer"}
                  </p>
                </div>
              </div>
            </div>

            {/* Related Ideas */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Related Ideas</h3>
              <div className="text-center py-8">
                <p className="text-gray-400">More ideas coming soon!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 