import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('melody');
    
    const users = await db.collection('users').find({
      $or: [
        { farmerStatus: 'pending' },
        { driverStatus: 'pending' },
        { employerStatus: 'pending' },
        { studentStatus: 'pending' },
        { workerStatus: 'pending' }
      ]
    }).toArray();

    const pendingApplications = users.flatMap(user => {
      const applications = [];
      
      if (user.farmerStatus === 'pending') {
        applications.push({
          id: user._id.toString(),
          name: user.name || 'Unknown',
          phone: user.phone,
          role: 'farmer',
          village: user.village || 'N/A',
          products: user.products || 'N/A',
          appliedDate: user.createdAt || new Date().toISOString(),
          documents: {
            aadhaar: !!user.aadhaar,
            pan: !!user.pan,
            photo: !!user.photo
          },
          videoUploaded: !!user.farmVideo
        });
      }
      
      if (user.driverStatus === 'pending') {
        applications.push({
          id: user._id.toString(),
          name: user.name || 'Unknown',
          phone: user.phone,
          role: 'driver',
          village: user.village || 'N/A',
          products: 'Driver Services',
          appliedDate: user.createdAt || new Date().toISOString(),
          documents: {
            aadhaar: !!user.aadhaar,
            pan: !!user.license,
            photo: !!user.photo
          },
          videoUploaded: !!user.vehicleVideo
        });
      }
      
      if (user.employerStatus === 'pending') {
        applications.push({
          id: user._id.toString(),
          name: user.name || 'Unknown',
          phone: user.phone,
          role: 'employer',
          village: user.village || 'N/A',
          products: 'Employer Services',
          appliedDate: user.createdAt || new Date().toISOString(),
          documents: {
            aadhaar: !!user.aadhaar,
            pan: !!user.pan,
            photo: !!user.photo
          },
          videoUploaded: !!user.businessVideo
        });
      }

      if (user.studentStatus === 'pending') {
        applications.push({
          id: user._id.toString(),
          name: user.name || 'Unknown',
          phone: user.phone,
          role: 'student',
          village: user.village || 'N/A',
          products: 'Student Services',
          appliedDate: user.createdAt || new Date().toISOString(),
          documents: {
            aadhaar: !!user.aadhaar,
            pan: !!user.studentId,
            photo: !!user.photo
          },
          videoUploaded: !!user.studentVideo
        });
      }

      if (user.workerStatus === 'pending') {
        applications.push({
          id: user._id.toString(),
          name: user.name || 'Unknown',
          phone: user.phone,
          role: 'worker',
          village: user.village || 'N/A',
          products: 'Worker Services',
          appliedDate: user.createdAt || new Date().toISOString(),
          documents: {
            aadhaar: !!user.aadhaar,
            pan: !!user.pan,
            photo: !!user.photo
          },
          videoUploaded: !!user.workerVideo
        });
      }
      
      return applications;
    });

    return NextResponse.json({ applications: pendingApplications });
  } catch (error) {
    console.error('Failed to fetch pending KYC:', error);
    return NextResponse.json({ applications: [] });
  }
}
