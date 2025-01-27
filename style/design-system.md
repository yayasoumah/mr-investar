# Mr. Investar Design System

## Colors

### Primary Palette
- Primary: `#3FD3CC` (Turquoise)
  - Hover: `#36B3AD`
  - Light: `#E6F7F7`
  - Lighter: `#F5FCFC`

### Secondary Palette
- Secondary: `#142D42` (Navy Blue)
  - Hover: `#1D3D59`
  - Light: `#E5E9EC`
  - Lighter: `#F7F8F9`

### Neutral Colors
- White: `#FFFFFF`
- Black: `#000000`
- Grey Scale:
  - Grey-100: `#F4F4F4`
  - Grey-200: `#E0E0E0`
  - Grey-300: `#CCCCCC`
  - Grey-400: `#999999`
  - Grey-500: `#666666`
  - Grey-600: `#333333`

### Semantic Colors
- Success: `#34D399`
  - Light: `#ECFDF5`
- Warning: `#FBBF24`
  - Light: `#FFFBEB`
- Error: `#EF4444`
  - Light: `#FEF2F2`
- Info: `#3B82F6`
  - Light: `#EFF6FF`

## Typography

### Font Family
Primary: "Inter", sans-serif
Headings: "Inter", sans-serif
Monospace: "Roboto Mono", monospace

### Font Sizes
- xs: 12px
- sm: 14px
- base: 16px
- lg: 18px
- xl: 20px
- 2xl: 24px
- 3xl: 30px
- 4xl: 36px
- 5xl: 48px

### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Line Heights
- Tight: 1.25
- Base: 1.5
- Relaxed: 1.75

## Spacing System
- 0: 0px
- 1: 4px
- 2: 8px
- 3: 12px
- 4: 16px
- 5: 20px
- 6: 24px
- 8: 32px
- 10: 40px
- 12: 48px
- 16: 64px
- 20: 80px
- 24: 96px

## Border Radius
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 20px
- 2xl: 25px (buttons)
- full: 9999px

## Shadows
- sm: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- base: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)`
- md: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)`
- lg: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)`
- xl: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)`

## Components

### Buttons
- Border Radius: 25px (2xl)
- Padding: 12px 24px (base)
- Transitions: 150ms ease-in-out
- Font Weight: 600 (semibold)

Variants:
1. Primary
   - Background: Primary (`#3FD3CC`)
   - Text: White
   - Hover: Primary Hover (`#36B3AD`)

2. Secondary
   - Background: Secondary (`#142D42`)
   - Text: White
   - Hover: Secondary Hover (`#1D3D59`)

3. Outline
   - Border: 1.5px solid Primary
   - Text: Primary
   - Hover Background: Primary Light
   - Hover Text: Primary

4. Ghost
   - Background: Transparent
   - Text: Secondary
   - Hover Background: Grey-100

5. Danger
   - Background: Error
   - Text: White
   - Hover: Darker Error

States:
- Default
- Hover
- Active
- Disabled
- Loading

### Input Fields
- Border Radius: 12px (md)
- Border: 1.5px solid Grey-200
- Padding: 12px 16px
- Background: White
- Focus Ring: Primary Light

States:
- Default
- Focus
- Error
- Disabled
- With Icon
- With Helper Text

### Cards
- Border Radius: 16px (lg)
- Border: 1px solid Grey-200
- Background: White
- Shadow: base
- Padding: 24px
- Hover Shadow: md

### Navigation
- Active Item: Primary
- Hover Background: Grey-100
- Selected Background: Primary Light
- Text Color: Grey-600
- Active Text: Primary

### Tooltips
- Border Radius: 8px (sm)
- Background: Secondary
- Text: White
- Padding: 8px 12px
- Max Width: 200px

### Alerts/Notifications
- Border Radius: 12px (md)
- Padding: 16px
- Border Left: 4px solid [variant color]
- Background: [variant light color]

### Progress Indicators
- Height: 4px
- Border Radius: full
- Background: Grey-200
- Fill: Primary

### Tables
- Header Background: Grey-50
- Border Color: Grey-200
- Row Hover: Grey-50
- Padding: 12px 16px
- Border Radius (container): 12px (md)

### Modals
- Border Radius: 16px (lg)
- Background: White
- Shadow: xl
- Backdrop: rgba(0, 0, 0, 0.5)

## Layout

### Container Widths
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

### Grid System
- Columns: 12
- Gutter: 24px
- Margin: 16px

### Z-index Scale
- Base: 0
- Header: 100
- Dropdown: 200
- Modal: 300
- Tooltip: 400
- Toast: 500

## Animations
- Duration: 150ms (fast), 300ms (normal), 500ms (slow)
- Easing: ease-in-out
- Transition Properties:
  - all
  - transform
  - opacity
  - background-color
  - border-color
  - box-shadow

## Media Queries
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px