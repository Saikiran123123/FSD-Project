import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Theatre from '../models/Theatre.js';
import Screen from '../models/Screen.js';

const ALL_THEATRES = [
  // Hyderabad
  {
    name: 'CineBook IMAX & 4DX Mall',
    chain: 'CineBook Luxe',
    city: 'Hyderabad',
    area: 'Hitec City',
    address: 'Cyber Towers Main Rd, Inorbit Mall Area, Hyderabad',
    facilities: ['IMAX with Laser', 'Dolby Atmos 7.1', 'VIP Recliners', 'Gourmet Dining', 'Valet Parking'],
    rating: 4.9,
    totalReviews: 1240,
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'CineBook PXL Cinemas',
    chain: 'CineBook Premier',
    city: 'Hyderabad',
    area: 'Banjara Hills',
    address: 'Road No. 2, Banjara Hills, Hyderabad',
    facilities: ['4K Laser Projection', 'Dolby Atmos', 'Recliner Lounges', 'Cafe & Bar'],
    rating: 4.7,
    totalReviews: 890,
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'CineBook Prasad Luxe',
    chain: 'CineBook Luxe',
    city: 'Hyderabad',
    area: 'Necklace Road',
    address: 'NTR Gardens, Necklace Road, Khairatabad, Hyderabad',
    facilities: ['Giant Screen Laser', 'Dolby Atmos', 'VIP Recliners', 'Food Court'],
    rating: 4.8,
    totalReviews: 1540,
    image: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'CineBook Nexus Grand',
    chain: 'CineBook Premier',
    city: 'Hyderabad',
    area: 'Kukatpally',
    address: 'Nexus Mall, KPHB Phase 6, Kukatpally, Hyderabad',
    facilities: ['4DX Motion', 'Dolby 7.1', 'Executive Lounges', 'Gaming Zone'],
    rating: 4.6,
    totalReviews: 920,
    image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1200&auto=format&fit=crop&q=80',
  },

  // Bengaluru
  {
    name: 'CineBook Grand Multiplex',
    chain: 'CineBook Classic',
    city: 'Bengaluru',
    area: 'Koramangala',
    address: '80 Feet Road, 4th Block, Koramangala, Bengaluru',
    facilities: ['Dolby Atmos', '4K Projection', 'Food Court', 'Wheelchair Access'],
    rating: 4.8,
    totalReviews: 1100,
    image: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'CineBook Laser Plex',
    chain: 'CineBook Luxe',
    city: 'Bengaluru',
    area: 'Indiranagar',
    address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru',
    facilities: ['IMAX 3D', 'VIP Recliners', 'Dolby Atmos 7.1', 'Valet Parking'],
    rating: 4.9,
    totalReviews: 1450,
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'CineBook Forum Prestige',
    chain: 'CineBook Premier',
    city: 'Bengaluru',
    area: 'Whitefield',
    address: 'Prestige Shantiniketan, ITPL Main Rd, Whitefield, Bengaluru',
    facilities: ['4K Laser', 'Dolby Atmos', 'Recliner Seats', 'Gourmet Cafe'],
    rating: 4.7,
    totalReviews: 780,
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
  },

  // Mumbai
  {
    name: 'CineBook Royale Screen',
    chain: 'CineBook Luxe',
    city: 'Mumbai',
    area: 'Bandra West',
    address: 'Linking Road, Bandra West, Mumbai',
    facilities: ['IMAX 3D', 'VIP Recliner Beds', 'In-Seat Butler Service', 'Dolby Atmos'],
    rating: 4.9,
    totalReviews: 2150,
    image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'CineBook Palladium IMAX',
    chain: 'CineBook Luxe',
    city: 'Mumbai',
    area: 'Lower Parel',
    address: 'High Street Phoenix, Senapati Bapat Marg, Lower Parel, Mumbai',
    facilities: ['IMAX with Laser', 'Dolby Atmos', 'VIP Recliners', 'Valet Parking'],
    rating: 4.9,
    totalReviews: 1890,
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'CineBook CineLuxe Juhu',
    chain: 'CineBook Premier',
    city: 'Mumbai',
    area: 'Juhu',
    address: 'JVPD Scheme, Juhu Tara Road, Mumbai',
    facilities: ['4K Laser', 'Dolby Atmos', 'Luxury Lounges', 'Fine Dining'],
    rating: 4.8,
    totalReviews: 1320,
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
  },

  // Chennai
  {
    name: 'CineBook Escape Multiplex',
    chain: 'CineBook Luxe',
    city: 'Chennai',
    area: 'Royapettah',
    address: 'Express Avenue Mall, Whites Road, Royapettah, Chennai',
    facilities: ['Dolby Atmos', 'Laser 4K', 'Blind Recliners', 'Gourmet Cafe'],
    rating: 4.8,
    totalReviews: 1670,
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'CineBook Palazzo IMAX',
    chain: 'CineBook Luxe',
    city: 'Chennai',
    area: 'Vadapalani',
    address: 'Nexus Vijaya Mall, Arcot Road, Vadapalani, Chennai',
    facilities: ['IMAX 3D', 'Dolby Atmos 7.1', 'Italian Architecture', 'VIP Seats'],
    rating: 4.9,
    totalReviews: 2400,
    image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'CineBook Grand Phoenix',
    chain: 'CineBook Premier',
    city: 'Chennai',
    area: 'Velachery',
    address: 'Phoenix Marketcity, Velachery Main Road, Chennai',
    facilities: ['4DX Motion', 'Dolby Atmos', 'Premium Recliners', 'Food Lounge'],
    rating: 4.7,
    totalReviews: 1190,
    image: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=1200&auto=format&fit=crop&q=80',
  },

  // Delhi-NCR
  {
    name: 'CineBook Select Citywalk IMAX',
    chain: 'CineBook Luxe',
    city: 'Delhi-NCR',
    area: 'Saket',
    address: 'Select Citywalk Mall, A3 District Centre, Saket, New Delhi',
    facilities: ['IMAX with Laser', 'Dolby Atmos', 'Director Cut Recliners', 'Valet Parking'],
    rating: 4.9,
    totalReviews: 3100,
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'CineBook CyberHub Laser Screen',
    chain: 'CineBook Luxe',
    city: 'Delhi-NCR',
    area: 'Gurugram',
    address: 'DLF CyberHub, DLF Phase 2, Sector 24, Gurugram',
    facilities: ['4K Laser Projection', 'Dolby Atmos', 'Luxury Bar & Lounge', 'VIP Recliners'],
    rating: 4.8,
    totalReviews: 1850,
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'CineBook Ambience Grand',
    chain: 'CineBook Premier',
    city: 'Delhi-NCR',
    area: 'Noida',
    address: 'Mall of India, Sector 18, Noida, Uttar Pradesh',
    facilities: ['4DX Motion', 'Dolby Atmos 7.1', 'Recliner Seats', 'Family Lounge'],
    rating: 4.7,
    totalReviews: 1420,
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
