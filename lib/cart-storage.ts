import { MongoClient, Db, ObjectId } from 'mongodb';

export interface CartItem {
  id: string;
  customerId: string;
  farmerId: string;
  productType: string;
  breed: string;
  quantity: number;
  pricePerUnit: number;
  weight?: string;
  minimumGuaranteedWeight?: number;
  createdAt: Date;
}

class CartStorage {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private async connect() {
    try {
      if (!this.client) {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
          throw new Error('MONGODB_URI is not defined');
        }
        this.client = new MongoClient(uri);
        await this.client.connect();
        this.db = this.client.db();
      }
      return this.db!;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  async getItems(customerId: string): Promise<CartItem[]> {
    try {
      const db = await this.connect();
      const items = await db.collection('cart').find({ customerId }).toArray();
      return items.map(item => ({ ...item, id: item._id.toString() }));
    } catch {
      return [];
    }
  }

  async addItem(customerId: string, item: Omit<CartItem, 'id' | 'customerId' | 'createdAt'>): Promise<CartItem> {
    try {
      const db = await this.connect();
      
      const existing = await db.collection('cart').findOne({
        customerId,
        farmerId: item.farmerId,
        productType: item.productType,
        breed: item.breed
      });

      if (existing) {
        await db.collection('cart').updateOne(
          { _id: existing._id },
          { $inc: { quantity: item.quantity } }
        );
        const updated = await db.collection('cart').findOne({ _id: existing._id });
        return { ...updated, id: updated!._id.toString() } as CartItem;
      }
      
      const newItem: any = {
        ...item,
        customerId,
        createdAt: new Date(),
      };
      const result = await db.collection('cart').insertOne(newItem);
      return { ...newItem, id: result.insertedId.toString() } as CartItem;
    } catch (error) {
      console.error('CartStorage addItem error, using localStorage fallback:', error);
      // Fallback to localStorage
      const cartKey = `cart_${customerId}`;
      const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
      const existing = cart.find((i: any) => 
        i.farmerId === item.farmerId && 
        i.productType === item.productType && 
        i.breed === item.breed
      );
      
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        const newItem = {
          ...item,
          id: Date.now().toString(),
          customerId,
          createdAt: new Date(),
        };
        cart.push(newItem);
      }
      
      localStorage.setItem(cartKey, JSON.stringify(cart));
      return existing || cart[cart.length - 1];
    }
  }

  async removeItem(customerId: string, itemId: string): Promise<void> {
    const db = await this.connect();
    await db.collection('cart').deleteOne({ customerId, _id: new ObjectId(itemId) });
  }

  async updateQuantity(customerId: string, itemId: string, quantity: number): Promise<void> {
    const db = await this.connect();
    await db.collection('cart').updateOne(
      { customerId, _id: new ObjectId(itemId) },
      { $set: { quantity } }
    );
  }

  async clear(customerId: string): Promise<void> {
    const db = await this.connect();
    await db.collection('cart').deleteMany({ customerId });
  }
}

export const cartStorage = new CartStorage();