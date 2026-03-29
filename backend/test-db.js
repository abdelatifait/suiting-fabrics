require('dotenv').config();
const supabase = require('./supabase');

async function testDB() {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: "Test Direct DB", price: 100, category: "simple",
        description: "test", image_url: "test.jpg",
        images: ["test1.jpg", "test2.jpg"],
        is_new: true, best_seller: false
      }])
      .select()
      .single();
    
    if (error) {
      console.error("SUPABASE ERROR:");
      console.error(JSON.stringify(error, null, 2));
    } else {
      console.log("Insert Success:", data.id);
      await supabase.from('products').delete().eq('id', data.id);
    }
  } catch(e) {
    console.error("Exception:", e);
  }
}
testDB();
