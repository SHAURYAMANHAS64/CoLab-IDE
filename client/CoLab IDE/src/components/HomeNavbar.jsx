import React, { useState, useContext, useRef, useEffect } from "react";
import { LogOut, User, Code2, Menu, X } from "lucide-react";
import { userContext } from "../context/user.context";
import { useNavigate } from "react-router-dom";

const HomeNavbar = () => {
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#ffaf01]/20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2 group">
            <div className="logo-icon">
              <Code2 className="w-8 h-8 text-[#ffaf01]" />
            </div>
            <span className="text-xl font-bold text-white group-hover:text-[#ffaf01] transition-colors">
              Co<span className="text-[#ffaf01]">Lab</span>
            </span>
          </a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white hover:text-[#ffaf01] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Profile Section - Desktop */}
          <div className="hidden md:flex items-center">
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#ffaf01]/10 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffaf01] to-[#d49204] flex items-center justify-center">
                  <User className="w-6 h-6 text-black" />
                </div>
                <span className="text-white text-sm font-medium hidden lg:inline">
                  {user?.email?.split("@")[0] || "Profile"}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#ffaf01]/30 rounded-lg shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#ffaf01]/20">
                    <p className="text-white text-sm font-medium">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-400/10 transition-colors text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-[#ffaf01]/20">
            <div className="px-2 py-3 space-y-2">
              <div className="px-4 py-3 rounded-lg bg-[#1a1a1a] border border-[#ffaf01]/30">
                <p className="text-white text-sm font-medium">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-400/10 transition-colors text-sm rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default HomeNavbar;
