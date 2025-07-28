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
  PlusIcon
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

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
          <div className="hidden md:flex items-center space-x-8">
            {/* Public Links */}
            <Link
              href="/browse"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive("/browse")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              <span>Browse Ideas</span>
            </Link>

            {session ? (
              <>
                {/* Role-based Navigation */}
                {session.user.userType === "DEVELOPER" && (
                  <Link
                    href="/dashboard"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive("/dashboard")
                        ? "bg-green-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    <ChartBarIcon className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                )}

                {session.user.userType === "REGULAR" && (
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
                      <p className="text-xs text-gray-400 capitalize">
                        {session.user.userType.toLowerCase()}
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
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4">
            <div className="space-y-2">
              <Link
                href="/browse"
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive("/browse")
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
                <span>Browse Ideas</span>
              </Link>

              {session ? (
                <>
                  {session.user.userType === "DEVELOPER" && (
                    <Link
                      href="/dashboard"
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive("/dashboard")
                          ? "bg-green-600 text-white"
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ChartBarIcon className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                  )}

                  {session.user.userType === "REGULAR" && (
                    <Link
                      href="/favorites"
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive("/favorites")
                          ? "bg-red-600 text-white"
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <HeartIcon className="h-5 w-5" />
                      <span>Favorites</span>
                    </Link>
                  )}

                  <div className="border-t border-gray-800 pt-4 mt-4">
                    <div className="flex items-center space-x-3 px-3 py-2 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{session.user.name}</p>
                        <p className="text-xs text-gray-400 capitalize">
                          {session.user.userType.toLowerCase()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-3 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all w-full"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-800 pt-4 mt-4 space-y-2">
                  <Link
                    href="/login"
                    className="flex items-center justify-center px-3 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Get Started</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 