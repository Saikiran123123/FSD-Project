import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Theatre from '../models/Theatre.js';
import Screen from '../models/Screen.js';

const ALL_THEATRES = [
  // Hyderabad
  {
    name: 'Prasads Multiplex & IMAX Screen',
    chain: 'Prasads Multiplex',
    city: 'Hyderabad',
    area: 'Necklace Road',
    address: 'NTR Gardens, Necklace Road, Khairatabad, Hyderabad',
    facilities: ['Giant Screen Laser', 'Dolby Atmos 7.1', 'VIP Recliners', 'Gourmet Food Court', 'Valet Parking'],
    rating: 4.9,
    totalReviews: 1540,
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'AMB Cinemas (Screen 1 VIP Luxe)',
    chain: 'AMB Cinemas',
    city: 'Hyderabad',
    area: 'Gachibowli',
    address: 'Sarath City Capital Mall Area, Gachibowli - Miyapur Rd, Hyderabad',
    facilities: ['Laser 4K Projection', 'Dolby Atmos', 'M-Lounge Recliners', 'Cafe & Bar'],
    rating: 4.8,
    totalReviews: 1290,
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'PVR Forum Sujana Mall (PXL & 4DX)',
    chain: 'PVR Cinemas',
    city: 'Hyderabad',
    area: 'Kukatpally',
    address: 'Nexus Forum Sujana Mall, KPHB Phase 6, Kukatpally, Hyderabad',
    facilities: ['4DX Motion', 'Dolby Atmos 7.1', 'PVR PXL Laser', 'Executive Lounge'],
    rating: 4.7,
    totalReviews: 980,
    image: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'INOX GVK One (INSIGNIA Lounge)',
    chain: 'INOX Multiplex',
    city: 'Hyderabad',
    area: 'Banjara Hills',
    address: 'GVK One Mall, Road No. 1, Banjara Hills, Hyderabad',
    facilities: ['INSIGNIA Luxury', 'Dolby Atmos', 'Plush Leather Beds', 'In-Seat Butler Service'],
    rating: 4.8,
    totalReviews: 1420,
    image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1200&auto=format&fit=crop&q=80',
  },

  // Bengaluru
  {
    name: 'PVR Forum Mall (IMAX with Laser)',
    chain: 'PVR Cinemas',
    city: 'Bengaluru',
    area: 'Koramangala',
    address: 'The Forum Mall, Hosur Road, Koramangala, Bengaluru',
    facilities: ['IMAX with Laser', 'Dolby Atmos', 'Gold Class Recliners', 'Fine Dining Cafe'],
    rating: 4.9,
    totalReviews: 1800,
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Cinepolis Orion Mall (Macro XE)',
    chain: 'Cinepolis',
    city: 'Bengaluru',
    area: 'Rajajinagar',
    address: 'Brigade Gateway, 26/1 Dr. Rajkumar Road, Rajajinagar, Bengaluru',
    facilities: ['Macro XE Large Format', 'Dolby Atmos 64-Channel', 'VIP Lounges'],
    rating: 4.8,
    totalReviews: 1450,
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'INOX Nexus Mall (Laserplex)',
    chain: 'INOX Multiplex',
    city: 'Bengaluru',
    area: 'Whitefield',
    address: 'Nexus Shantiniketan Mall, ITPL Main Rd, Whitefield, Bengaluru',
    facilities: ['Laser 4K Projection', 'Dolby Atmos', 'Club Lounges', 'Wheelchair Friendly'],
    rating: 4.7,
    totalReviews: 1100,
    image: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=1200&auto=format&fit=crop&q=80',
  },

  // Mumbai
  {
    name: 'PVR Palladium (Gold Class Luxury)',
    chain: 'PVR Cinemas',
    city: 'Mumbai',
    area: 'Lower Parel',
    address: 'High Street Phoenix, Senapati Bapat Marg, Lower Parel, Mumbai',
    facilities: ['Gold Class Recliners', 'IMAX with Laser', 'Dolby Atmos', 'Valet Parking'],
    rating: 4.9,
    totalReviews: 2150,
    image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'INOX Megaplex Inorbit Mall',
    chain: 'INOX Multiplex',
    city: 'Mumbai',
    area: 'Malad West',
    address: 'Inorbit Mall, Link Road, Malad West, Mumbai',
    facilities: ['IMAX 3D', 'ScreenX 270°', 'MX4D Motion', 'INSIGNIA Lounge'],
    rating: 4.8,
    totalReviews: 1890,
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'PVR Dynamix Mall (Premiere)',
    chain: 'PVR Cinemas',
    city: 'Mumbai',
    area: 'Juhu',
    address: 'JVPD Scheme, Juhu Tara Road, Vile Parle West, Mumbai',
    facilities: ['4K Laser Projection', 'Dolby Atmos', 'VIP Recliner Lounges'],
    rating: 4.7,
    totalReviews: 1320,
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
  },

  // Chennai
  {
    name: 'Sathyam Cinemas (SPI Cinemas)',
    chain: 'SPI Cinemas',
    city: 'Chennai',
    area: 'Royapettah',
    address: 'Thiru Vi Ka Road, Royapettah, Chennai',
    facilities: ['RDX 4K Laser', 'Dolby Atmos', 'Sathyam Gourmet Popcorn', 'VIP Balcony'],
    rating: 4.9,
    totalReviews: 2400,
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Escape Cinemas Express Avenue',
    chain: 'SPI Cinemas',
    city: 'Chennai',
    area: 'Royapettah',
    address: 'Express Avenue Mall, Whites Road, Royapettah, Chennai',
    facilities: ['Blind Lounges', 'Dolby Atmos 7.1', 'Laser 4K', 'Caramel Popcorn Counter'],
    rating: 4.8,
    totalReviews: 1670,
    image: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'PVR Palazzo Nexus Vijaya Mall',
    chain: 'PVR Cinemas',
    city: 'Chennai',
    area: 'Vadapalani',
    address: 'Nexus Vijaya Mall, Arcot Road, Vadapalani, Chennai',
    facilities: ['IMAX 3D Laser', 'Palazzo Italian Luxe', 'Dolby Atmos', 'Recliner Lounges'],
    rating: 4.9,
    totalReviews: 1950,
    image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1200&auto=format&fit=crop&q=80',
  },

  // Delhi-NCR
  {
    name: 'PVR Director\'s Cut Ambience Mall',
    chain: 'PVR Cinemas',
    city: 'Delhi-NCR',
    area: 'Vasant Kunj',
    address: 'Ambience Mall, Nelson Mandela Marg, Vasant Kunj, New Delhi',
    facilities: ['Platinum Recliner Beds', 'Chef Curated Fine Dining', 'Dolby Atmos 7.1', 'In-Seat Sommelier'],
    rating: 4.9,
    totalReviews: 3100,
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'INOX Insignia Epicuria',
    chain: 'INOX Multiplex',
    city: 'Delhi-NCR',
    area: 'Nehru Place',
    address: 'Epicuria Food Mall, Nehru Place Metro Station, New Delhi',
    facilities: ['7-Star INSIGNIA', 'Laser Projection', 'Leather Recliners', 'Gourmet Bistro'],
    rating: 4.8,
    totalReviews: 1850,
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'PVR Select Citywalk (IMAX & Gold)',
    chain: 'PVR Cinemas',
    city: 'Delhi-NCR',
    area: 'Saket',
    address: 'Select Citywalk Mall, A3 District Centre, Saket, New Delhi',
    facilities: ['IMAX with Laser', 'Gold Class Recliners', 'Dolby Atmos', 'Valet Parking'],
    rating: 4.9,
    totalReviews: 2420,
    image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1200&auto=format&fit=crop&q=80',
  },
];

async function seedMoreTheatres() {
  try {
    await connectDB();
    console.log('Connected to MongoDB Atlas.');

    for (const t of ALL_THEATRES) {
      const existing = await Theatre.findOne({ name: t.name });
      if (!existing) {
        const created = await Theatre.create(t);
        console.log(`Created theatre: ${created.name} in ${created.city}`);

        // Create 2 screens for the theatre
        await Screen.create([
          {
            theatreId: created._id,
            screenNumber: 1,
            name: 'Audi 1 - IMAX Laser',
            soundSystem: 'Dolby Atmos 7.1',
            projectionType: 'IMAX 3D',
            totalSeats: 80,
            layout: {
              rows: 8,
              cols: 10,
              categories: [
                { name: 'Silver', rows: ['A', 'B'], price: 220 },
                { name: 'Gold', rows: ['C', 'D', 'E', 'F'], price: 320 },
                { name: 'VIP Recliner', rows: ['G', 'H'], price: 480 },
              ],
            },
          },
          {
            theatreId: created._id,
            screenNumber: 2,
            name: 'Audi 2 - 4K Dolby Atmos',
            soundSystem: 'Dolby Atmos',
            projectionType: 'Laser 4K',
            totalSeats: 70,
            layout: {
              rows: 7,
              cols: 10,
              categories: [
                { name: 'Silver', rows: ['A', 'B'], price: 200 },
                { name: 'Gold', rows: ['C', 'D', 'E'], price: 280 },
                { name: 'VIP Recliner', rows: ['F', 'G'], price: 420 },
              ],
            },
          },
        ]);
      } else {
        console.log(`Theatre already exists: ${existing.name}`);
      }
    }

    console.log('Finished seeding all theatres.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding theatres:', err);
    process.exit(1);
  }
}

seedMoreTheatres();
