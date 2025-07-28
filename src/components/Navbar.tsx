"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  RocketLaunchIcon, 
  MagnifyingGlassIcon,
  HeartIcon,
  ChartBarIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  ArrowsRightLeftIcon
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const isDeveloperMode = pathname === "/dashboard";
  const isBrowseMode = pathname === "/browse" || pathname === "/favorites";

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <RocketLaunchIcon className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                Cherzs SaaS
              </h1>
              <p className="text-xs text-gray-400">Ideas Marketplace</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {session ? (
              <>
                {/* Mode Switch Buttons - Always visible when logged in */}
                <div className="flex items-center bg-gray-800/50 rounded-lg p-1 border border-gray-700">
                  {/* Browse Mode Button */}
                  <Link
                    href="/browse"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      isBrowseMode
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-400 hover:text-blue-400 hover:bg-gray-700/50"
                    }`}
                  >
                    <MagnifyingGlassIcon className="h-4 w-4" />
                    <span>Browse Ideas</span>
                  </Link>

                  {/* Developer Mode Button */}
                  <Link
                    href="/dashboard"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      isDeveloperMode
                        ? "bg-green-600 text-white shadow-lg"
                        : "text-gray-400 hover:text-green-400 hover:bg-gray-700/50"
                    }`}
                  >
                    <RocketLaunchIcon className="h-4 w-4" />
                    <span>Share Ideas</span>
                  </Link>
                </div>

                {/* Mode Switch Indicator */}
                {session && (
                  <div className="flex items-center space-x-2">
                    <ArrowsRightLeftIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {isDeveloperMode ? "Developer Mode" : "Browse Mode"}
                    </span>
                  </div>
                )}

                {/* Secondary Navigation based on current mode */}
                {isBrowseMode && session.user.userType === "REGULAR" && (
                  <Link
                    href="/favorites"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive("/favorites")
                        ? "bg-red-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    <HeartIcon className="h-4 w-4" />
                    <span>Favorites</span>
                  </Link>
                )}

                {/* User Menu */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 bg-gray-800 rounded-lg px-3 py-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-white" />
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-sm font-medium text-white">{session.user.name}</p>
                      <p className="text-xs text-gray-400">
                        {isDeveloperMode ? "🛠️ Developer" : "👤 Explorer"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    <span className="hidden lg:block">Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              /* Guest Links */
              <>
                <Link
                  href="/browse"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all"
                >
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  <span>Browse Ideas</span>
                </Link>
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center space-x-2"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Get Started</span>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800/50 backdrop-blur-sm rounded-lg mt-2 border border-gray-700">
              {session ? (
                <>
                  {/* Mobile Mode Switch */}
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-medium text-gray-400 px-3">Switch Mode</p>
                    <Link
                      href="/browse"
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        isBrowseMode
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:text-white hover:bg-gray-700"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <MagnifyingGlassIcon className="h-5 w-5" />
                      <span>Browse Ideas</span>
                    </Link>
                    <Link
                      href="/dashboard"
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        isDeveloperMode
                          ? "bg-green-600 text-white"
                          : "text-gray-300 hover:text-white hover:bg-gray-700"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <RocketLaunchIcon className="h-5 w-5" />
                      <span>Share Ideas</span>
                    </Link>
                  </div>

                  {/* Secondary Mobile Links */}
                  {isBrowseMode && session.user.userType === "REGULAR" && (
                    <Link
                      href="/favorites"
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        isActive("/favorites")
                          ? "bg-red-600 text-white"
                          : "text-gray-300 hover:text-white hover:bg-gray-700"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <HeartIcon className="h-5 w-5" />
                      <span>Favorites</span>
                    </Link>
                  )}

                  {/* User Info & Sign Out */}
                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex items-center px-3 py-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                        <UserIcon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{session.user.name}</p>
                        <p className="text-xs text-gray-400">
                          {isDeveloperMode ? "🛠️ Developer Mode" : "👤 Browse Mode"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 w-full transition-all"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                /* Mobile Guest Links */
                <>
                  <Link
                    href="/browse"
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <MagnifyingGlassIcon className="h-5 w-5" />
                    <span>Browse Ideas</span>
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserIcon className="h-5 w-5" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span>Get Started</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 