// In-memory mock database
let inventory = {
  1: { productId: 1, name: 'English Willow Bat', stock: 45 },
  2: { productId: 2, name: 'Football', stock: 120 },
  3: { productId: 3, name: 'Badminton Racket', stock: 8 },
  4: { productId: 4, name: 'Basketball', stock: 25 },
  5: { productId: 5, name: 'Tennis Racket', stock: 0 },
};

class InventoryService {
  async checkInventory(items) {
    console.log('📦 [INVENTORY] Checking stock availability...');
    
    let outOfStock = [];
    
    for (const item of items) {
      const product = inventory[item.id];
      
      if (!product) {
        console.log(`  ❌ Product ID ${item.id} not found`);
        outOfStock.push({ id: item.id, reason: 'Product not found' });
        continue;
      }

      if (product.stock < item.qty) {
        console.log(`  ❌ ${product.name} - Requested: ${item.qty}, Available: ${product.stock}`);
        outOfStock.push({
          id: item.id,
          name: product.name,
          requested: item.qty,
          available: product.stock,
          reason: 'Insufficient stock'
        });
      } else {
        console.log(`  ✅ ${product.name} - Available: ${product.stock}`);
      }
    }

    if (outOfStock.length > 0) {
      throw new Error(JSON.stringify(outOfStock));
    }

    console.log('✅ [INVENTORY] All items in stock');
    return true;
  }

  async reserveInventory(items) {
    console.log('🔒 [INVENTORY] Reserving stock for order...');
    
    for (const item of items) {
      const product = inventory[item.id];
      if (product) {
        product.stock -= item.qty;
        console.log(`  ✅ Reserved ${item.qty}x ${product.name} (${product.stock} left)`);
      }
    }
    
    return true;
  }

  getInventoryStatus() {
    return inventory;
  }
}

module.exports = new InventoryService();
