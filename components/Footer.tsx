import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const footerSections = [
    {
      title: "ABOUT",
      links: [
        { label: "Company", href: "/company" },
        { label: "Careers", href: "/careers" },
      ],
    },
    {
      title: "PRODUCTS",
      links: [
        { label: "RON", href: "/products/ron" },
        { label: "Digital Closing", href: "/products/digital-closing" },
        { label: "eSign", href: "/products/esign" },
        { label: "IPEN", href: "/products/ipen" },
      ],
    },
    {
      title: "FORMS",
      links: [
        { label: "Affidavit of Identity", href: "/forms/affidavit-of-identity" },
        { label: "Power of Attorney", href: "/forms/power-of-attorney" },
        { label: "PS-1583", href: "/forms/ps-1583" },
        { label: "DS-3053", href: "/forms/ds-3053" },
        { label: "Browse All Forms →", href: "/forms" },
      ],
    },
    {
      title: "RESOURCES",
      links: [
        { label: "Case Studies", href: "/case-studies" },
        { label: "Blog", href: "/blog" },
        { label: "Contact Us →", href: "/contact" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#FAF8F2] text-[#2C2B2B] px-6 sm:px-10 md:px-14 lg:px-16 pt-12 sm:pt-16 md:pt-20 pb-8 md:pb-10">
      <div className="max-w-[1440px] mx-auto flex flex-col">
        {/* Top: Giant BlueNotary Logo */}
        <div className="w-full mb-12 sm:mb-16 md:mb-20">
          <Link
            href="/"
            aria-label="BlueNotary Home"
            className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B40D5] rounded-md"
          >
            <Image
              src="/logo.svg"
              alt="BlueNotary"
              width={1376}
              height={222}
              priority
              className="w-full h-auto max-h-[140px] sm:max-h-[190px] md:max-h-[260px] lg:max-h-[320px] object-contain object-left pointer-events-none"
            />
          </Link>
        </div>

        {/* Middle: Links Columns */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 md:gap-6 mb-16 md:mb-24">
          {/* Spacer on large screens to push columns right like design */}
          <div className="hidden md:block md:col-span-3 lg:col-span-4" />

          {/* 4 Category Columns */}
          <div className="col-span-1 sm:col-span-2 md:col-span-9 lg:col-span-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {footerSections.map((section) => (
              <div key={section.title} className="flex flex-col">
                {/* Underlined Header */}
                <h2 className="text-xs md:text-[16px] font-bold tracking-wider text-[#2C2B2B] uppercase pb-2 mb-4 border-b border-[#2C2B2B]">
                  {section.title}
                </h2>

                {/* Link List */}
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[16px] text-[#3A3939] hover:text-[#3B40D5] transition-colors duration-150 font-normal inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright, Socials & Legal */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-5 pt-4 text-xs md:text-sm text-[#3A3939]">
          {/* Copyright */}
          <div>
            <span>© {new Date().getFullYear()} Blue Notary, LLC</span>
          </div>

          {/* Social Icons & Legal Links */}
          <div className="flex flex-wrap items-center gap-5 sm:gap-6">
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-[#2C2B2B] hover:text-[#3B40D5] transition-colors"
              >
                <svg
                  className="w-[18px] h-[18px] fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-[#2C2B2B] hover:text-[#3B40D5] transition-colors"
              >
                <svg
                  className="w-[18px] h-[18px] fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-[#2C2B2B] hover:text-[#3B40D5] transition-colors"
              >
                <svg
                  className="w-[20px] h-[20px] fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-5 sm:gap-6">
              <Link
                href="/terms"
                className="hover:text-[#3B40D5] transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="hover:text-[#3B40D5] transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
