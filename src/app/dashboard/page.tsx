"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  PlusIcon, 
  ChartBarIcon, 
  UserIcon, 
  CogIcon,
  EyeIcon,
  HeartIcon,
  ArrowTrendingUpIcon,
  FireIcon,
  LightBulbIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

interface Idea {
  id: string;
  title: string;
  description: string;
  screenshots: string[];
  views: number;
  likes: number;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    screenshots: [] as string[]
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user.userType !== "DEVELOPER") {
      router.push("/browse");
      return;
    }

    fetchMyIdeas();
  }, [session, status, router]);

  const fetchMyIdeas = async () => {
    try {
      const response = await fetch("/api/ideas/my");
      const data = await response.json();
      setIdeas(data.ideas || []);
    } catch (error) {
      console.error("Error fetching ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadForm),
      });

      if (response.ok) {
        setUploadForm({ title: "", description: "", screenshots: [] });
        setShowUploadForm(false);
        fetchMyIdeas();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create idea");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const totalViews = ideas.reduce((sum, idea) => sum + idea.views, 0);
  const totalLikes = ideas.reduce((sum, idea) => sum + idea.likes, 0);
  const avgEngagement = ideas.length > 0 ? ((totalLikes / totalViews) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <RocketLaunchIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-sm text-gray-400">Manage your SaaS ideas</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-400">Welcome back,</p>
                <p className="text-white font-medium">{session.user.name}</p>
              </div>
              <button
                onClick={() => signOut()}
                className="text-gray-400 hover:text-white text-sm transition-colors px-3 py-2 rounded-md hover:bg-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to launch your next big idea?</h2>
              <p className="text-blue-100">Share your SaaS concepts and get feedback from the community</p>
            </div>
            <button
              onClick={() => setShowUploadForm(true)}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              New Idea
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <LightBulbIcon className="h-6 w-6 text-blue-400" />
                    <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">Total</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{ideas.length}</h3>
                  <p className="text-sm text-gray-400">Ideas Shared</p>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-600/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <EyeIcon className="h-6 w-6 text-green-400" />
                    <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">Views</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</h3>
                  <p className="text-sm text-gray-400">Total Views</p>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-600/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <HeartIcon className="h-6 w-6 text-purple-400" />
                    <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">Likes</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{totalLikes.toLocaleString()}</h3>
                  <p className="text-sm text-gray-400">Total Likes</p>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-600/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-orange-400" />
                    <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">Rate</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{avgEngagement}%</h3>
                  <p className="text-sm text-gray-400">Engagement</p>
                </div>
              </div>
            </div>

            {/* Upload Form */}
            {showUploadForm && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <SparklesIcon className="h-6 w-6 text-blue-400 mr-3" />
                    <h2 className="text-xl font-semibold text-white">Share New Idea</h2>
                  </div>
                  <button
                    onClick={() => setShowUploadForm(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleUploadSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                      What's your big idea?
                    </label>
                    <input
                      type="text"
                      id="title"
                      required
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                      placeholder="e.g., AI-powered customer support platform"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                      Tell us more about it
                    </label>
                    <textarea
                      id="description"
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                      placeholder="Describe your SaaS idea, target market, key features, and what makes it unique..."
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Publishing...
                        </>
                      ) : (
                        <>
                          <RocketLaunchIcon className="mr-2 h-4 w-4" />
                          Publish Idea
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUploadForm(false)}
                      className="bg-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Ideas List */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <FireIcon className="h-6 w-6 text-orange-400 mr-3" />
                  <h2 className="text-xl font-semibold text-white">My Ideas</h2>
                </div>
                {!showUploadForm && (
                  <button
                    onClick={() => setShowUploadForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add New
                  </button>
                )}
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-700 rounded-lg p-6">
                      <div className="h-4 bg-gray-600 rounded mb-3 w-3/4"></div>
                      <div className="h-3 bg-gray-600 rounded mb-2 w-1/2"></div>
                      <div className="h-3 bg-gray-600 rounded w-1/3"></div>
                    </div>
                  ))}
                </div>
              ) : ideas.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <LightBulbIcon className="h-12 w-12 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    No ideas yet? Let's change that!
                  </h3>
                  <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                    Share your first SaaS idea and start building your portfolio. The community is waiting to see what you create!
                  </p>
                  <button
                    onClick={() => setShowUploadForm(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
                  >
                    <SparklesIcon className="mr-2 h-5 w-5" />
                    Share Your First Idea
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {ideas.map((idea) => (
                    <div key={idea.id} className="bg-gray-700 border border-gray-600 rounded-lg p-6 hover:border-gray-500 transition-all duration-200 hover:shadow-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {idea.title}
                          </h3>
                          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                            {idea.description}
                          </p>
                        </div>
                        <div className="flex items-center text-xs text-gray-400 ml-4">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {new Date(idea.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center text-gray-400">
                            <EyeIcon className="h-4 w-4 mr-1" />
                            <span>{idea.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center text-gray-400">
                            <HeartIcon className="h-4 w-4 mr-1" />
                            <span>{idea.likes}</span>
                          </div>
                          <div className="flex items-center text-green-400">
                            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                            <span>{idea.views > 0 ? ((idea.likes / idea.views) * 100).toFixed(1) : 0}%</span>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                            View
                          </button>
                          <button className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors">
                            Edit
                          </button>
                          <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <nav className="space-y-3">
                <a
                  href="#"
                  className="flex items-center px-4 py-3 text-sm font-medium text-blue-400 bg-blue-900/20 rounded-lg border border-blue-700/30"
                >
                  <ChartBarIcon className="mr-3 h-5 w-5" />
                  Analytics
                </a>
                <a
                  href="#"
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <UserIcon className="mr-3 h-5 w-5" />
                  Profile
                </a>
                <a
                  href="#"
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <CogIcon className="mr-3 h-5 w-5" />
                  Settings
                </a>
              </nav>
            </div>

            {/* Tips & Insights */}
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-700/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">💡 Pro Tips</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-300">Add screenshots to increase engagement by 60%</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-300">Include target market in your description</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-300">Respond to comments to boost visibility</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 