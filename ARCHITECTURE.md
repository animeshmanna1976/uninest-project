# UniNest - Architecture Diagram

## System Overview

UniNest is a modern student housing platform built with Next.js 14, designed to connect students with verified properties and landlords across India.

```mermaid
graph TB
    %% Client Layer
    subgraph "Client Layer"
        WEB[Web Browser]
        MOBILE[Mobile Browser]
    end

    %% Frontend Layer
    subgraph "Frontend Layer (Next.js 14)"
        subgraph "Pages & Routes"
            HOME[Homepage /]
            PROPS[Properties /properties]
            PROP_DETAIL[Property Detail /properties/[slug]]
            LOGIN[Login /login]
            REGISTER[Register /register]
            DASH_STUDENT[Student Dashboard /dashboard/student]
            DASH_LANDLORD[Landlord Dashboard /dashboard/landlord]
            WISHLIST[Wishlist /wishlist]
            ROOMMATES[Roommates /roommates]
        end

        subgraph "Components"
            UI_COMP[UI Components<br/>- Button, Card, Input<br/>- Dialog, Dropdown<br/>- Tabs, Badge, etc.]
            LAYOUT_COMP[Layout Components<br/>- Header, Footer<br/>- Navigation]
            PROP_COMP[Property Components<br/>- PropertyCard<br/>- PropertyMap]
            SEARCH_COMP[Search Components<br/>- SearchFilters<br/>- SearchResults]
        end

        subgraph "State Management"
            AUTH_CTX[Auth Context<br/>- User state<br/>- Login/Logout<br/>- Registration]
            PROVIDERS[Providers<br/>- Theme Provider<br/>- Auth Provider]
        end
    end

    %% API Layer
    subgraph "API Layer (Next.js API Routes)"
        subgraph "Authentication APIs"
            AUTH_LOGIN[POST /api/auth/login]
            AUTH_REGISTER[POST /api/auth/register]
            AUTH_ME[GET /api/auth/me]
        end

        subgraph "Property APIs"
            PROP_API[GET/POST /api/properties]
            PROP_SEARCH[GET /api/properties/search]
        end

        subgraph "User APIs"
            INQUIRY_API[POST /api/inquiries]
            WISHLIST_API[GET/POST /api/wishlist]
        end
    end

    %% Business Logic Layer
    subgraph "Business Logic Layer"
        subgraph "Authentication"
            JWT_AUTH[JWT Authentication<br/>- Token generation<br/>- Token validation<br/>- Password hashing]
            USER_MGMT[User Management<br/>- Registration<br/>- Profile management<br/>- Role-based access]
        end

        subgraph "Property Management"
            PROP_LOGIC[Property Logic<br/>- CRUD operations<br/>- Search & filtering<br/>- Verification]
            SEARCH_LOGIC[Search Logic<br/>- Location-based search<br/>- Filter processing<br/>- Sorting algorithms]
        end

        subgraph "Communication"
            INQUIRY_LOGIC[Inquiry System<br/>- Student inquiries<br/>- Landlord responses<br/>- Status tracking]
            NOTIFICATION[Notification System<br/>- Email notifications<br/>- In-app alerts]
        end
    end

    %% Data Layer
    subgraph "Data Layer"
        subgraph "Database (MongoDB)"
            USERS_COL[(Users Collection<br/>- User profiles<br/>- Authentication data<br/>- Role information)]
            PROPS_COL[(Properties Collection<br/>- Property listings<br/>- Images & amenities<br/>- Location data)]
            INQUIRIES_COL[(Inquiries Collection<br/>- Student inquiries<br/>- Communication logs)]
            REVIEWS_COL[(Reviews Collection<br/>- Property reviews<br/>- Ratings & feedback)]
            WISHLIST_COL[(Wishlist Collection<br/>- Saved properties<br/>- User preferences)]
        end

        subgraph "Static Data"
            JSON_DATA[JSON Files<br/>- properties.json<br/>- colleges.json<br/>- roommates.json<br/>- reviews.json]
        end
    end

    %% External Services
    subgraph "External Services"
        MAPS[Maps Service<br/>Leaflet/OpenStreetMap<br/>- Property locations<br/>- Distance calculations]
        EMAIL[Email Service<br/>- Notifications<br/>- Verification emails]
        STORAGE[File Storage<br/>- Property images<br/>- User documents]
    end

    %% Infrastructure
    subgraph "Infrastructure"
        VERCEL[Vercel Deployment<br/>- Static site hosting<br/>- Serverless functions<br/>- CDN]
        MONGODB_ATLAS[MongoDB Atlas<br/>- Cloud database<br/>- Automatic scaling<br/>- Backup & recovery]
    end

    %% Connections
    WEB --> HOME
    WEB --> PROPS
    WEB --> LOGIN
    MOBILE --> HOME
    MOBILE --> PROPS

    HOME --> UI_COMP
    PROPS --> PROP_COMP
    PROPS --> SEARCH_COMP
    LOGIN --> AUTH_CTX

    AUTH_CTX --> AUTH_LOGIN
    AUTH_CTX --> AUTH_REGISTER
    AUTH_CTX --> AUTH_ME

    PROP_COMP --> PROP_API
    SEARCH_COMP --> PROP_API

    AUTH_LOGIN --> JWT_AUTH
    AUTH_REGISTER --> USER_MGMT
    PROP_API --> PROP_LOGIC
    INQUIRY_API --> INQUIRY_LOGIC

    JWT_AUTH --> USERS_COL
    USER_MGMT --> USERS_COL
    PROP_LOGIC --> PROPS_COL
    INQUIRY_LOGIC --> INQUIRIES_COL

    PROP_LOGIC --> MAPS
    INQUIRY_LOGIC --> EMAIL
    PROP_LOGIC --> STORAGE

    %% Deployment
    HOME -.-> VERCEL
    PROP_API -.-> VERCEL
    USERS_COL -.-> MONGODB_ATLAS
    PROPS_COL -.-> MONGODB_ATLAS

    %% Styling
    classDef frontend fill:#e1f5fe
    classDef api fill:#f3e5f5
    classDef business fill:#e8f5e8
    classDef data fill:#fff3e0
    classDef external fill:#fce4ec
    classDef infra fill:#f1f8e9

    class HOME,PROPS,PROP_DETAIL,LOGIN,REGISTER,DASH_STUDENT,DASH_LANDLORD,WISHLIST,ROOMMATES,UI_COMP,LAYOUT_COMP,PROP_COMP,SEARCH_COMP,AUTH_CTX,PROVIDERS frontend
    class AUTH_LOGIN,AUTH_REGISTER,AUTH_ME,PROP_API,PROP_SEARCH,INQUIRY_API,WISHLIST_API api
    class JWT_AUTH,USER_MGMT,PROP_LOGIC,SEARCH_LOGIC,INQUIRY_LOGIC,NOTIFICATION business
    class USERS_COL,PROPS_COL,INQUIRIES_COL,REVIEWS_COL,WISHLIST_COL,JSON_DATA data
    class MAPS,EMAIL,STORAGE external
    class VERCEL,MONGODB_ATLAS infra
```

## Architecture Layers

### 1. Client Layer
- **Web Browser**: Desktop and mobile web access
- **Mobile Browser**: Responsive design for mobile devices

### 2. Frontend Layer (Next.js 14)
- **App Router**: Modern Next.js routing with app directory
- **Server Components**: Optimized rendering and performance
- **Client Components**: Interactive UI with React hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives

### 3. API Layer (Next.js API Routes)
- **Authentication APIs**: Login, registration, user management
- **Property APIs**: CRUD operations, search, filtering
- **User APIs**: Inquiries, wishlist, preferences
- **RESTful Design**: Standard HTTP methods and status codes

### 4. Business Logic Layer
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Property Management**: Search algorithms, verification workflows
- **Communication**: Inquiry system, notifications
- **Role-based Access**: Student vs Landlord permissions

### 5. Data Layer
- **MongoDB**: Primary database for dynamic data
- **Collections**: Users, Properties, Inquiries, Reviews, Wishlist
- **JSON Files**: Static data for development and seeding
- **Prisma Schema**: Database modeling and type generation

### 6. External Services
- **Maps**: Leaflet for property locations and distance calculations
- **Email**: Notification and verification services
- **File Storage**: Property images and user documents

### 7. Infrastructure
- **Vercel**: Deployment platform with serverless functions
- **MongoDB Atlas**: Cloud database with automatic scaling
- **CDN**: Global content delivery for static assets

## Key Features by User Role

### Students
- Property search and filtering
- Wishlist and saved searches
- Inquiry system
- Roommate finder
- Review and rating system

### Landlords
- Property listing management
- Inquiry management
- Dashboard with analytics
- Verification system

### Admin (Future)
- User and property moderation
- Verification workflows
- Analytics and reporting

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Maps**: React Leaflet

### Backend
- **Runtime**: Node.js (Serverless)
- **API**: Next.js API Routes
- **Authentication**: JWT + bcryptjs
- **Validation**: Zod schemas

### Database
- **Primary**: MongoDB with Mongoose/Native Driver
- **ORM**: Prisma (schema definition)
- **Caching**: In-memory caching for static data

### DevOps
- **Deployment**: Vercel
- **Database**: MongoDB Atlas
- **Version Control**: Git
- **Package Manager**: npm

## Security Considerations

1. **Authentication**: JWT tokens with HTTP-only cookies
2. **Password Security**: bcrypt hashing with salt rounds
3. **Input Validation**: Zod schemas for API validation
4. **CORS**: Configured for secure cross-origin requests
5. **Environment Variables**: Secure configuration management

## Performance Optimizations

1. **Server Components**: Reduced client-side JavaScript
2. **Image Optimization**: Next.js Image component
3. **Static Generation**: Pre-rendered pages where possible
4. **Database Indexing**: Optimized queries with proper indexes
5. **Caching**: Connection pooling and query result caching

## Scalability Considerations

1. **Serverless Architecture**: Auto-scaling with Vercel
2. **Database Sharding**: MongoDB Atlas auto-sharding
3. **CDN**: Global content delivery
4. **Microservices Ready**: API structure supports service separation
5. **Horizontal Scaling**: Stateless design for easy scaling