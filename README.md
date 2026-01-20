# 🏠 UniNest - Student Housing Platform

A modern student housing and rental platform built with Next.js 14, designed to help students find their perfect accommodation near colleges and universities in India.

![UniNest](https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&h=400&fit=crop)

## ✨ Features

### For Students

- 🔍 **Smart Search** - Search properties by location, college, or keywords
- 🏘️ **Property Listings** - Browse PGs, hostels, flats, and co-living spaces
- 📍 **Location-Based Discovery** - Find accommodations near your college
- ⭐ **Reviews & Ratings** - Read authentic reviews from verified tenants
- ❤️ **Wishlist** - Save your favorite properties for later
- 🎯 **Advanced Filters** - Filter by price, amenities, gender, and more
- 👥 **Roommate Finder** - Find compatible roommates based on preferences

### Property Types

- PG (Paying Guest)
- Hostel
- Flat/Apartment
- Co-living Spaces
- Studio Apartments
- Shared Rooms

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **State Management:** Zustand + TanStack Query
- **Database ORM:** Prisma (optional - using mock data)
- **Icons:** Lucide React
- **Maps:** Leaflet (planned)
- **Form Handling:** React Hook Form + Zod

## 📁 Project Structure

```
uni-nest/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   ├── properties/         # Properties listing & detail pages
│   │   └── providers.tsx       # Client-side providers
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── layout/             # Header, Footer components
│   │   ├── property/           # Property-related components
│   │   └── search/             # Search & filter components
│   ├── data/                   # Mock JSON data
│   │   ├── properties.json     # Property listings
│   │   ├── reviews.json        # User reviews
│   │   ├── roommates.json      # Roommate profiles
│   │   └── colleges.json       # College & city data
│   ├── lib/                    # Utility functions
│   │   ├── utils.ts            # Helper functions
│   │   └── validations.ts      # Zod schemas
│   └── types/                  # TypeScript definitions
├── prisma/
│   └── schema.prisma           # Database schema (optional)
├── public/                     # Static assets
├── tailwind.config.ts          # Tailwind configuration
├── next.config.js              # Next.js configuration
└── package.json                # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm** or **yarn** or **pnpm**

### Installation

1. **Clone or navigate to the project directory**

   ```bash
   cd uni-nest
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

   You should see the UniNest homepage!

### Available Scripts

| Command         | Description                           |
| --------------- | ------------------------------------- |
| `npm run dev`   | Start development server on port 3000 |
| `npm run build` | Build the application for production  |
| `npm run start` | Start production server               |
| `npm run lint`  | Run ESLint for code quality           |

## 📱 Pages

| Route                | Description                                           |
| -------------------- | ----------------------------------------------------- |
| `/`                  | Homepage with hero, features, and featured properties |
| `/properties`        | Property listings with search and filters             |
| `/properties/[slug]` | Individual property detail page                       |

## 🎨 UI Components

The project uses a comprehensive set of reusable UI components:

- **Button** - Various button styles and sizes
- **Input** - Text input with variants
- **Card** - Container component for content
- **Dialog** - Modal dialogs
- **Tabs** - Tab navigation
- **Badge** - Status badges and labels
- **Avatar** - User profile images
- **Dropdown** - Dropdown menus
- **Skeleton** - Loading placeholders
- And many more...

## 📊 Mock Data

The application uses mock JSON data for demonstration:

- **12 Properties** - Diverse listings across Indian cities
- **10+ Reviews** - Detailed user reviews
- **12 Roommate Profiles** - For roommate finder feature
- **15 Colleges** - Popular colleges and universities
- **8 Cities** - Major student cities in India

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env.local` file for custom configuration:

```env
# Database (if using Prisma)
DATABASE_URL="postgresql://..."

# Authentication (if implementing auth)
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Tailwind CSS

Custom theme colors and configurations are in `tailwind.config.ts`:

- Primary color: Blue (#3B82F6)
- Custom animations
- Extended color palette

## 🚧 Upcoming Features

- [ ] User Authentication (NextAuth.js)
- [ ] Interactive Maps (Leaflet integration)
- [ ] Roommate Finder with matching algorithm
- [ ] Property Comparison tool
- [ ] Booking/Visit scheduling
- [ ] Messaging system
- [ ] Admin dashboard
- [ ] Landlord portal

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Unsplash](https://unsplash.com/) for images

---

Made with ❤️ for students finding their home away from home
