# Yalla Ashan - يلا اشحن

## Overview

Yalla Ashan is an Arabic-first gaming recharge platform that enables users to purchase game credits, gift cards, and digital gaming products. The application features a modern glass-morphism design with RTL (right-to-left) layout, supporting multiple payment methods popular in Arabic-speaking regions including Bank Khartoum, Fawry, Kashi, and Zaincash.

The platform includes user authentication, wallet management, order tracking, and an admin dashboard for managing products, users, and orders.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type safety
- Wouter for lightweight client-side routing
- TanStack Query for server state management
- Tailwind CSS with custom design tokens for styling
- Shadcn/ui component library (New York variant) for UI primitives

**Design System:**
- RTL-first layout using CSS `direction: rtl`
- Cairo font family (Google Fonts) with weights 400, 600, 700
- Glass-morphism aesthetic with backdrop filters and RGBA overlays
- Dark theme base (#041022) with purple-to-cyan gradient accents
- Golden yellow (#ffd166) highlights for branding
- Responsive grid system supporting 3-column desktop, 2-column tablet, 1-column mobile layouts

**Component Architecture:**
- Shared components: TopBar (sticky header), Sidebar (slide-in navigation), ProductGrid (dynamic product display)
- Page-based routing with protected routes requiring authentication
- Inline styles used throughout for precise control matching design specifications
- No CSS modules; styles embedded directly in components or in index.css

**State Management:**
- Local storage for authentication tokens and user data
- React hooks (useState, useEffect) for component-level state
- Custom auth utility module for centralized authentication logic

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- Development mode: Vite dev server with HMR
- Production mode: Pre-built static files served by Express

**API Design:**
- RESTful endpoints organized by resource type (users, products, orders)
- CRUD operations for all major entities
- Session-based authentication with cookie support
- JSON request/response format

**Key Endpoints:**
- `/api/login` - User authentication
- `/api/register` - New user registration
- `/api/users/*` - User management and balance updates
- `/api/products/*` - Product catalog operations
- `/api/orders/*` - Order creation and status tracking

**Request Processing:**
- Express middleware for JSON parsing (50mb limit)
- Raw body preservation for webhook verification
- Request logging with timestamp and duration tracking
- Error handling with appropriate HTTP status codes

### Data Storage

**Database Solution:**
- Drizzle ORM configured for PostgreSQL
- Neon Database serverless PostgreSQL as primary provider
- Schema-first approach with TypeScript type inference
- Migration system using drizzle-kit

**Schema Design:**
- `users` table: Authentication, profile info, wallet balance, role-based access (user/admin)
- `products` table: Name, price, category (games/cards/special), packages (JSON), display order
- `orders` table: User-product relationships, payment details, order status workflow, timestamps

**Data Models:**
- UUID primary keys via `gen_random_uuid()`
- Text fields for flexible content storage
- Integer-based pricing (likely in fils/cents)
- JSON text fields for complex data (product packages)
- Status enums: "pending", "completed", "cancelled"

**In-Memory Fallback:**
- MemStorage class implementing IStorage interface
- Map-based storage for development/testing
- Pre-seeded admin user (admin@yallaashan.com / admin123)
- No data persistence across server restarts

### Authentication & Authorization

**Authentication Flow:**
- Email/password credential-based login
- Client-side token storage in localStorage
- User object persistence for quick access
- Simple logout mechanism clearing local storage

**Authorization:**
- Role-based access control (user vs admin)
- Admin routes protected with role verification
- Protected frontend routes using HOC pattern
- Redirect to login for unauthorized access

**Security Considerations:**
- Plain text password storage in current implementation (not production-ready)
- No JWT or session tokens currently implemented
- Client-side only authorization checks (vulnerable to tampering)

## External Dependencies

### Third-Party UI Libraries

**Radix UI Primitives:**
- Unstyled, accessible component primitives for dialogs, dropdowns, accordions, alerts, and form controls
- Provides keyboard navigation, ARIA attributes, and focus management
- Wrapped by Shadcn/ui components with Tailwind styling

**Embla Carousel:**
- Touch-friendly carousel/slider component
- Used for potential product showcases or image galleries

**Lucide React:**
- Icon library for consistent iconography
- Tree-shakeable for optimal bundle size

### Payment Integration

**Payment Methods Supported:**
- Bank Khartoum (Sudanese bank transfer)
- Fawry (Egyptian payment network)
- Kashi (mobile wallet)
- Zaincash (telecommunications payment)

**Payment Flow:**
- Manual proof-of-payment upload system
- Image-based transaction verification
- Admin review required for order completion
- No automated payment gateway integration

### Font & Asset Delivery

**Google Fonts:**
- Cairo font family loaded via CDN
- Preconnect optimization for performance
- Multiple weights (400, 600, 700) for typographic hierarchy

**Static Assets:**
- Attached_assets folder contains reference HTML/CSS/JS files
- Design guidelines document for maintaining visual consistency
- Product images and icons stored as text URLs

### Build & Development Tools

**Vite:**
- Fast development server with Hot Module Replacement
- React plugin for JSX transformation
- Path aliasing for clean imports (@/, @shared/, @assets/)
- Production build optimization

**TypeScript:**
- Strict mode enabled for type safety
- Path mapping for module resolution
- Incremental compilation for faster rebuilds

**Replit Plugins:**
- Runtime error modal overlay for development
- Cartographer for code navigation
- Dev banner for environment awareness

### Database & ORM

**Neon Serverless PostgreSQL:**
- Serverless database with automatic scaling
- WebSocket-based connection pooling
- Environment variable-based configuration (DATABASE_URL)

**Drizzle ORM:**
- Type-safe database queries
- Schema migration management
- Zod integration for runtime validation
- PostgreSQL dialect support

**Session Management:**
- connect-pg-simple for PostgreSQL session store
- Potential for future session-based authentication