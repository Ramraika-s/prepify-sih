import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Define the valid static slugs
const LEGAL_PAGES = {
  privacy: {
    title: "Privacy Policy",
    description: "How Prepify collects, uses, and protects your data.",
    content: "This is a placeholder for the Privacy Policy. We take data security and privacy seriously.",
  },
  terms: {
    title: "Terms of Service",
    description: "The rules and guidelines for using the Prepify platform.",
    content: "This is a placeholder for the Terms of Service. By using our platform, you agree to these terms.",
  },
  security: {
    title: "Security Audit",
    description: "Details regarding Prepify's enterprise-grade security posture.",
    content: "This is a placeholder for our Security Audit reports. We maintain strict compliance and RBAC.",
  },
  compliance: {
    title: "Compliance",
    description: "Our adherence to global and educational data regulations.",
    content: "This is a placeholder for Compliance information (e.g., SOC2, GDPR equivalents for educational data).",
  },
};

type Slug = keyof typeof LEGAL_PAGES;

export const dynamicParams = false;

export async function generateStaticParams() {
  return Object.keys(LEGAL_PAGES).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = LEGAL_PAGES[slug as Slug];
  
  if (!page) {
    return {
      title: "Page Not Found | Prepify",
    };
  }

  return {
    title: `${page.title} | Prepify`,
    description: page.description,
  };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = LEGAL_PAGES[slug as Slug];

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white py-24 px-6 md:px-12 overflow-hidden relative">
      <div className="absolute top-[20%] left-1/4 w-[600px] h-[600px] bg-zinc-800/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        <header className="space-y-4 border-b border-white/10 pb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">{page.title}</h1>
          <p className="text-xl text-zinc-400 font-light">{page.description}</p>
        </header>

        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-2xl">
          <div className="prose prose-invert max-w-none">
            <p className="text-zinc-300 font-light leading-relaxed text-lg">
              {page.content}
            </p>
            <p className="text-zinc-500 text-sm mt-12">
              Last updated: August 2026
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
