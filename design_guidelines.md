# MGNREGA District Dashboard - Design Guidelines

## Design Approach

**Selected System:** Material Design  
**Rationale:** Government data dashboards require clarity, accessibility, and proven usability patterns. Material Design provides robust components for data visualization, strong accessibility foundations, and familiar patterns for public-facing applications.

## Core Design Principles

1. **Data-First Architecture** - Information hierarchy optimized for quick scanning and comprehension
2. **Bilingual Accessibility** - Equal prominence for Marathi and English throughout
3. **Mobile-First Responsive** - Touch-friendly targets, generous spacing, readable text sizes
4. **Performance Indicators** - Clear visual differentiation for metric performance states

---

## Typography System

### Font Families
- **Primary:** 'Noto Sans', 'Noto Sans Devanagari' (Google Fonts) - Excellent Marathi script support
- **Monospace:** 'Roboto Mono' (for numerical data)

### Type Scale
- **Header Title:** 32px/40px (mobile: 24px/32px) - Bold
- **Section Headers:** 24px/32px (mobile: 20px/28px) - Semibold  
- **Metric Labels:** 14px/20px - Medium
- **Metric Values:** 28px/36px (mobile: 24px/32px) - Bold, Tabular Numbers
- **Body Text:** 16px/24px - Regular
- **Chart Labels:** 12px/16px - Medium
- **Footer Text:** 14px/20px - Regular

### Hierarchy Rules
- Bilingual labels stacked vertically: English on top (14px), Marathi below (13px), both medium weight
- Numerical data always uses tabular figures for alignment
- Metric cards: value emphasized 2x larger than label

---

## Layout System

### Spacing Primitives
**Tailwind Units:** Consistently use 2, 4, 6, 8, 12, 16, 20 units
- Component padding: p-4 (mobile), p-6 (tablet), p-8 (desktop)
- Card spacing: gap-4 (mobile), gap-6 (desktop)
- Section margins: my-8 (mobile), my-12 (desktop)
- Element spacing: space-y-2 for tight groups, space-y-4 for sections

### Grid Structure
```
Mobile: Single column, full-width cards
Tablet: 2-column metric cards, single-column chart
Desktop: 3-column metric cards, full-width chart below

Container: max-w-7xl mx-auto px-4 md:px-6 lg:px-8
```

### Page Layout
```
Header (sticky): 64px height, includes title + district selector
Content Area: Metrics cards + Chart section
Footer: 48px height, minimal
```

---

## Component Library

### 1. Header Component
**Structure:**
- Fixed/sticky top bar spanning full width
- Left: Dashboard title (bilingual stacked)
- Right: District selector dropdown
- Height: 64px with py-4 padding
- Shadow elevation: md

### 2. District Selector
**Specifications:**
- Custom select with search functionality
- Minimum touch target: 48px height
- Icon: Location pin (left), Dropdown chevron (right)
- Shows "Auto-detected" badge when geolocation used
- Width: 280px (desktop), full-width (mobile)

### 3. Metric Cards
**Layout:**
- Grid of 3 cards (desktop), 2 (tablet), 1 (mobile)
- Card dimensions: min-height 140px, equal width distribution
- Padding: p-6 (all sides)
- Rounded corners: rounded-lg
- Shadow: Elevated with lg shadow

**Content Structure:**
```
Icon (top-left): 40px × 40px
Label (bilingual stacked): Below icon, space-y-1
Value: Large numerical display, bottom-aligned
Trend Indicator: Small icon + percentage (if applicable)
```

**Icons:** Use Material Icons
- People Benefited: group
- Person-Days: event_available  
- Wages Paid: payments

### 4. Performance Indicators
**Visual States:**
- Performance icons: 24px, placed inline with metrics
- Up/down trend arrows: 16px
- No color references - rely on iconography

### 5. Chart Component
**Specifications:**
- Full-width container with max-w-6xl
- Height: 400px (desktop), 320px (mobile)
- Padding: p-8 (desktop), p-4 (mobile)
- Background: Subtle elevation card
- Rounded: rounded-lg

**Chart Configuration (Recharts):**
- Bar chart with 6 months of data
- X-axis: Month labels (bilingual where needed)
- Y-axis: Formatted with ₹ symbol and K/L suffixes
- Bars: Width 40px, rounded corners
- Grid: Horizontal lines only, subtle
- Tooltip: Custom design with metric breakdowns
- Responsive: maintainAspectRatio

### 6. Loading State
**Spinner:**
- Centered circular spinner
- Size: 48px diameter
- Accompanied by "Loading data..." text (bilingual)
- Overlay: Full-page with backdrop blur

### 7. Error State
**Card:**
- Centered in viewport
- Icon: error_outline (Material Icons, 64px)
- Message: Clear bilingual error text
- Retry button: Large, prominent (min-height 48px)
- Width: max-w-md

### 8. Info Button (Optional TTS)
**Specifications:**
- Floating action button (FAB): bottom-right, 56px diameter
- Icon: help_outline
- Elevation: High shadow
- Positioned: 20px from bottom-right edges
- Tooltip on hover: "Listen to explanation"

### 9. Footer
**Layout:**
- Full-width bar
- Text centered: "Data Source: data.gov.in"
- Height: 48px, flex-centered
- Typography: 14px, medium weight
- Links underlined on interaction

---

## Mobile Optimization

### Touch Targets
- Minimum: 48px × 48px for all interactive elements
- Buttons: min-height 48px, px-6 horizontal padding
- Dropdown: Full-width on mobile with 56px height

### Responsive Breakpoints
```
Mobile: < 768px - Single column, stacked layout
Tablet: 768px - 1024px - 2-column metrics, optimized chart
Desktop: > 1024px - 3-column metrics, full-width chart
```

### Text Scaling
- Base font size increases to 16px on mobile
- Metric values: 24px (mobile) vs 28px (desktop)
- Ensure minimum 16px for all body text

---

## Accessibility Standards

- All interactive elements keyboard navigable
- ARIA labels for icon-only buttons
- Form inputs with proper labels (district selector)
- Loading and error states announced to screen readers
- Focus indicators: 2px outline with offset
- Contrast ratios meet WCAG AA minimum
- Skip to content link for keyboard users

---

## Animation Guidelines

**Use Sparingly:**
- Page transitions: None - instant rendering
- Data loading: Simple fade-in (200ms) for cards after load
- Chart rendering: Recharts default animation (800ms ease-out)
- Dropdown: Slide-down (150ms) for menu reveal
- Error/success states: Gentle fade-in (300ms)

**Avoid:**
- Scroll animations
- Parallax effects
- Complex transitions
- Auto-playing content

---

## Images

**No hero images required** - This is a data dashboard, not a marketing page.

**Icon Usage:**
- All icons from Material Icons via CDN
- Performance state icons embedded inline with metrics
- Location pin icon in selector
- Info/help icon for TTS feature

---

This design creates a professional, accessible government dashboard prioritizing data clarity and mobile usability while maintaining cultural relevance through bilingual support.