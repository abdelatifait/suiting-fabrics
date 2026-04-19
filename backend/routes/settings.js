const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// GET /api/settings — Public: retourne toutes les images du site
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value');

    if (error) throw error;

    // Convertir tableau en objet { hero_bg: "url", ... }
    const settings = {};
    (data || []).forEach(row => { settings[row.key] = row.value; });

    res.json({ success: true, settings });
  } catch (err) {
    console.error('Error fetching site settings:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
