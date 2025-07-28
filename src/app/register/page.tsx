"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  MagnifyingGlassIcon, 
  RocketLaunchIcon,
  UserIcon,
  LightBulbIcon
} from "@heroicons/react/24/outline";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "REGULAR"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
      } else {
        router.push("/login?message=Registration successful");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserTypeChange = (userType: string) => {
    setFormData({
      ...formData,
      userType,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{" "}
            <Link
              href="/login"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              sign in to your account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            {/* User Type Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Choose your journey
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Regular User Option */}
                <button
                  type="button"
                  onClick={() => handleUserTypeChange("REGULAR")}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                    formData.userType === "REGULAR"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      formData.userType === "REGULAR"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-gray-400"
                    }`}>
                      <MagnifyingGlassIcon className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-semibold transition-colors ${
                        formData.userType === "REGULAR" ? "text-blue-400" : "text-gray-300"
                      }`}>
                        Regular User
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Browse Ideas
                      </div>
                    </div>
                  </div>
                  {formData.userType === "REGULAR" && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Developer Option */}
                <button
                  type="button"
                  onClick={() => handleUserTypeChange("DEVELOPER")}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                    formData.userType === "DEVELOPER"
                      ? "border-green-500 bg-green-500/10"
                      : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      formData.userType === "DEVELOPER"
                        ? "bg-green-500 text-white"
                        : "bg-gray-700 text-gray-400"
                    }`}>
                      <RocketLaunchIcon className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-semibold transition-colors ${
                        formData.userType === "DEVELOPER" ? "text-green-400" : "text-gray-300"
                      }`}>
                        Developer
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Share Ideas
                      </div>
                    </div>
                  </div>
                  {formData.userType === "DEVELOPER" && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
              
              {/* Description for selected type */}
              <div className="mt-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                {formData.userType === "REGULAR" ? (
                  <div className="flex items-start space-x-3">
                    <UserIcon className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-400 font-medium">Regular User</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Perfect for exploring innovative SaaS ideas, saving favorites, and discovering new solutions.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start space-x-3">
                    <LightBulbIcon className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-green-400 font-medium">Developer</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Share your SaaS ideas, get feedback from the community, and connect with potential collaborators.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 