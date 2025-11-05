# Design System - RVM Web3 Payment PWA

**Created**: 2025-11-05  
**Project Name**: RVM Web3 Payment PWA  
**Version**: 1.0  
**Status**: Initial Draft (Based on Mockups)  
**UX Agent**: UX Design Specialist

---

## 📋 Document Overview

This design system document provides comprehensive design specifications extracted from the Figma mockups. It serves as the foundation for consistent UI/UX implementation across the application.

**Design Source**: `design-assets/figma-mockups/` (9 mockup files)

---

## 🎨 Color Palette

### Primary Colors
*Note: Colors extracted from design mockups. Final values to be confirmed during implementation.*

#### Primary Brand Color
- **Primary**: [To be extracted from mockups]
  - **Usage**: Primary actions, links, brand elements
  - **Variants**: Light, Dark, Hover states

#### Secondary Colors
- **Secondary**: [To be extracted from mockups]
  - **Usage**: Secondary actions, accents
  - **Variants**: Light, Dark, Hover states

### Semantic Colors

#### Success (Green)
- **Success**: `#10B981` (suggested, verify from mockups)
- **Success Light**: `#D1FAE5`
- **Usage**: Successful transactions, positive feedback

#### Error (Red)
- **Error**: `#EF4444` (suggested, verify from mockups)
- **Error Light**: `#FEE2E2`
- **Usage**: Errors, failed transactions, warnings

#### Warning (Yellow/Orange)
- **Warning**: `#F59E0B` (suggested, verify from mockups)
- **Warning Light**: `#FEF3C7`
- **Usage**: Warnings, pending states, caution

#### Info (Blue)
- **Info**: `#3B82F6` (suggested, verify from mockups)
- **Info Light**: `#DBEAFE`
- **Usage**: Information messages, tips

### Neutral Colors

#### Background Colors
- **Background Primary**: `#FFFFFF` (white)
- **Background Secondary**: `#F9FAFB` (light gray)
- **Background Tertiary**: `#F3F4F6` (medium gray)
- **Background Dark**: `#1F2937` (dark mode)

#### Text Colors
- **Text Primary**: `#111827` (dark gray/black)
- **Text Secondary**: `#6B7280` (medium gray)
- **Text Tertiary**: `#9CA3AF` (light gray)
- **Text Inverse**: `#FFFFFF` (white, for dark backgrounds)

#### Border Colors
- **Border Light**: `#E5E7EB` (light gray)
- **Border Medium**: `#D1D5DB` (medium gray)
- **Border Dark**: `#9CA3AF` (dark gray)

### Color Usage Guidelines
- **Contrast Ratios**: All text must meet WCAG 2.1 AA standards (4.5:1 for normal text, 3:1 for large text)
- **Dark Mode**: Colors will be adjusted for dark mode support
- **Accessibility**: Never rely solely on color to convey information

---

## 📝 Typography

### Font Family
*Note: Font family to be extracted from mockups*

#### Primary Font
- **Font Family**: [To be extracted from mockups]
  - **Usage**: Body text, UI elements
  - **Fallback**: System fonts (San Francisco, Segoe UI, Roboto)

#### Secondary Font
- **Font Family**: [To be extracted from mockups]
  - **Usage**: Headings, display text
  - **Fallback**: System fonts

### Type Scale

#### Headings
- **H1**: 32px (mobile) / 40px (desktop)
  - **Weight**: 700 (Bold)
  - **Line Height**: 1.2
  - **Usage**: Page titles, hero headings

- **H2**: 24px (mobile) / 32px (desktop)
  - **Weight**: 600 (Semi-Bold)
  - **Line Height**: 1.3
  - **Usage**: Section headings

- **H3**: 20px (mobile) / 24px (desktop)
  - **Weight**: 600 (Semi-Bold)
  - **Line Height**: 1.4
  - **Usage**: Subsection headings

- **H4**: 18px (mobile) / 20px (desktop)
  - **Weight**: 600 (Semi-Bold)
  - **Line Height**: 1.4
  - **Usage**: Card titles, form labels

#### Body Text
- **Body Large**: 18px
  - **Weight**: 400 (Regular)
  - **Line Height**: 1.6
  - **Usage**: Important body text

- **Body**: 16px
  - **Weight**: 400 (Regular)
  - **Line Height**: 1.6
  - **Usage**: Default body text

- **Body Small**: 14px
  - **Weight**: 400 (Regular)
  - **Line Height**: 1.5
  - **Usage**: Secondary text, captions

#### UI Text
- **Button**: 16px
  - **Weight**: 600 (Semi-Bold)
  - **Line Height**: 1.5
  - **Usage**: Button labels

- **Label**: 14px
  - **Weight**: 500 (Medium)
  - **Line Height**: 1.5
  - **Usage**: Form labels

- **Caption**: 12px
  - **Weight**: 400 (Regular)
  - **Line Height**: 1.4
  - **Usage**: Help text, timestamps

### Typography Guidelines
- **Readability**: Minimum 16px for body text
- **Line Length**: 45-75 characters for optimal reading
- **Line Height**: 1.5-1.6 for body text
- **Spacing**: Consistent vertical rhythm

---

## 🧩 Component Library

### Buttons

#### Primary Button
```typescript
// Specifications
- Height: 48px (mobile), 44px (desktop)
- Padding: 12px 24px
- Border Radius: 8px
- Font: 16px, Semi-Bold
- Background: Primary color
- Text: White
- States: Default, Hover, Active, Disabled, Loading
```

#### Secondary Button
```typescript
// Specifications
- Height: 48px (mobile), 44px (desktop)
- Padding: 12px 24px
- Border Radius: 8px
- Font: 16px, Semi-Bold
- Background: Transparent
- Border: 2px solid primary color
- Text: Primary color
- States: Default, Hover, Active, Disabled
```

#### Icon Button
```typescript
// Specifications
- Size: 40x40px (touch target minimum 44x44px)
- Border Radius: 8px
- Icon Size: 20x20px
- States: Default, Hover, Active, Disabled
```

### Input Fields

#### Text Input
```typescript
// Specifications
- Height: 48px
- Padding: 12px 16px
- Border Radius: 8px
- Border: 1px solid border color
- Font: 16px
- Focus: 2px outline, primary color
- States: Default, Focus, Error, Disabled
```

#### Token Amount Input
```typescript
// Specifications
- Height: 56px (larger for visibility)
- Padding: 16px
- Border Radius: 12px
- Font: 24px (for amount), 14px (for label)
- Features: Max button, balance display
- States: Default, Focus, Error, Disabled
```

### Cards

#### Token Card
```typescript
// Specifications
- Padding: 16px
- Border Radius: 12px
- Background: White or secondary background
- Border: 1px solid border light (optional)
- Shadow: Subtle shadow for elevation
- Hover: Slight elevation increase
```

#### Transaction Card
```typescript
// Specifications
- Padding: 16px
- Border Radius: 8px
- Background: White
- Border: 1px solid border light
- Status Indicator: Color-coded status
- Hover: Background change
```

### Modals

#### Modal Dialog
```typescript
// Specifications
- Max Width: 500px (mobile), 600px (desktop)
- Padding: 24px
- Border Radius: 16px
- Background: White
- Shadow: Large shadow for depth
- Backdrop: Semi-transparent overlay
- Animation: Fade in/out, slide up
```

### Navigation

#### Navigation Bar
```typescript
// Specifications
- Height: 64px (desktop), 56px (mobile)
- Background: White or transparent
- Border: Bottom border (optional)
- Position: Fixed or sticky
- Items: Logo, navigation links, wallet button
```

#### Bottom Navigation (Mobile)
```typescript
// Specifications
- Height: 64px
- Background: White
- Border: Top border
- Position: Fixed bottom
- Items: 3-5 navigation items with icons
```

---

## 📐 Spacing & Layout

### Spacing Scale
Based on 4px base unit:
- **XS**: 4px
- **SM**: 8px
- **MD**: 12px
- **LG**: 16px
- **XL**: 24px
- **2XL**: 32px
- **3XL**: 48px
- **4XL**: 64px
- **5XL**: 96px

### Grid System

#### Mobile (4 columns)
- **Columns**: 4
- **Gutter**: 16px
- **Margin**: 16px
- **Max Width**: Full width

#### Tablet (8 columns)
- **Columns**: 8
- **Gutter**: 24px
- **Margin**: 24px
- **Max Width**: 768px

#### Desktop (12 columns)
- **Columns**: 12
- **Gutter**: 32px
- **Margin**: Auto (centered)
- **Max Width**: 1200px

### Container Widths
- **Mobile**: Full width (with 16px padding)
- **Tablet**: 768px max
- **Desktop**: 1200px max
- **Large Desktop**: 1440px max

---

## 🎭 Visual Patterns

### Shadows
- **Small**: `0 1px 2px rgba(0, 0, 0, 0.05)`
- **Medium**: `0 4px 6px rgba(0, 0, 0, 0.1)`
- **Large**: `0 10px 15px rgba(0, 0, 0, 0.1)`
- **XLarge**: `0 20px 25px rgba(0, 0, 0, 0.1)`

### Border Radius
- **Small**: 4px
- **Medium**: 8px
- **Large**: 12px
- **XLarge**: 16px
- **Full**: 9999px (circular)

### Transitions
- **Fast**: 150ms
- **Medium**: 200ms
- **Slow**: 300ms
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)`

---

## ♿ Accessibility Standards

### WCAG 2.1 AA Compliance
- **Color Contrast**: 
  - Normal text: Minimum 4.5:1
  - Large text: Minimum 3:1
  - UI components: Minimum 3:1
- **Focus Indicators**: 2px outline, high contrast
- **Touch Targets**: Minimum 44x44px
- **Keyboard Navigation**: All interactive elements accessible
- **Screen Readers**: Proper ARIA labels and roles

### Accessibility Checklist
- ✅ Sufficient color contrast
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ Focus indicators visible
- ✅ Error messages clear
- ✅ Form labels properly associated
- ✅ Alternative text for images
- ✅ Semantic HTML structure

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1440px

### Mobile-First Approach
- Design for mobile first
- Progressive enhancement for larger screens
- Touch-optimized interactions
- Optimized for slower networks

### Responsive Patterns
- **Stack on Mobile**: Cards stack vertically
- **Grid on Desktop**: Cards display in grid
- **Collapsible Navigation**: Hamburger menu on mobile
- **Bottom Navigation**: Fixed bottom nav on mobile

---

## 🔄 Component States

### Interactive States
- **Default**: Initial state
- **Hover**: Mouse over (desktop)
- **Active**: Click/press state
- **Focus**: Keyboard focus
- **Disabled**: Non-interactive state
- **Loading**: Async operation in progress
- **Error**: Error state
- **Success**: Success state

### State Specifications
- **Visual Feedback**: Clear state changes
- **Transitions**: Smooth state transitions
- **Accessibility**: Keyboard focus states
- **Touch Feedback**: Haptic feedback on mobile (optional)

---

## 🎨 Design Tokens

### Design Token Structure
```typescript
// Color Tokens
colors.primary
colors.secondary
colors.success
colors.error
colors.warning
colors.info
colors.background
colors.text
colors.border

// Typography Tokens
typography.fontFamily.primary
typography.fontFamily.secondary
typography.size.h1
typography.size.body
typography.weight.regular
typography.weight.bold

// Spacing Tokens
spacing.xs
spacing.sm
spacing.md
spacing.lg
spacing.xl

// Border Radius Tokens
radius.sm
radius.md
radius.lg
radius.full

// Shadow Tokens
shadow.sm
shadow.md
shadow.lg
```

---

## 📋 Implementation Guidelines

### Tailwind CSS Configuration
Design tokens will be configured in `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { /* extracted colors */ },
        // ... other colors
      },
      fontFamily: {
        // ... extracted fonts
      },
      spacing: {
        // ... spacing scale
      },
      // ... other tokens
    }
  }
}
```

### Component Structure
- Use Tailwind CSS utility classes
- Create reusable component variants
- Implement responsive variants
- Ensure accessibility compliance

---

## 📝 Next Steps

### Design System Refinement
1. Extract exact color values from mockups
2. Identify font families from mockups
3. Create component library in code
4. Build Storybook documentation
5. Create design system documentation site

### Implementation
1. Set up Tailwind CSS with design tokens
2. Create component library
3. Implement responsive variants
4. Test accessibility compliance
5. Document component usage

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-05  
**Next Review**: After mockup analysis and color/font extraction

