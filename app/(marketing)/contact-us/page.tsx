import type { Metadata } from "next";
import ContactView from "@/components/contact/ContactView";

export const metadata: Metadata = {
  title: "Contact Us | Prepify",
  description: "Get in touch with the Prepify team for support, partnerships, or inquiries.",
};

export default function ContactUsPage() {
  return <ContactView />;
}
