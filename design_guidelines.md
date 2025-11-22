# Design Guidelines - يلا اشحن (Yalla Ashan)

**CRITICAL: Preserve ALL existing design patterns. Only complete missing elements and fix issues.**

## Design Approach
Reference-based approach inspired by modern Arabic gaming/digital services platforms with glass-morphism aesthetic. Maintain existing RTL (right-to-left) layout and Arabic-first user experience.

## Core Design Elements

### Typography
- **Primary Font**: Cairo (Google Fonts) - weights 400, 600, 700
- **Hierarchy**: 
  - H1: 24px, weight 700
  - H2: 22px, weight 700
  - H3: 18-20px, weight 700
  - Body: 15px, weight 400
  - Labels: 14px, weight 400
  - Small text: 12-13px

### Color System (DO NOT CHANGE)
- **Background Base**: #041022 (dark navy)
- **Glass Overlays**: rgba(255,255,255,0.03) to rgba(255,255,255,0.06)
- **Accent Gradient**: linear-gradient(90deg, #7c3aed, #06b6d4) [purple to cyan]
- **Highlight/Brand**: #ffd166 (golden yellow)
- **Text Primary**: #eaf0ff (light blue-white)
- **Text Muted**: rgba(230,240,255,0.75)
- **Success/Balance**: #00c4ff, #31f0a1 (cyan/mint)

### Layout System
- **Direction**: RTL (right-to-left)
- **Spacing**: Use Tailwind-equivalent units - primarily 8px, 12px, 16px, 18px, 24px
- **Container Widths**: 
  - Small pages: max-width 600px
  - Standard: max-width 1000-1100px
  - Full-width sections with inner constraints

### Component Library

#### Navigation
- **Top Bar**: Sticky, glass-morphism background (blur 8px), 12px vertical padding
- **Sidebar**: 320px wide, slide from right, glass background with blur 12-14px, rounded left corners
- **Menu Items**: 10px margin, rounded 10px, subtle hover state (rgba white overlay)

#### Cards & Containers
- **Glass Card**: Linear gradient background, 1px border rgba(255,255,255,0.06), 14px border-radius, 16-18px padding, backdrop-filter blur(8px), subtle shadow
- **Product Grid**: 3 columns desktop (2 on tablet, 1 mobile), 14px gap, 120px height per item
- **Product Card**: Glass effect, 16px border-radius, press animation (pulse on click)

#### Buttons
- **Primary**: Linear gradient (cyan to purple), rounded 10-12px, 12-14px vertical padding, weight 600-700
- **Secondary**: Darker gradient (#3b3f6b to #6b4bd6)
- **Accent/Warning**: Gradient with pink/coral tones (#ff7aa2, #ff8ec6)

#### Forms & Inputs
- **Input Fields**: Full width, 10-12px padding, rounded 10-12px, background rgba(255,255,255,0.02-0.05), 1px border rgba(255,255,255,0.08)
- **File Upload**: Dashed border, centered upload area, clear instructions in Arabic
- **Labels**: Display block, 6px bottom margin, muted color

#### Modals
- **Overlay**: Dark gradient background rgba(0,0,0,0.55-0.7)
- **Modal Card**: Max-width 520px, dark gradient background, rounded 16px, shadow heavy (0 30px 80px)
- **Close Button**: Absolute positioned top-right

### Animations
- **Sidebar**: Slide transition 0.28s cubic-bezier
- **Product Press**: 360ms pulse animation (scale 1.03, translate Y -10px at 50%)
- **Hover States**: 0.3s transitions for transforms and backgrounds
- **NO excessive animations** - keep interactions purposeful

### Specific Page Patterns

#### Product Pages
- 3x3 grid layout
- Hero section with icon + tagline
- Each product: clickable, animated press feedback, navigates to detail page

#### Detail Pages
- Product header with image (160px), name, description
- Detail boxes (chips) showing options
- Form section: User ID, WhatsApp, Payment method
- Full-width confirm button with emoji

#### Wallet Page
- Balance display prominent (22px, cyan color)
- Action buttons row
- Summary grid (2 columns on desktop)
- Modal for add balance with payment method selection and instructions
- File upload for receipt

#### Account Page
- Info rows (flex space-between)
- Copy button for account number
- Collapsible edit section (max-height transition)
- Action buttons (edit + logout)

### Missing Elements to Complete
1. **Product detail pages** - Create for all product grid items (s1-p1 through p9, cards1-9, special1-9)
2. **Payment instructions** - Complete all payment method data in wallet modal
3. **Backend integration** - Firebase authentication already started, complete data persistence
4. **Image assets** - Add product images for all grid items (currently empty divs)
5. **Order history** - Complete orders page with real data display
6. **Agents page FAQ** - Complete remaining FAQ items (file appears truncated)

### Responsive Behavior
- **Desktop**: 3-column grids, full sidebar width
- **Tablet** (≤820px): 2-column grids
- **Mobile** (≤620px): 1-column grids, sidebar 92% width
- Maintain glass effects and animations across all breakpoints

### Accessibility
- aria-labels on buttons
- aria-hidden states for sidebar
- Keyboard navigation (Enter on products)
- Focus states on interactive elements

**DO NOT**: Change color scheme, typography, spacing system, or core component designs. Only complete missing pages and fix functionality issues.