import React, { useState, useEffect } from 'react';
import { Menu, X, Code2 } from 'lucide-react';
import { scrollTo } from '../utils/lenis';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#how-it-works' }, "",

  { name: 'Demo', href: '#demo' }];


  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    scrollTo(href, { offset: -80 });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'navbar-scrolled' : 'navbar-transparent'}`
      }>

      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2 group">
            <div className="logo-icon">
              <Code2 className="w-8 h-8" />
            </div>
            <span className="logo-text">CodeCollab AI</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) =>
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="nav-link !mx-[30px]">

                {link.name}
              </a>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="btn-ghost">Sign In</button>
            <button className="btn-primary">Start Coding</button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>

            {isMobileMenuOpen ?
            <X className="w-6 h-6 text-white" /> :

            <Menu className="w-6 h-6 text-white" />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen &&
      <div className="md:hidden mobile-menu">
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) =>
          <a
            key={link.name}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            className="block nav-link-mobile">

                {link.name}
              </a>
          )}
            <div className="pt-4 space-y-3">
              <button className="btn-ghost w-full">Sign In</button>
              <button className="btn-primary w-full">Start Coding</button>
            </div>
          </div>
        </div>
      }
    </nav>);

};

export default Navbar;