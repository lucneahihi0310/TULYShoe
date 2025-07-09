const express = require('express');
const router = express.Router();

const ProductDetail = require('../models/productDetail.model');
const Category = require('../models/category.model');
const Brand = require('../models/brand.model');

router.get('/', async (req, res) => {
  try {
    const baseUrl = 'https://tulyshoe-front.onrender.com';

    const [productDetails, categories, brands] = await Promise.all([
      ProductDetail.find().select('_id update_at create_at'),
      Category.find().select('_id update_at create_at'),
      Brand.find().select('_id update_at create_at'),
    ]);

    const urls = [
      // Trang chủ
      `
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,

      // Chi tiết sản phẩm
      ...productDetails.map(p => `
  <url>
    <loc>${baseUrl}/product-detail/${p._id}</loc>
    <lastmod>${new Date(p.update_at || p.create_at || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`),

      // Danh mục
      ...categories.map(c => `
  <url>
    <loc>${baseUrl}/category/${c._id}</loc>
    <lastmod>${new Date(c.update_at || c.create_at || Date.now()).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`),

      // Thương hiệu
      ...brands.map(b => `
  <url>
    <loc>${baseUrl}/brand/${b._id}</loc>
    <lastmod>${new Date(b.update_at || b.create_at || Date.now()).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`)
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('\n')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);

  } catch (error) {
    console.error('Sitemap generation failed:', error.message);
    res.status(500).send('Error generating sitemap');
  }
});

module.exports = router;
