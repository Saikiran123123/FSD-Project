import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Theatre from '../models/Theatre.js';
import Screen from '../models/Screen.js';
import Show from '../models/Show.js';
import FoodItem from '../models/FoodItem.js';
import Offer from '../models/Offer.js';
import Review from '../models/Review.js';
import { FALLBACK_MOVIES } from '../services/tmdbService.js';
import { generateDefaultSeats } from '../controllers/showController.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Starting sample data initialization...');

    // 1. Users
    const existingAdmin = await User.findOne({ email: 'admin@cinebook.com' });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const adminPass = await bcrypt.hash('Admin@123', salt);
      const userPass = await bcrypt.hash('User@123', salt);

      await User.create([
        {
          name: 'CineBook Admin',
          email: 'admin@cinebook.com',
          password: adminPass,
          role: 'admin',
          preferredCity: 'Hyderabad',
        },
        {
          name: 'Sai Kiran',
          email: 'user@cinebook.com',
          password: userPass,
          role: 'user',
          phone: '+91 9876543210',
          preferredCity: 'Hyderabad',
          favoriteGenres: ['Science Fiction', 'Action', 'Adventure'],
        },
      ]);
      console.log('[Seed] Default users created (Admin: admin@cinebook.com / Admin@123, User: user@cinebook.com / User@123)');
    }

    // 2. Theatres & Screens
    const theatreCount = await Theatre.countDocuments();
    let sampleTheatres = [];
    if (theatreCount === 0) {
      sampleTheatres = await Theatre.create([
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
          name: 'PVR Forum Mall (IMAX with Laser)',
          chain: 'PVR Cinemas',
          city: 'Bengaluru',
          area: 'Koramangala',
          address: 'The Forum Mall, Hosur Road, Koramangala, Bengaluru',
          facilities: ['IMAX with Laser', 'Dolby Atmos', 'Gold Class Recliners', 'Wheelchair Access'],
          rating: 4.9,
          totalReviews: 1800,
          image: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=1200&auto=format&fit=crop&q=80',
        },
        {
          name: 'INOX Megaplex Inorbit Mall',
          chain: 'INOX Multiplex',
          city: 'Mumbai',
          area: 'Malad West',
          address: 'Inorbit Mall, Link Road, Malad West, Mumbai',
          facilities: ['IMAX 3D', 'ScreenX 270°', 'MX4D Motion', 'INSIGNIA Lounge'],
          rating: 4.8,
          totalReviews: 2150,
          image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1200&auto=format&fit=crop&q=80',
        },
      ]);
      console.log(`[Seed] Created ${sampleTheatres.length} theatres.`);

      // Create screens for each theatre
      for (const th of sampleTheatres) {
        await Screen.create([
          {
            theatreId: th._id,
            screenNumber: 1,
            name: 'Audi 1 (IMAX 3D Laser)',
            soundSystem: 'Dolby Atmos 12.1',
            projectionType: 'IMAX 3D',
            totalSeats: 80,
          },
          {
            theatreId: th._id,
            screenNumber: 2,
            name: 'Audi 2 (4K Dolby)',
            soundSystem: 'Dolby Atmos 7.1',
            projectionType: '2D',
            totalSeats: 80,
          },
        ]);
      }
    } else {
      sampleTheatres = await Theatre.find();
    }

    // 3. Shows
    const showCount = await Show.countDocuments();
    if (showCount === 0 && sampleTheatres.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const dayAfter = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];

      const dates = [today, tomorrow, dayAfter];
      const times = ['10:30 AM', '02:00 PM', '06:15 PM', '09:45 PM'];

      for (const theatre of sampleTheatres) {
        const screens = await Screen.find({ theatreId: theatre._id });
        const screen = screens[0] || { _id: theatre._id, name: 'Audi 1' };

        for (const movie of FALLBACK_MOVIES.slice(0, 4)) {
          for (const date of dates) {
            for (const time of times.slice(0, 2)) {
              const seats = generateDefaultSeats(280);
              // Pre-occupy a few seats randomly for realistic demand demo
              seats[12].status = 'booked';
              seats[13].status = 'booked';
              seats[25].status = 'booked';
              seats[45].status = 'booked';
              seats[46].status = 'booked';

              await Show.create({
                tmdbMovieId: movie.id,
                movieTitle: movie.title,
                moviePoster: movie.poster_path,
                theatreId: theatre._id,
                screenId: screen._id,
                screenName: screen.name || 'Audi 1',
                format: screen.projectionType || '2D',
                language: 'English',
                showDate: date,
                startTime: time,
                basePrice: 280,
                seats,
              });
            }
          }
        }
      }
      console.log('[Seed] Created initial cinema shows with seat layouts.');
    }

    // 4. Food Items
    const foodCount = await FoodItem.countDocuments();
    if (foodCount === 0) {
      await FoodItem.create([
        {
          name: 'Caramel Gold Crunch Popcorn',
          category: 'Popcorn',
          description: 'Large gourmet jumbo popcorn tossed in rich Belgian caramel glaze.',
          price: 240,
          image: 'https://images.unsplash.com/photo-1572177812156-58036aae439c?w=600&auto=format&fit=crop&q=80',
          isVegetarian: true,
          badge: 'Bestseller',
        },
        {
          name: 'Cheese Burst Tub Popcorn',
          category: 'Popcorn',
          description: 'Classic crunchy popcorn dusted with sharp cheddar cheese seasoning.',
          price: 220,
          image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&auto=format&fit=crop&q=80',
          isVegetarian: true,
          badge: 'Popular',
        },
        {
          name: 'Blockbuster Duo Combo',
          category: 'Combos',
          description: '1 Large Tub Popcorn + 2 Large Fountain Sodas (750ml) + Nachos Supreme.',
          price: 499,
          image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=600&auto=format&fit=crop&q=80',
          isVegetarian: true,
          badge: 'Value Saver',
        },
        {
          name: 'Loaded Mexican Nachos',
          category: 'Snacks',
          description: 'Crispy corn tortilla chips with warm cheese sauce and spicy jalapeño salsa.',
          price: 190,
          image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&auto=format&fit=crop&q=80',
          isVegetarian: true,
        },
        {
          name: 'Chilled Pepsi Zero (750ml)',
          category: 'Beverages',
          description: 'Ice cold fountain beverage with zero calories.',
          price: 120,
          image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=600&auto=format&fit=crop&q=80',
          isVegetarian: true,
        },
        {
          name: 'Belgian Choco-Lava Sundae',
          category: 'Desserts',
          description: 'Warm chocolate fudge cake topped with vanilla ice cream and crushed nuts.',
          price: 160,
          image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80',
          isVegetarian: true,
          badge: 'Chef Special',
        },
      ]);
      console.log('[Seed] Created delicious Food & Combo catalog.');
    }

    // 5. Offers
    const offerCount = await Offer.countDocuments();
    if (offerCount === 0) {
      await Offer.create([
        {
          code: 'FIRST50',
          title: '50% First Movie Welcome Bonus',
          description: 'Get 50% discount up to ₹200 on your very first CineBook ticket reservation.',
          discountType: 'percentage',
          discountValue: 50,
          maxDiscount: 200,
          firstBookingOnly: true,
        },
        {
          code: 'WEEKEND20',
          title: 'Weekend Cinema Fest',
          description: 'Get 20% off on all weekend IMAX and Dolby show bookings.',
          discountType: 'percentage',
          discountValue: 20,
          maxDiscount: 150,
          minBookingAmount: 400,
        },
        {
          code: 'GROUP10',
          title: 'Squad & Family Saver',
          description: '10% instant discount when booking 4 or more seats together.',
          discountType: 'percentage',
          discountValue: 10,
          maxDiscount: 300,
          minSeatsCount: 4,
        },
        {
          code: 'FOODLOVE',
          title: 'Snack Feast ₹100 Off',
          description: 'Flat ₹100 instant cashback discount on food orders above ₹300.',
          discountType: 'flat',
          discountValue: 100,
          applicableOnFoodOnly: true,
          minBookingAmount: 300,
        },
      ]);
      console.log('[Seed] Created promotional discount offers.');
    }

    console.log('[Seed] Database initialization complete! Ready for bookings.');
  } catch (error) {
    console.error(`[Seed] Error initializing seed data: ${error.message}`);
  }
};

// If run directly via node
if (process.argv[1]?.endsWith('seedData.js')) {
  mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cinebook')
    .then(async () => {
      await seedDatabase();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
