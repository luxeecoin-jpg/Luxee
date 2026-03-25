import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import React from "react";

export default function ShippingPolicy() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-32 max-w-4xl">
        <h1 className="text-4xl font-black text-[#2d3436] uppercase tracking-tighter mb-8 font-serif">Shipping & Delivery Policy</h1>
        
        <div className="space-y-6 text-black/70 leading-relaxed">
          <p>
            Thank you for choosing LUXEE. We strive to deliver your luxury fragrances safely and promptly. Please read our shipping and delivery practices below.
          </p>

          <h2 className="text-xl font-bold text-black uppercase tracking-widest mt-8 mb-4">1. Processing Time</h2>
          <p>
            All orders are processed within 1-2 business days (excluding weekends and holidays) after receiving your order confirmation email. 
            You will receive another notification when your order has been shipped.
          </p>

          <h2 className="text-xl font-bold text-black uppercase tracking-widest mt-8 mb-4">2. Shipping Rates & Estimates</h2>
          <p>
            Shipping charges for your order will be calculated and displayed at checkout.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Standard Shipping:</strong> 3-5 business days</li>
            <li><strong>Express Shipping:</strong> 1-2 business days</li>
          </ul>
          <p>
            Free shipping is available for all domestic orders over ₹2000.
          </p>

          <h2 className="text-xl font-bold text-black uppercase tracking-widest mt-8 mb-4">3. Domestic & International Shipping</h2>
          <p>
            We currently ship everywhere within India. For international orders, please contact our customer support team for custom shipping arrangements.
          </p>

          <h2 className="text-xl font-bold text-black uppercase tracking-widest mt-8 mb-4">4. Order Tracking</h2>
          <p>
            When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. 
            Please allow up to 24 hours for the tracking information to become available.
          </p>

          <h2 className="text-xl font-bold text-black uppercase tracking-widest mt-8 mb-4">5. Delays & Issues</h2>
          <p>
            While we partner with top-tier courier services, unexpected delays can occasionally occur due to extreme weather, public holidays, or other unforeseen logistical challenges. 
            If you haven’t received your order within 7 days of receiving your shipping confirmation email, please contact us at luxee.co.in@gmail.com with your name and order number, and we will look into it for you.
          </p>

          <p className="pt-8 text-sm text-black/50">
            Last updated: March 2026
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
