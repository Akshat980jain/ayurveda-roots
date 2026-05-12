
-- 1. Create a Category
INSERT INTO public.categories (slug, name, hindi_name, description)
VALUES ('ayurvedic-supplements', 'Ayurvedic Supplements', 'आयुर्वेदिक सप्लीमेंट्स', 'Pure herbal supplements for daily wellness')
ON CONFLICT (slug) DO NOTHING;

-- 2. Add Bestseller Products
INSERT INTO public.products (slug, name, hindi_name, description, short_description, price, discount_price, stock, category_id, dosage_type, images, rating, num_reviews, is_featured)
VALUES 
('ashwagandha-tablets', 'Ashwagandha Tablets', 'अश्वगंधा', 'Pure Ashwagandha extract for stress relief and vitality.', 'Energy & Stress Support', 499, 399, 100, (SELECT id FROM categories WHERE slug = 'ayurvedic-supplements'), 'Tablet', '{"https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?w=500&auto=format"}', 4.7, 128, true),

('chyawanprash-classic', 'Chyawanprash Classic', 'च्यवनप्राश', 'Traditional immunity booster with Amla and 40+ herbs.', 'Immunity & Strength', 650, 549, 50, (SELECT id FROM categories WHERE slug = 'ayurvedic-supplements'), 'Powder', '{"https://images.unsplash.com/photo-1512106373273-b46e1b39b2ee?w=500&auto=format"}', 4.9, 212, true),

('triphala-churna', 'Triphala Churna', 'त्रिफला चूर्ण', 'Natural digestive support and internal cleanser.', 'Digestion & Detox', 299, 249, 150, (SELECT id FROM categories WHERE slug = 'ayurvedic-supplements'), 'Powder', '{"https://images.unsplash.com/photo-1615485500704-8e990f3900fb?w=500&auto=format"}', 4.6, 89, true),

('kumkumadi-tailam', 'Kumkumadi Tailam', 'कुमकुमादि तेलम', 'Ancient beauty oil for radiant and youthful skin.', 'Skin & Glow', 899, 749, 75, (SELECT id FROM categories WHERE slug = 'ayurvedic-supplements'), 'Oil', '{"https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format"}', 4.8, 176, true)
ON CONFLICT (slug) DO NOTHING;
