import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground"><Leaf className="size-5" /></span>
            <div className="font-display text-lg font-semibold">Vaidya & Co.</div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Authentic Ayurveda, sourced from Indian soil. AYUSH, GMP & ISO certified.</p>
        </div>
        <div>
          <h4 className="font-display text-base font-semibold">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop" search={{ category: "skincare" }}>Skincare</Link></li>
            <li><Link to="/shop" search={{ category: "haircare" }}>Hair Care</Link></li>
            <li><Link to="/shop" search={{ category: "digestion" }}>Digestion</Link></li>
            <li><Link to="/shop" search={{ category: "immunity" }}>Immunity</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-base font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/blog">Wisdom Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-base font-semibold">Promise</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>100% Natural • No chemicals</li>
            <li>Cash on Delivery available</li>
            <li>Free shipping above ₹499</li>
            <li>Made in India 🇮🇳</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Vaidya & Co. — स्वास्थ्यं परम भाग्यम् · Health is the highest blessing.
      </div>
    </footer>
  );
}
