import oil from "@/assets/product-oil.jpg";
import powder from "@/assets/product-powder.jpg";
import soap from "@/assets/product-soap.jpg";
import tablet from "@/assets/product-tablet.jpg";

export function imageForProduct(p: { dosage_type?: string | null; images?: string[] | null; slug?: string }) {
  if (p.images && p.images.length > 0 && p.images[0].startsWith("http")) return p.images[0];
  switch (p.dosage_type) {
    case "Oil": return oil;
    case "Powder": case "Kadha": return powder;
    case "Tablet": return p.slug?.includes("soap") ? soap : tablet;
    default: return powder;
  }
}
