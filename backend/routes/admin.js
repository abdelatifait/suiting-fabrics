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

// GET /api/admin/test-storage-upload - Diagnostic route to test Supabase Storage from Railway
router.get('/test-storage-upload', async (req, res) => {
  try {
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(`test-${Date.now()}.txt`, 'Hello from Railway', { contentType: 'text/plain' });
    res.json({ success: true, data, error });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, stack: err.stack });
  }
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
  console.log('Received POST /api/admin/products request.', req.body);
  try {
    const { name, price, category, description, image_url, images, is_new, best_seller } = req.body;
    console.log('Calling Supabase insert...', { name, price });
    const { data, error } = await supabase
      .from('products')
      .insert([{ name, price, category, description, image_url, images: images || [], is_new, best_seller }])
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
    const { name, price, category, description, image_url, images, is_new, best_seller } = req.body;
    const { data, error } = await supabase
      .from('products')
      .update({ name, price, category, description, image_url, images: images || [], is_new, best_seller })
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

// POST /api/admin/upload — Uploader de multiples images dans Supabase Storage
router.post('/upload', requireAdmin, upload.any(), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Aucune image fournie' });
    }

    const uploadedUrls = [];

    for (const file of req.files) {
      const fileName = `products/${Date.now()}-${Math.floor(Math.random() * 1000)}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;

      // Convert Node Buffer to Blob so native fetch sends Content-Length instead of Transfer-Encoding: chunked
      const blob = new Blob([file.buffer], { type: file.mimetype });

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, blob, {
          contentType: file.mimetype,
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      uploadedUrls.push(urlData.publicUrl);
    }

    res.json({ success: true, urls: uploadedUrls });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/site-settings — Récupérer tous les paramètres du site
router.get('/site-settings', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value');

    if (error) throw error;

    const settings = {};
    (data || []).forEach(row => { settings[row.key] = row.value; });

    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/site-settings/upload — Télécharger une image et sauvegarder son URL
router.post('/site-settings/upload', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) return res.status(400).json({ success: false, message: 'Clé manquante' });
    if (!req.file) return res.status(400).json({ success: false, message: 'Aucune image fournie' });

    const ext = req.file.originalname.split('.').pop().replace(/[^a-z0-9]/gi, '');
    const fileName = `site/${key}-${Date.now()}.${ext}`;
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, blob, { contentType: req.file.mimetype, upsert: true });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    const url = urlData.publicUrl;

    // Sauvegarder l'URL dans site_settings
    const { error: dbError } = await supabase
      .from('site_settings')
      .upsert({ key, value: url, updated_at: new Date().toISOString() });

    if (dbError) throw dbError;

    res.json({ success: true, url });
  } catch (err) {
    console.error('site-settings upload error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
