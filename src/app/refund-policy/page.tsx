import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import React from "react";

export default function RefundPolicy() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-32 max-w-4xl">
        <h1 className="text-4xl font-black text-[#2d3436] uppercase tracking-tighter mb-8 font-serif">Cancellation & Refund Policy</h1>
        
        <div className="space-y-6 text-black/70 leading-relaxed">
          <p>
            At LUXEE, we take pride in the quality of our handcrafted fragrances. Our aim is to ensure your complete satisfaction with every purchase.
          </p>

          <h2 className="text-xl font-bold text-black uppercase tracking-widest mt-8 mb-4">1. Order Cancellations</h2>
          <p>
            Orders can be cancelled within 24 hours of placement without any penalty, provided they have not yet been dispatched. Once an order has been shipped, it cannot be cancelled.
            To cancel an order, please contact our customer support team immediately at luxee.co.in@gmail.com with your order number.
          </p>

          <h2 className="text-xl font-bold text-black uppercase tracking-widest mt-8 mb-4">2. Returns</h2>
          <p>
            Due to the hygienic nature of perfume and fragrance products, we do not accept returns on used or opened items.
            Returns are only accepted if the product is in its original, unopened packaging, wrapped securely, and within 7 days of the delivery date.
          </p>

          <h2 className="text-xl font-bold text-black uppercase tracking-widest mt-8 mb-4">3. Refunds</h2>
          <p>
            Once your return is received and inspected, we will notify you of the approval or rejection of your refund. 
            If approved, the refund will be processed and automatically applied to your original method of payment within 5-7 business days.
          </p>

          <h2 className="text-xl font-bold text-black uppercase tracking-widest mt-8 mb-4">4. Damaged or Defective Items</h2>
          <p>
            In the rare event that your product arrives damaged or defective, please contact us within 48 hours of delivery at luxee.co.in@gmail.com. 
            Include your order number and clear photographs of the damaged product and packaging. We will investigate the issue and arrange for a replacement or a full refund.
          </p>

          <h2 className="text-xl font-bold text-black uppercase tracking-widest mt-8 mb-4">5. Non-Refundable Items</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Gift cards</li>
            <li>Limited edition or sale items (unless defective)</li>
            <li>Products that have been used, opened, or altered</li>
          </ul>

          <p className="pt-8 text-sm text-black/50">
            Last updated: March 2026
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
