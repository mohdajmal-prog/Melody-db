import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const productId = params.id;
    
    // Get the main product first
    const mainProduct = await Product.findById(productId);
    if (!mainProduct) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Find related products based on category and type
    let relatedQuery: any = {
      _id: { $ne: productId }, // Exclude the current product
      $or: [
        { category: mainProduct.category },
        { type: { $regex: mainProduct.type, $options: 'i' } }
      ]
    };

    // Enhanced logic for specific product types
    if (mainProduct.type.toLowerCase().includes('goat')) {
      relatedQuery = {
        _id: { $ne: productId },
        $or: [
          { category: 'mutton' },
          { category: 'dairy' },
          { type: { $regex: 'goat', $options: 'i' } },
          { type: { $regex: 'sheep', $options: 'i' } }
        ]
      };
    } else if (mainProduct.type.toLowerCase().includes('chicken')) {
      relatedQuery = {
        _id: { $ne: productId },
        $or: [
          { category: 'chicken' },
          { type: { $regex: 'chicken', $options: 'i' } },
          { type: { $regex: 'egg', $options: 'i' } }
        ]
      };
    } else if (mainProduct.category === 'dairy') {
      relatedQuery = {
        _id: { $ne: productId },
        $or: [
          { category: 'dairy' },
          { type: { $regex: 'milk', $options: 'i' } },
          { type: { $regex: 'cheese', $options: 'i' } },
          { type: { $regex: 'ghee', $options: 'i' } }
        ]
      };
    }

    const relatedProducts = await Product.find(relatedQuery)
      .populate('farmerId', 'name village')
      .limit(8)
      .sort({ createdAt: -1 });

    // Transform the data for frontend
    const transformedProducts = relatedProducts.map(product => ({
      id: product._id.toString(),
      type: product.type,
      breed: product.breed,
      price: product.price,
      unit: 'per kg',
      image: product.images?.[0] || '/placeholder.jpg',
      available: product.available,
      category: product.category,
      bulkAvailable: product.bulkAvailable,
      farmer: product.farmerId
    }));

    return NextResponse.json({
      success: true,
      relatedProducts: transformedProducts,
      total: transformedProducts.length
    });

  } catch (error) {
    console.error('Related products fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch related products' },
      { status: 500 }
    );
  }
}