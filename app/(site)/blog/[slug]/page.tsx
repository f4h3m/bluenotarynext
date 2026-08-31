import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPostBySlug,
  getFeaturedPost,
  getSidebarRecentPosts,
  getReadNextPosts,
} from "@/lib/keystatic";
import TableOfContents from "@/components/blog/TableOfContents";
import BlogSidebar from "@/components/blog/BlogSidebar";
import ReadNextSection from "@/components/blog/ReadNextSection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SingleBlogPage({ params }: PageProps) {
  const { slug } = await params;

  // Retrieve post from Keystatic or fallback to featured
  const [postData, defaultFeatured, sidebarRecentPosts, readNextPosts] =
    await Promise.all([
      getPostBySlug(slug),
      getFeaturedPost(),
      getSidebarRecentPosts(4),
      getReadNextPosts(3),
    ]);

  const post = postData || defaultFeatured;

  const tocItems = [
    { id: "why-retention-periods-exist", title: "Why Retention Periods Exist in the First Place" },
    { id: "whose-job-to-store", title: "Whose Job Is It to Store the Recording?" },
    { id: "who-is-allowed-access", title: "Who Is Actually Allowed to Access It?" },
    { id: "how-recording-protected", title: "How the Recording Is Actually Protected" },
    { id: "choosing-ron-provider", title: "What This Means If You're Choosing a RON Provider" },
    { id: "frequently-asked-questions", title: "Frequently Asked Questions" },
  ];

  return (
    <div className="w-full bg-[#F7F6F1] px-6 sm:px-10 md:px-14 lg:px-16 py-8 sm:py-10 md:py-12">
      <div className="max-w-[1440px] mx-auto">
        {/* Top Hero Banner with Gradient Overlay & Inset Headline */}
        <div className="relative w-full aspect-[16/8] sm:aspect-[21/9] min-h-[300px] sm:min-h-[380px] md:min-h-[440px] rounded-xl sm:rounded-2xl overflow-hidden mb-10 md:mb-14 shadow-md">
          <Image
            src={post.imageUrl}
            alt={post.imageAlt || post.title}
            fill
            priority
            className="object-cover"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col justify-end p-6 sm:p-10 md:p-12">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white max-w-4xl leading-tight tracking-tight drop-shadow-md">
              {post.title}
            </h1>
            <div className="mt-4 text-xs sm:text-sm text-neutral-200 font-medium flex items-center gap-2">
              <span>By</span>
              <span className="text-white font-semibold">{post.author.name}</span>
              <span>|</span>
              <time dateTime={post.date}>{post.date}</time>
            </div>
          </div>
        </div>

        {/* Main 2-Column Article Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-start">
          {/* Left Column: Editorial Article Body */}
          <article className="lg:col-span-8 text-[#2C2B2B] leading-relaxed text-sm sm:text-base space-y-6">
            <p className="text-base sm:text-lg text-[#4A4944] leading-relaxed">
              Remote Online Notarization (RON) has transformed how legal agreements,
              real estate closings, and business contracts are executed. Because RON transactions
              involve an audio-video conference call between the notary and the signers,
              strict state laws regulate how these audio-visual recordings are stored,
              who can view them, and how long they must be preserved.
            </p>

            <p>
              If you’ve completed an online notarization or are planning to adopt{" "}
              <Link href="/ron" className="text-[#3B40D5] font-semibold underline hover:text-[#3035b8]">
                online notarization services
              </Link>
              , understanding the privacy, security, and retention lifecycle of your recording
              is essential for peace of mind.
            </p>

            {/* Table of Contents Box */}
            <TableOfContents items={tocItems} />

            {/* Section 1 */}
            <section id="why-retention-periods-exist" className="pt-4 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold text-[#232222] mb-3 tracking-tight">
                Why Retention Periods Exist in the First Place
              </h2>
              <p className="mb-4">
                In traditional paper notarizations, the notary’s physical journal served as the
                sole historical record of the event. With RON, the recorded session provides
                irrefutable proof that the signer was lucid, willing, and correctly identified
                through multi-layered credential analysis and knowledge-based authentication (KBA).
              </p>
              <p>
                State regulations mandate retention periods ranging from <strong>5 to 10 years</strong>{" "}
                (and up to 30 years in specific jurisdictions) to ensure evidence is available
                in the rare event of a legal dispute, title claim, or estate contest.
              </p>
            </section>

            {/* In-Article Image */}
            <div className="relative w-full aspect-[16/9] my-8 rounded-xl overflow-hidden bg-[#E5E3DB] shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80"
                alt="Notary stamp on document with ink pad"
                fill
                className="object-cover"
              />
            </div>

            {/* Section 2 */}
            <section id="whose-job-to-store" className="pt-4 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold text-[#232222] mb-3 tracking-tight">
                Whose Job Is It to Store the Recording?
              </h2>
              <p className="mb-4">
                The primary legal responsibility for retaining the recording rests with the
                commissioned notary public. However, because multi-gigabyte video files
                require secure cloud infrastructure, state-approved RON platforms like BlueNotary
                securely host and maintain the encrypted repository on the notary’s behalf.
              </p>
              <p>
                This ensures uninterrupted compliance even if a notary changes hardware,
                relocates, or retires during the mandated retention window.
              </p>
            </section>

            {/* Section 3 */}
            <section id="who-is-allowed-access" className="pt-4 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold text-[#232222] mb-3 tracking-tight">
                Who Is Actually Allowed to Access It?
              </h2>
              <p className="mb-4">
                RON recordings are strictly protected personal records and are not publicly searchable.
                Access is restricted to authorized parties:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#4A4944] pl-2 mb-4">
                <li>
                  <strong className="text-[#232222]">The Signers & Principal Parties:</strong> Signers
                  can request access to their transaction recording and journal entry.
                </li>
                <li>
                  <strong className="text-[#232222]">The Commissioned Notary:</strong> Has full administrative
                  access to audit their electronic journal.
                </li>
                <li>
                  <strong className="text-[#232222]">Law Enforcement & Subpoenas:</strong> Courts or law
                  enforcement agencies with valid legal authorization.
                </li>
                <li>
                  <strong className="text-[#232222]">State Notary Regulating Bodies:</strong> Secretary of
                  State auditing officials during compliance reviews.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="how-recording-protected" className="pt-4 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold text-[#232222] mb-3 tracking-tight">
                How the Recording Is Actually Protected
              </h2>
              <p className="mb-4">
                Leading RON platforms utilize enterprise-grade security protocols to protect audio-video
                recordings and biometric data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#4A4944] pl-2 mb-4">
                <li>End-to-end TLS 1.3 encryption during live video transmission.</li>
                <li>AES-256 bit encryption at rest in SOC 2 Type II certified cloud storage.</li>
                <li>Immutable, tamper-evident audit trails that log every access and download event.</li>
                <li>Multi-factor authentication (MFA) requirements for administrative access.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="choosing-ron-provider" className="pt-4 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold text-[#232222] mb-3 tracking-tight">
                What This Means If You're Choosing a RON Provider
              </h2>
              <p className="mb-4">
                Whether you are a solo notary, a title agency, or an enterprise lender, selecting a
                trusted RON provider like{" "}
                <Link href="/" className="text-[#3B40D5] font-semibold underline hover:text-[#3035b8]">
                  BlueNotary
                </Link>{" "}
                guarantees that your recordings meet statutory retention standards without recurring
                storage headaches.
              </p>
            </section>

            {/* Frequently Asked Questions */}
            <section id="frequently-asked-questions" className="pt-6 border-t border-[#D2D0C7]/60 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-bold text-[#232222] mb-6 tracking-tight">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                <div className="bg-[#FAF9F5] p-5 rounded-lg border border-[#D2D0C7]/60">
                  <h3 className="font-bold text-sm sm:text-base text-[#232222] mb-2">
                    How long do state laws require RON recordings to be kept?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#575651] leading-relaxed">
                    Most states require audio-visual recordings to be stored for a minimum of 5 to 10 years
                    following the date of notarization. Some states, like Florida and Texas, have specific 10-year rules.
                  </p>
                </div>

                <div className="bg-[#FAF9F5] p-5 rounded-lg border border-[#D2D0C7]/60">
                  <h3 className="font-bold text-sm sm:text-base text-[#232222] mb-2">
                    Can unauthorized third parties view my notarization video?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#575651] leading-relaxed">
                    No. RON session recordings are private, encrypted files that are only accessible by the notary,
                    the signing parties, and authorized regulatory or legal authorities.
                  </p>
                </div>

                <div className="bg-[#FAF9F5] p-5 rounded-lg border border-[#D2D0C7]/60">
                  <h3 className="font-bold text-sm sm:text-base text-[#232222] mb-2">
                    What happens if a notary stops practicing before the retention period ends?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#575651] leading-relaxed">
                    When using an approved platform like BlueNotary, recordings remain safely archived in the cloud
                    repository according to legal compliance mandates, even after a commission concludes.
                  </p>
                </div>
              </div>
            </section>

            {/* Category Tag */}
            <div className="pt-8 flex items-center gap-2">
              <span className="bg-[#EDECE6] text-[#4A4944] text-xs font-semibold px-3.5 py-1.5 rounded-full border border-[#D2D0C7]">
                #{post.category?.replace(/\s+/g, "") || "OnlineNotarization"}
              </span>
            </div>
          </article>

          {/* Right Column: Sticky Sidebar with Recent Posts & Dark CTA */}
          <div className="lg:col-span-4 sticky top-24">
            <BlogSidebar recentPosts={sidebarRecentPosts} />
          </div>
        </div>

        {/* Read Next Recommendation Cards */}
        <ReadNextSection posts={readNextPosts} />
      </div>
    </div>
  );
}
