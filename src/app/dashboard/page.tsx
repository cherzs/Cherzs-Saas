"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { signOut } from "next-auth/react";
import {
  RocketLaunchIcon,
  PlusIcon,
  EyeIcon,
  HeartIcon,
  ChartBarIcon,
  LightBulbIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

interface Screenshot {
  name: string;
  data: string;
  type: string;
}

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

  // Function to convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    screenshots: [] as Screenshot[]
  });
  const [uploading, setUploading] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    screenshots: [] as Screenshot[]
  });
  const [deletingIdea, setDeletingIdea] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
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
      // Convert screenshots to base64 strings for storage
      const screenshotsData = uploadForm.screenshots.map(screenshot => screenshot.data);
      
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...uploadForm,
          screenshots: screenshotsData
        }),
      });

      if (response.ok) {
        setUploadForm({ title: "", description: "", screenshots: [] as Screenshot[] });
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

  const handleEdit = (idea: Idea) => {
    setEditingIdea(idea);
    setEditForm({
      title: idea.title,
      description: idea.description,
      screenshots: idea.screenshots.map((screenshot, index) => ({
        name: `Screenshot ${index + 1}`,
        data: screenshot,
        type: 'image/png'
      }))
    });
    setShowEditForm(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIdea) return;

    setUploading(true);
    try {
      const screenshotsData = editForm.screenshots.map(screenshot => screenshot.data);
      
      const response = await fetch(`/api/ideas/${editingIdea.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editForm,
          screenshots: screenshotsData
        }),
      });

      if (response.ok) {
        setEditForm({ title: "", description: "", screenshots: [] as Screenshot[] });
        setShowEditForm(false);
        setEditingIdea(null);
        fetchMyIdeas();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update idea");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (ideaId: string) => {
    if (!confirm("Are you sure you want to delete this idea? This action cannot be undone.")) {
      return;
    }

    setDeletingIdea(ideaId);
    try {
      const response = await fetch(`/api/ideas/${ideaId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchMyIdeas();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete idea");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setDeletingIdea(null);
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
      <Navbar />
      
      {/* Dashboard Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Creator Dashboard</h1>
                <p className="text-gray-400">Manage and track your SaaS ideas</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Welcome back, {session.user.name} 👋</p>
            </div>
          </div>
        </div>
      </div>

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
                    <ArrowRightIcon className="h-6 w-6 text-orange-400" />
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
                    <RocketLaunchIcon className="h-6 w-6 text-blue-400 mr-3" />
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
                  
                  <div>
                    <label htmlFor="screenshots" className="block text-sm font-medium text-gray-300 mb-2">
                      Add Screenshots (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                      <input
                        type="file"
                        id="screenshots"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          const newScreenshots = [];
                          
                          for (const file of files) {
                            try {
                              const base64 = await convertFileToBase64(file);
                              newScreenshots.push({
                                name: file.name,
                                data: base64,
                                type: file.type
                              });
                            } catch (error) {
                              console.error('Error converting file:', error);
                            }
                          }
                          
                          setUploadForm({ 
                            ...uploadForm, 
                            screenshots: [...uploadForm.screenshots, ...newScreenshots] 
                          });
                        }}
                      />
                      <label htmlFor="screenshots" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <p className="text-gray-300 font-medium">Click to upload images</p>
                          <p className="text-gray-400 text-sm mt-1">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </label>
                    </div>
                    {uploadForm.screenshots.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-400 mb-2">Selected files:</p>
                        <div className="flex flex-wrap gap-2">
                          {uploadForm.screenshots.map((screenshot, index) => (
                            <div key={index} className="bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-300 flex items-center">
                              {screenshot.name}
                              <button
                                type="button"
                                onClick={() => setUploadForm({
                                  ...uploadForm,
                                  screenshots: uploadForm.screenshots.filter((_, i) => i !== index)
                                })}
                                className="ml-2 text-red-400 hover:text-red-300"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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

            {/* Edit Form */}
            {showEditForm && editingIdea && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <RocketLaunchIcon className="h-6 w-6 text-yellow-400 mr-3" />
                    <h2 className="text-xl font-semibold text-white">Edit Idea</h2>
                  </div>
                  <button
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingIdea(null);
                      setEditForm({ title: "", description: "", screenshots: [] as Screenshot[] });
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="edit-title" className="block text-sm font-medium text-gray-300 mb-2">
                      What's your big idea?
                    </label>
                    <input
                      type="text"
                      id="edit-title"
                      required
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                      placeholder="e.g., AI-powered customer support platform"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-description" className="block text-sm font-medium text-gray-300 mb-2">
                      Tell us more about it
                    </label>
                    <textarea
                      id="edit-description"
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                      placeholder="Describe your SaaS idea, target market, key features, and what makes it unique..."
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-screenshots" className="block text-sm font-medium text-gray-300 mb-2">
                      Update Screenshots (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                      <input
                        type="file"
                        id="edit-screenshots"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          const newScreenshots = [];
                          
                          for (const file of files) {
                            try {
                              const base64 = await convertFileToBase64(file);
                              newScreenshots.push({
                                name: file.name,
                                data: base64,
                                type: file.type
                              });
                            } catch (error) {
                              console.error('Error converting file:', error);
                            }
                          }
                          
                          setEditForm({ 
                            ...editForm, 
                            screenshots: [...editForm.screenshots, ...newScreenshots] 
                          });
                        }}
                      />
                      <label htmlFor="edit-screenshots" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <p className="text-gray-300 font-medium">Click to upload images</p>
                          <p className="text-gray-400 text-sm mt-1">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </label>
                    </div>
                    {editForm.screenshots.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-400 mb-2">Selected files:</p>
                        <div className="flex flex-wrap gap-2">
                          {editForm.screenshots.map((screenshot, index) => (
                            <div key={index} className="bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-300 flex items-center">
                              {screenshot.name}
                              <button
                                type="button"
                                onClick={() => setEditForm({
                                  ...editForm,
                                  screenshots: editForm.screenshots.filter((_, i) => i !== index)
                                })}
                                className="ml-2 text-red-400 hover:text-red-300"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 disabled:opacity-50 transition-colors flex items-center"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <RocketLaunchIcon className="mr-2 h-4 w-4" />
                          Update Idea
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditForm(false);
                        setEditingIdea(null);
                        setEditForm({ title: "", description: "", screenshots: [] as Screenshot[] });
                      }}
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
                  <RocketLaunchIcon className="h-6 w-6 text-orange-400 mr-3" />
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
                    <RocketLaunchIcon className="mr-2 h-5 w-5" />
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
                          
                          {/* Screenshots Preview */}
                          {idea.screenshots && idea.screenshots.length > 0 && (
                            <div className="mb-4">
                              <div className="flex space-x-2 overflow-x-auto">
                                {idea.screenshots.slice(0, 3).map((screenshot, index) => (
                                  <div key={index} className="flex-shrink-0 w-20 h-20 bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                                    {screenshot.startsWith('data:') ? (
                                      <img 
                                        src={screenshot} 
                                        alt={`Screenshot ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-gray-400 text-xs">📷</span>
                                    )}
                                  </div>
                                ))}
                                {idea.screenshots.length > 3 && (
                                  <div className="flex-shrink-0 w-20 h-20 bg-gray-600 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">+{idea.screenshots.length - 3}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center text-xs text-gray-400 ml-4">
                          <RocketLaunchIcon className="h-4 w-4 mr-1" />
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
                            <ArrowRightIcon className="h-4 w-4 mr-1" />
                            <span>{idea.views > 0 ? ((idea.likes / idea.views) * 100).toFixed(1) : 0}%</span>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <Link
                            href={`/ideas/${idea.id}?from=dashboard`}
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                          >
                            View
                          </Link>
                          <button 
                            onClick={() => handleEdit(idea)}
                            className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(idea.id)}
                            disabled={deletingIdea === idea.id}
                            className={`text-red-400 hover:text-red-300 text-sm font-medium transition-colors ${
                              deletingIdea === idea.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {deletingIdea === idea.id ? 'Deleting...' : 'Delete'}
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
                  <RocketLaunchIcon className="mr-3 h-5 w-5" />
                  Profile
                </a>
                <a
                  href="#"
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <RocketLaunchIcon className="mr-3 h-5 w-5" />
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

      {/* Idea Detail Modal */}
      {showDetailModal && selectedIdea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <RocketLaunchIcon className="h-6 w-6 text-blue-400 mr-3" />
                  <h2 className="text-2xl font-bold text-white">Idea Details</h2>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-white transition-colors text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{selectedIdea.title}</h3>
                  <p className="text-gray-400 text-sm">
                    Created on {new Date(selectedIdea.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">Description</h4>
                  <p className="text-gray-300 leading-relaxed">{selectedIdea.description}</p>
                </div>

                {/* Screenshots */}
                {selectedIdea.screenshots && selectedIdea.screenshots.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Screenshots</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedIdea.screenshots.map((screenshot, index) => (
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

                {/* Statistics */}
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">Performance</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-white">{selectedIdea.views.toLocaleString()}</div>
                      <div className="text-gray-400 text-sm">Views</div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-white">{selectedIdea.likes}</div>
                      <div className="text-gray-400 text-sm">Likes</div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-white">
                        {selectedIdea.views > 0 ? ((selectedIdea.likes / selectedIdea.views) * 100).toFixed(1) : 0}%
                      </div>
                      <div className="text-gray-400 text-sm">Engagement</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-4 pt-4 border-t border-gray-700">
                  <Link
                    href={`/ideas/${selectedIdea.id}?from=dashboard`}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    View Full
                  </Link>
                  <button className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors">
                    Edit Idea
                  </button>
                  <button className="bg-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 transition-colors">
                    Share
                  </button>
                  <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 