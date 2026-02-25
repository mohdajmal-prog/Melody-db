// Cart API Test Script
// Run this in browser console on any page to test cart API

async function testCartAPI() {
  const baseURL = window.location.origin;
  const testCustomerId = "test-customer-123";
  
  console.log("🧪 Starting Cart API Tests...");
  
  try {
    // Test 1: Add item to cart
    console.log("📝 Test 1: Adding item to cart");
    const addResponse = await fetch(`${baseURL}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: testCustomerId,
        farmerId: "test-farmer-1",
        productType: "Test Goat",
        breed: "Test Breed",
        quantity: 2,
        price: 500,
        weight: "20-25kg",
        minimumGuaranteedWeight: 20
      })
    });
    
    if (addResponse.ok) {
      const addResult = await addResponse.json();
      console.log("✅ Add to cart successful:", addResult);
    } else {
      console.error("❌ Add to cart failed:", await addResponse.text());
    }
    
    // Test 2: Get cart items
    console.log("📝 Test 2: Getting cart items");
    const getResponse = await fetch(`${baseURL}/api/cart?customerId=${testCustomerId}`);
    
    if (getResponse.ok) {
      const cartData = await getResponse.json();
      console.log("✅ Get cart successful:", cartData);
      
      if (cartData.cart && cartData.cart.length > 0) {
        const firstItem = cartData.cart[0];
        
        // Test 3: Update item quantity
        console.log("📝 Test 3: Updating item quantity");
        const updateResponse = await fetch(`${baseURL}/api/cart`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerId: testCustomerId,
            itemId: firstItem.id,
            quantity: 3
          })
        });
        
        if (updateResponse.ok) {
          console.log("✅ Update quantity successful");
        } else {
          console.error("❌ Update quantity failed:", await updateResponse.text());
        }
        
        // Test 4: Remove item from cart
        console.log("📝 Test 4: Removing item from cart");
        const deleteResponse = await fetch(
          `${baseURL}/api/cart?customerId=${testCustomerId}&itemId=${firstItem.id}`,
          { method: 'DELETE' }
        );
        
        if (deleteResponse.ok) {
          console.log("✅ Remove item successful");
        } else {
          console.error("❌ Remove item failed:", await deleteResponse.text());
        }
      }
    } else {
      console.error("❌ Get cart failed:", await getResponse.text());
    }
    
    console.log("🎉 Cart API tests completed!");
    
  } catch (error) {
    console.error("💥 Test error:", error);
  }
}

// Run the test
testCartAPI();

// Export for manual testing
window.testCartAPI = testCartAPI;