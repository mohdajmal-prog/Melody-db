import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('melody');
    
    const users = await db.collection('users').find({
      $or: [
        { farmerStatus: 'approved' },
        { driverStatus: 'approved' },
        { employerStatus: 'approved' },
        { studentStatus: 'approved' },
        { workerStatus: 'approved' }
      ]
    }).toArray();

    const approvedUsers = users.flatMap(user => {
      const userRoles = [];
      
      if (user.farmerStatus === 'approved') {
        userRoles.push({
          id: user._id.toString(),
          name: user.name || 'Unknown',
          phone: user.phone,
          role: 'farmer',
          status: 'approved',
          approvedAt: user.approvedAt || user.updatedAt || new Date().toISOString(),
          details: {
            village: user.village || 'N/A',
            products: user.products || 'N/A',
            farmSize: user.farmSize || 'N/A'
          }
        });
      }
      
      if (user.driverStatus === 'approved') {
        userRoles.push({
          id: user._id.toString(),
          name: user.name || 'Unknown',
          phone: user.phone,
          role: 'driver',
          status: 'approved',
          approvedAt: user.approvedAt || user.updatedAt || new Date().toISOString(),
          details: {
            vehicleType: user.vehicleType || 'N/A',
            vehicleNumber: user.vehicleNumber || 'N/A',
            license: user.license || 'N/A'
          }
        });
      }
      
      if (user.employerStatus === 'approved') {
        userRoles.push({
          id: user._id.toString(),
          name: user.name || 'Unknown',
          phone: user.phone,
          role: 'employer',
          status: 'approved',
          approvedAt: user.approvedAt || user.updatedAt || new Date().toISOString(),
          details: {
            businessName: user.businessName || 'N/A',
            businessType: user.businessType || 'N/A',
            gst: user.gst || 'N/A'
          }
        });
      }

      if (user.studentStatus === 'approved') {
        userRoles.push({
          id: user._id.toString(),
          name: user.name || 'Unknown',
          phone: user.phone,
          role: 'student',
          status: 'approved',
          approvedAt: user.approvedAt || user.updatedAt || new Date().toISOString(),
          details: {
            age: user.age || 'N/A',
            institution: user.institution || 'N/A'
          }
        });
      }

      if (user.workerStatus === 'approved') {
        userRoles.push({
          id: user._id.toString(),
          name: user.name || 'Unknown',
          phone: user.phone,
          role: 'worker',
          status: 'approved',
          approvedAt: user.approvedAt || user.updatedAt || new Date().toISOString(),
          details: {
            age: user.age || 'N/A',
            aadharNumber: user.aadharNumber || 'N/A'
          }
        });
      }
      
      return userRoles;
    });

    return NextResponse.json({ approvedUsers });
  } catch (error) {
    console.error('Failed to fetch approved users:', error);
    return NextResponse.json({ approvedUsers: [] });
  }
}