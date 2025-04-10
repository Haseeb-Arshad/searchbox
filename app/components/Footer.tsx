import { Link } from "@remix-run/react";
import { Heart, Instagram, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
        { label: "API", href: "/api" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "Help Center", href: "/help" },
        { label: "Status", href: "/status" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: "https://twitter.com", label: "Twitter" },
    { icon: <Instagram className="h-5 w-5" />, href: "https://instagram.com", label: "Instagram" },
    { icon: <Linkedin className="h-5 w-5" />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <Mail className="h-5 w-5" />, href: "mailto:contact@quickfind.com", label: "Email" },
  ];

  return (
    <footer className="bg-surface-light dark:bg-surface-dark border-t border-zinc-200 dark:border-zinc-800 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo and description */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-primary">
                QuickFind
              </span>
            </Link>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              Discover amazing products from across the web. Fast, intuitive, and beautiful.
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title} className="col-span-1">
              <h3 className="font-medium text-zinc-900 dark:text-white">{group.title}</h3>
              <ul className="mt-4 space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Lower footer */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center md:text-left">
            © {year} QuickFind. All rights reserved.
          </p>

          {/* Social links */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Built with love */}
        <div className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-500 flex items-center justify-center">
          Built with <Heart className="h-3 w-3 mx-1 text-accent-pink" /> using Remix
        </div>
      </div>
    </footer>
  );
} 