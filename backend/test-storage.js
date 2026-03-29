require('dotenv').config();
const supabase = require('./supabase');

async function testStorage() {
  try {
    const fileName = `products/test-${Date.now()}.txt`;
    console.log("Uploading to product-images bucket...");
    
    // We can just use string as body for text 
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, 'Hello Storage', {
        contentType: 'text/plain',
        upsert: false
      });
      
    if (error) {
      console.error("STORAGE ERROR:");
      console.error(JSON.stringify(error, null, 2));
    } else {
      console.log("Upload Success:", data);
      
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
      console.log("Public URL:", publicUrl);
      
      await supabase.storage.from('product-images').remove([fileName]);
    }
  } catch(e) {
    console.error("Exception:", e);
  }
}
testStorage();
