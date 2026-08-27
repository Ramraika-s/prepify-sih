import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Define the valid static slugs
const LEGAL_PAGES = {
  privacy: {
    title: "Privacy Policy",
    description: "How Quero collects, uses, and protects your data.",
    sections: [
      {
        heading: "1. Information We Collect",
        paragraphs: [
          "We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.",
          "This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide."
        ]
      },
      {
        heading: "2. How We Use Your Information",
        paragraphs: [
          "We use the information we collect to provide, maintain, and improve our services. This includes using the information to: create and update your account; verify your identity; process your payments; and personalize the services you receive.",
          "We also use the information to perform internal operations necessary to provide our services, including to troubleshoot software bugs and operational problems; to conduct data analysis, testing, and research; and to monitor and analyze usage and activity trends."
        ]
      },
      {
        heading: "3. Sharing of Information",
        paragraphs: [
          "We do not share your personal information with third parties without your consent, except in the following circumstances: with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf; in response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process."
        ]
      }
    ]
  },
  terms: {
    title: "Terms of Service",
    description: "The rules and guidelines for using the Quero platform.",
    sections: [
      {
        heading: "1. Acceptance of Terms",
        paragraphs: [
          "By accessing and using the Quero platform, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.",
          "Any participation in this service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this service."
        ]
      },
      {
        heading: "2. User Conduct",
        paragraphs: [
          "You agree to use the service only for lawful purposes. You agree not to take any action that might compromise the security of the site, render the site inaccessible to others, or otherwise cause damage to the site or the content.",
          "You agree not to add to, subtract from, or otherwise modify the content, or to attempt to access any content that is not intended for you."
        ]
      },
      {
        heading: "3. Intellectual Property Rights",
        paragraphs: [
          "The site and its original content, features, and functionality are owned by Quero and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws."
        ]
      }
    ]
  },
  security: {
    title: "Security Audit",
    description: "Details regarding Quero's enterprise-grade security posture.",
    sections: [
      {
        heading: "1. Infrastructure Security",
        paragraphs: [
          "Quero leverages enterprise-grade cloud providers with SOC 2 Type II compliance. All data is encrypted at rest using AES-256 encryption and in transit using TLS 1.3.",
          "We employ multi-layered network security, including web application firewalls (WAF), DDoS protection, and strict VPC peering rules to isolate our databases from public internet access."
        ]
      },
      {
        heading: "2. Application Security & RBAC",
        paragraphs: [
          "Our platform utilizes an Edge-runtime middleware proxy alongside Supabase Custom JWT Claims to enforce strict Role-Based Access Control (RBAC). This ensures that data access is cryptographically verified at the edge before any database query is executed.",
          "All API mutations are protected by Zod schemas to prevent injection attacks and ensure strict data validation."
        ]
      },
      {
        heading: "3. Vulnerability Management",
        paragraphs: [
          "We conduct continuous automated vulnerability scanning on our dependencies and container images. Furthermore, we mandate annual third-party penetration testing and maintain a responsible disclosure bug bounty program."
        ]
      }
    ]
  },
  compliance: {
    title: "Compliance",
    description: "Our adherence to global and educational data regulations.",
    sections: [
      {
        heading: "1. Data Protection & GDPR",
        paragraphs: [
          "Quero is committed to compliance with the General Data Protection Regulation (GDPR) and similar global privacy frameworks. We provide our users with the ability to export their data, request deletion, and explicitly manage their consent preferences.",
          "We have appointed a Data Protection Officer (DPO) to oversee our privacy strategies and ensure all processing activities respect user rights."
        ]
      },
      {
        heading: "2. Educational Regulations (FERPA & COPPA)",
        paragraphs: [
          "For our users in the United States, Quero complies fully with the Family Educational Rights and Privacy Act (FERPA). We implement strict administrative, physical, and technical safeguards to protect student education records.",
          "We also adhere to the Children's Online Privacy Protection Act (COPPA), ensuring that we do not knowingly collect personal information from children under 13 without verifiable parental consent."
        ]
      }
    ]
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
      title: "Page Not Found | Quero",
    };
  }

  return {
    title: `${page.title} | Quero`,
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
          <div className="prose prose-invert max-w-none space-y-10">
            {page.sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">{section.heading}</h2>
                <div className="space-y-4 text-zinc-300 font-light leading-relaxed text-lg">
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="pt-8 border-t border-white/10">
              <p className="text-zinc-500 text-sm">
                Last updated: August 2026
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
