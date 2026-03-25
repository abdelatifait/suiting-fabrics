const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../supabase');

// Multer — memory storage (no local disk)
const upload = multer({ storage: multer.memoryStorage() });

// ---- Middleware: Check admin password ----
function requireAdmin(req, res, next) {
  const password = req.headers['x-admin-password'];
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Non autorisé' });
  }
  next();
}

// POST /api/admin/login — Verify admin password
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true });
  }
  return res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
});

// GET /api/admin/products — Liste tous les produits (admin)
router.get('/products', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, products: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/products — Ajouter un produit
router.post('/products', requireAdmin, async (req, res) => {
  try {
    const { name, price, category, description, image_url, is_new, best_seller } = req.body;
    const { data, error } = await supabase
      .from('products')
      .insert([{ name, price, category, description, image_url, is_new, best_seller }])
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, product: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/products/:id — Modifier un produit
router.put('/products/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, description, image_url, is_new, best_seller } = req.body;
    const { data, error } = await supabase
      .from('products')
      .update({ name, price, category, description, image_url, is_new, best_seller })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, product: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/products/:id — Supprimer un produit
router.delete('/products/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/upload — Uploader une image dans Supabase Storage
router.post('/upload', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucune image fournie' });
    }

    const fileName = `products/${Date.now()}-${req.file.originalname.replace(/\s/g, '_')}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    res.json({ success: true, url: urlData.publicUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
