import type { Metadata } from "next";
import ContactView from "@/components/contact/ContactView";

export const metadata: Metadata = {
  title: "Contact Us | Quero",
  description: "Get in touch with the Quero team for support, partnerships, or inquiries.",
};

export default function ContactUsPage() {
  return <ContactView />;
}
