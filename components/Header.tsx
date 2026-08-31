"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  /** Optional custom class for header container */
  className?: string;
}

interface MenuItem {
  label: string;
  href?: string;
  imageUrl: string;
  imageAlt: string;
  children?: { label: string; href: string; num: string }[];
}

export default function Header({ className = "" }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Store single active accordion so only one can be open at a time
  const [activeAccordion, setActiveAccordion] = useState<string | null>("PRODUCTS");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleAccordion = (label: string) => {
    setActiveAccordion((prev) => (prev === label ? null : label));
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 250);
  };

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isMenuOpen]);

  const navLinks = [
    { label: "PRICING", href: "/pricing" },
    { label: "TALK TO SALES", href: "/contact" },
    { label: "SIGN IN", href: "/login" },
  ];

  const sideMenuItems: MenuItem[] = [
    {
      label: "PRICING",
      href: "/pricing",
      imageUrl: "/images/navbar-pricing.png",
      imageAlt: "Pricing",
    },
    {
      label: "USE CASES",
      imageUrl: "/images/navbar-usecases.png",
      imageAlt: "Use Cases",
      children: [
        { label: "FOR LENDERS", href: "https://bluenotary.us/lenders", num: "01" },
        { label: "FOR TITLE", href: "/for-title-and-real-estate", num: "02" },
        { label: "FOR LAW FIRMS", href: "/for-law-firms", num: "03" },
        { label: "FOR BUSINESSES", href: "/for-businesses", num: "04" },
        { label: "FOR NOTARIES", href: "/for-notaries", num: "05" },
      ],
    },
    {
      label: "PRODUCTS",
      imageUrl: "/images/navbar-products.png",
      imageAlt: "Products",
      children: [
        { label: "RON", href: "/ron", num: "01" },
        { label: "DIGITAL CLOSING", href: "/eclosing", num: "02" },
        { label: "IPEN", href: "/in-person-notarization", num: "03" },
      ],
    },
    {
      label: "RESOURCES",
      imageUrl: "/images/navbar-resources.png",
      imageAlt: "Resources",
      children: [
        { label: "CASE STUDIES", href: "/case-studies/", num: "01" },
        { label: "BLOG", href: "/blog", num: "02" },
        { label: "FAQ", href: "/faq", num: "03" },
      ],
    },
    {
      label: "INTEGRATIONS",
      href: "/integrations",
      imageUrl: "/images/navbar-integration.png",
      imageAlt: "Integrations",
    },
    {
      label: "FORMS",
      href: "/form-templates",
      imageUrl: "/images/navbar-forms.png",
      imageAlt: "Forms",
    },
  ];

  return (
    <header
      className={`w-full bg-[#EBE9E1] border-b border-[#D2D0C7] text-[#2C2B2B] sticky top-0 z-50 ${className}`}
    >
      <div className="w-full flex items-center justify-between h-16 md:h-[68px]">
        {/* Left: Brand Logo */}
        <div className="h-full flex items-center pl-5 sm:pl-8 md:pl-10">
          <Link
            href="/"
            className="flex items-center group transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B40D5] rounded-sm"
            aria-label="BlueNotary Home"
          >
            <Image
              src="/logo.svg"
              alt="BlueNotary"
              width={160}
              height={26}
              priority
              className="h-6 md:h-7 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Right Navigation for Desktop */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center h-full"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="h-full flex items-center px-6 lg:px-8 border-l border-[#D2D0C7] text-[16px] font-semibold tracking-wider text-[#2C2B2B] hover:bg-black/[0.04] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#3B40D5]"
            >
              {link.label}
            </Link>
          ))}

          {/* Menu Button (= 2-bar icon) with Hover Trigger */}
          <div
            className="h-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              className="h-full flex items-center justify-center px-6 lg:px-7 border-l border-[#D2D0C7] hover:bg-black/[0.04] transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#3B40D5]"
            >
              <div className="flex flex-col justify-center items-center gap-[5px] w-5">
                <span
                  className={`block w-5 h-[2px] bg-[#2C2B2B] rounded-full transition-transform duration-200 ${
                    isMenuOpen ? "rotate-45 translate-y-[3.5px]" : ""
                  }`}
                />
                <span
                  className={`block w-5 h-[2px] bg-[#2C2B2B] rounded-full transition-transform duration-200 ${
                    isMenuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden h-full items-center">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            className="h-full flex items-center justify-center px-5 border-l border-[#D2D0C7] hover:bg-black/[0.04] transition-colors cursor-pointer focus:outline-none"
          >
            <div className="flex flex-col justify-center items-center gap-[5px] w-5">
              <span
                className={`block w-5 h-[2px] bg-[#2C2B2B] rounded-full transition-transform duration-200 ${
                  isMenuOpen ? "rotate-45 translate-y-[3.5px]" : ""
                }`}
              />
              <span
                className={`block w-5 h-[2px] bg-[#2C2B2B] rounded-full transition-transform duration-200 ${
                  isMenuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Slide-out Menu Drawer matching exact content */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isMenuOpen}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Drawer Panel */}
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`absolute top-0 right-0 h-full w-full max-w-[430px] bg-[#FAF9F5] border-l border-[#D2D0C7] shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out transform ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Scrollable Content Container */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Top Close Bar */}
            <div className="flex items-center justify-end h-14 sm:h-16 px-5 sm:px-6 border-b border-[#D2D0C7] shrink-0">
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
                className="p-2 -mr-2 rounded-md text-[#2C2B2B] hover:bg-black/5 transition-colors focus:outline-none cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Menu List Rows */}
            <div className="flex flex-col border-b border-[#D2D0C7]">
              {sideMenuItems.map((item) => {
                const hasChildren = Boolean(item.children && item.children.length > 0);
                const isExpanded = activeAccordion === item.label;

                if (hasChildren) {
                  return (
                    <div key={item.label} className="flex flex-col border-b border-[#D2D0C7]">
                      {/* Accordion Header Button */}
                      <button
                        type="button"
                        onClick={() => toggleAccordion(item.label)}
                        className="flex items-stretch w-full text-left bg-[#FAF9F5] hover:bg-black/[0.02] transition-colors cursor-pointer group"
                      >
                        {/* Left Image Thumbnail */}
                        <div className="relative w-16 sm:w-20 min-h-[58px] shrink-0 overflow-hidden border-r border-[#D2D0C7] bg-[#3B40D5]">
                          <Image
                            src={item.imageUrl}
                            alt={item.imageAlt}
                            fill
                            sizes="80px"
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>

                        {/* Middle Label */}
                        <div className="flex-1 flex items-center px-4 sm:px-5 py-4 text-[16px] font-medium tracking-wider text-[#2C2B2B] group-hover:text-[#3B40D5] uppercase transition-colors">
                          {item.label}
                        </div>

                        {/* Right Plus / Minus Icon with Smooth Rotation */}
                        <div className="w-[57px] shrink-0 border-l border-[#D2D0C7] flex items-center justify-center text-xl font-light text-[#2C2B2B]">
                          <span
                            className={`inline-block transition-transform duration-300 ease-out select-none ${
                              isExpanded ? "rotate-45 text-[#3B40D5]" : "rotate-0"
                            }`}
                          >
                            +
                          </span>
                        </div>
                      </button>

                      {/* Smooth Transition Collapse Sub-items */}
                      <div
                        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                          isExpanded
                            ? "grid-rows-[1fr] opacity-100 border-t border-[#D2D0C7]"
                            : "grid-rows-[0fr] opacity-0 border-t-0"
                        }`}
                      >
                        <div className="overflow-hidden bg-[#F6F4EE]">
                          {item.children!.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-stretch border-b border-[#D2D0C7] last:border-b-0 hover:bg-black/[0.03] transition-colors group"
                            >
                              <div className="flex-grow pl-6 sm:pl-8 pr-4 py-3.5 text-[16px] tracking-wider text-[#2C2B2B] group-hover:text-[#3B40D5] uppercase transition-colors">
                                {child.label}
                              </div>
                              <div
                                className="border-l border-[#D2D0C7] flex items-center justify-center text-[16px] font-medium text-[#61605C] bg-[#FAF9F5]"
                                style={{ width: "57px" }}
                              >
                                {child.num}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Single Navigation Item Row
                return (
                  <div
                    key={item.label}
                    className="flex items-stretch border-b border-[#D2D0C7] bg-[#FAF9F5] hover:bg-black/[0.02] transition-colors group"
                  >
                    {/* Left Image Thumbnail */}
                    <div className="relative w-16 sm:w-20 min-h-[58px] shrink-0 overflow-hidden border-r border-[#D2D0C7] bg-[#3B40D5]">
                      <Image
                        src={item.imageUrl}
                        alt={item.imageAlt}
                        fill
                        sizes="80px"
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Middle Label Link */}
                    <Link
                      href={item.href || "#"}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1 flex items-center px-4 sm:px-5 py-4 text-[16px] font-bold tracking-wider text-[#2C2B2B] group-hover:text-[#3B40D5] uppercase transition-colors"
                    >
                      {item.label}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-5 sm:p-6 border-t border-[#D2D0C7] bg-[#FAF9F5] shrink-0">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Link
                href="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-3.5 px-3 text-center text-[16px] font-bold tracking-wider text-[#2C2B2B] bg-transparent border border-[#2C2B2B] hover:bg-black/5 transition-colors uppercase"
              >
                <span>SIGN UP</span>
                <span className="text-sm font-normal">→</span>
              </Link>
              <Link
                href="/notarize"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-3.5 px-3 text-center text-[16px] font-bold tracking-wider text-white bg-[#3B40D5] hover:bg-[#3035b8] transition-colors shadow-xs uppercase"
              >
                <span>NOTARIZE NOW</span>
                <span className="text-sm font-normal">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
