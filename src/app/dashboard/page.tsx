"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { PlusIcon, ChartBarIcon, UserIcon, CogIcon } from "@heroicons/react/24/outline";

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
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">
                Welcome, {session.user.name}
              </span>
              <button
                onClick={() => signOut()}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <nav className="space-y-4">
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm font-medium text-blue-400 bg-blue-900/20 rounded-md"
                >
                  <ChartBarIcon className="mr-3 h-5 w-5" />
                  Overview
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                >
                  <UserIcon className="mr-3 h-5 w-5" />
                  Profile
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                >
                  <CogIcon className="mr-3 h-5 w-5" />
                  Settings
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-300">Total Ideas</h3>
                <p className="text-3xl font-bold text-blue-400">{ideas.length}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-300">Total Views</h3>
                <p className="text-3xl font-bold text-green-400">
                  {ideas.reduce((sum, idea) => sum + idea.views, 0)}
                </p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-300">Total Likes</h3>
                <p className="text-3xl font-bold text-purple-400">
                  {ideas.reduce((sum, idea) => sum + idea.likes, 0)}
                </p>
              </div>
            </div>

            {/* Upload New Idea */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">My Ideas</h2>
                <button
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Upload New Idea
                </button>
              </div>

              {showUploadForm && (
                <form onSubmit={handleUploadSubmit} className="mb-6 p-6 border border-gray-600 rounded-lg bg-gray-700">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                        Idea Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        required
                        className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white placeholder-gray-400"
                        placeholder="Enter your idea title"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        id="description"
                        required
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white placeholder-gray-400"
                        placeholder="Describe your SaaS idea..."
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={uploading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {uploading ? "Uploading..." : "Upload Idea"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowUploadForm(false)}
                        className="bg-gray-600 text-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Ideas List */}
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : ideas.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No ideas uploaded yet.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Start by uploading your first SaaS idea!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ideas.map((idea) => (
                    <div key={idea.id} className="border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors bg-gray-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {idea.title}
                          </h3>
                          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                            {idea.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>{idea.views} views</span>
                            <span>{idea.likes} likes</span>
                            <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                            Edit
                          </button>
                          <button className="text-red-400 hover:text-red-300 text-sm transition-colors">
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
        </div>
      </div>
    </div>
  );
} 