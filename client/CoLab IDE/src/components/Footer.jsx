import React from "react";
import { Code2, Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Product: ["Features", "How It Works", "Use Cases"],
    Legal: ["Privacy Policy", "Terms of Service", "Security"],
  };

  return (
    <footer className="bg-[#1a1c1e] border-t border-white/10 pt-24 pb-10 text-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">

          {/* Brand Section */}
          <div className="md:col-span-2">
            <a href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#ffaf01] rounded-lg flex items-center justify-center text-black">
                <Code2 className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                CoLab
              </span>
            </a>

            <p className="text-gray-400 max-w-sm leading-relaxed mb-6">
              AI-powered collaborative code editor for modern development
              teams. Code together, build faster.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-[#26282a] rounded-lg flex items-center justify-center text-gray-400 hover:bg-[#ffaf01] hover:text-black transition-all duration-300"
              >
                <Github className="w-5 h-5" />
              </a>

              <a
                href="#"
                className="w-10 h-10 bg-[#26282a] rounded-lg flex items-center justify-center text-gray-400 hover:bg-[#ffaf01] hover:text-black transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>

              <a
                href="#"
                className="w-10 h-10 bg-[#26282a] rounded-lg flex items-center justify-center text-gray-400 hover:bg-[#ffaf01] hover:text-black transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-lg font-semibold mb-6">
                {category}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#ffaf01] transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CoLab. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="text-gray-500 hover:text-[#ffaf01] transition-colors duration-300"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-[#ffaf01] transition-colors duration-300"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
