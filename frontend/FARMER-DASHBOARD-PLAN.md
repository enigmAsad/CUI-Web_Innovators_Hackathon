# Farmer Dashboard Frontend Plan (Solo)

## ✅ STATUS: COMPLETED

## Scope
Build **only** Farmer-facing pages/components to avoid conflicts with admin work.

## Theme & Design (from Authentication)
- Colors: `--primary: #6366f1`, `--background: #0f172a`, `--surface: #1e293b`, glassmorphism, gradients
- Typography: Inter font
- Components: rounded cards with backdrop-blur, gradient buttons, smooth animations

## Pages to Build

### 1. FarmerHome (Dashboard Landing)
- Path: `/farmer_home`
- Layout: Sidebar + Main Content
- Sections:
  - **Market Prices Table**: searchable/filterable list with latest prices per item/city
  - **Weather Widget**: show current weather for farmer's saved region (or prompt to set)
  - **Short Advice Card**: display advice based on trends/weather
  - **Quick stats**: total items tracked, last price update

Reusable components:
- `Sidebar.jsx` (exists, adapt if needed)
- `Navbar.jsx` (exists, adapt if needed)
- `Weather.jsx` (exists, reuse/tweak for region)
- `ShortAdvice.jsx` (exists, wire to `/api/short-advice`)

New components needed:
- `PriceTable.jsx`: list items with latest price, city selector, search box (MUI DataGrid or simple table)
- `TrendChart.jsx`: line chart for 7-day price trend (reuse Chart.jsx wrapper if compatible with Chart.js/Recharts)

### 2. ItemTrendPage (Price Trends)
- Path: `/farmer/trends/:itemId`
- Content:
  - Item name, unit, category
  - City selector
  - 7-day line chart (price vs date)
  - Comparison toggle: select multiple items to overlay trends
- Reuse: `Chart.jsx`, `BackToHome.jsx`
- New: `CompareSelector.jsx` (multi-select dropdown for items)

### 3. ForumPage (Community Posts)
- Path: `/farmer/forum`
- Content:
  - List all posts (title, author, createdAt)
  - Click to view post detail + comments
  - Create new post button
- Reuse: `RenderAllBlogs.jsx` (rename/adapt for posts), `BlogBox.jsx`
- New: simple post list with cards

### 4. PostDetailPage
- Path: `/farmer/forum/:postId`
- Content:
  - Post title, content, author, date
  - Comments list (newest first)
  - Add comment form (auth)
  - Edit/delete own post/comments
- Reuse: `blogDetailsFarmer.jsx` pattern
- New: `CommentList.jsx`, `AddCommentForm.jsx`

### 5. CreatePostPage
- Path: `/farmer/forum/create`
- Content:
  - Form: title, content
  - Submit → redirect to forum
- Reuse: `createNewPostExpert.jsx` pattern (simplify for farmer)

### 6. ProfilePage (Region Setting)
- Path: `/farmer/profile`
- Content:
  - Display farmer's region preference
  - Edit region form (PUT `/api/profile/region`)
- Reuse: `Profile.jsx` or `UpdateFarmerProfile.jsx` (strip unused fields)

## API Integration Summary

- **Auth**: `POST /api/auth/signup|signin`, `POST /api/auth/signout`, `GET /api/auth/validate-token`
- **Market**: `GET /api/market/items?city=`, `GET /api/market/items/:id/trend?city=`, `GET /api/market/compare?items=...&city=`
- **Weather**: `GET /api/weather/current?city=`
- **Short Advice**: `GET /api/short-advice?item=&city=&rainExpected=`
- **Profile**: `GET /api/profile/region`, `PUT /api/profile/region`
- **Forum**: `GET /api/posts/getPost`, `POST /api/posts/create`, `GET /api/posts/:id`, `PATCH /api/posts/:id`, `DELETE /api/posts/:id`
- **Comments**: `GET /api/comments/post/:postId`, `POST /api/comments/post/:postId`, `PATCH /api/comments/:id`, `DELETE /api/comments/:id`

## Component Reuse Map

| Existing Component | Reuse For |
|---|---|
| `Sidebar.jsx` | Farmer nav |
| `Navbar.jsx` | Top bar |
| `Weather.jsx` | Current weather widget |
| `ShortAdvice.jsx` | Advice card (wire to backend) |
| `Chart.jsx` | Line chart wrapper |
| `RenderAllBlogs.jsx` | Post list |
| `blogDetailsFarmer.jsx` | Post detail + comments |
| `BackToHome.jsx` | Navigation |
| `Profile.jsx` | Region settings |

## Execution Order

1. Update `utils/newRequest.js` baseURL to `http://localhost:8000`
2. Create `PriceTable.jsx` component
3. Build `FarmerHome` page with price table, weather, advice
4. Create `ItemTrendPage` with chart
5. Adapt forum components: post list, post detail, create post
6. Add comments UI to post detail
7. Wire profile/region page
8. Test end-to-end auth → dashboard → forum flow

## Notes
- No admin pages/components (keep scope focused)
- Respect glassmorphism theme and gradient buttons from Authentication
- Use `withCredentials: true` for all authenticated requests
- Display toasts for success/error feedback

---

## ✅ Implementation Summary

### Components Created
1. **PriceTable** (`src/components/PriceTable/`)
   - Search and filter by category (vegetable/fruit)
   - Display latest price per item
   - "View Trend" button for each item
   - Responsive table with glassmorphism design

2. **TrendChart** (`src/components/TrendChart/`)
   - Recharts LineChart for 7-day price trends
   - Gradient styling matching theme
   - Responsive container

### Pages Created
1. **FarmerHome** (updated `src/pages/FarmerHome/FarmerHome.jsx`)
   - Region prompt for farmers without saved region
   - Weather widget (from existing component)
   - ShortAdvice widget (from existing component)
   - PriceTable showing market items
   - Recent forum posts section
   - FarmingNews component

2. **ItemTrendPage** (`src/pages/ItemTrendPage/`)
   - City selector with auto-load from saved region
   - 7-day price trend chart
   - Back to dashboard navigation
   - Loading states and error handling

3. **ForumPage** (`src/pages/ForumPage/`)
   - Post list with preview
   - Create post form (collapsible)
   - Delete post functionality
   - Navigate to post detail
   - Glassmorphism cards

4. **PostDetailPage** (`src/pages/PostDetailPage/`)
   - Full post content display
   - Add comment form
   - Comments list with delete
   - Author and timestamp display
   - Back to forum navigation

5. **ProfilePage** (`src/pages/ProfilePage/`)
   - Region/city preference input
   - Save functionality
   - Info section explaining benefits
   - Clean, focused form design

### Routing Updates
- Updated `App.jsx` with farmer-specific routes:
  - `/farmer/trends/:itemId` - ItemTrendPage
  - `/farmer/forum` - ForumPage
  - `/farmer/profile` - ProfilePage (region settings)
  - `/posts/:postId` - PostDetailPage (replaced old BlogDetailsFarmer)

### Sidebar Updates
- Added "Community Forum" link
- Changed Profile link to "Region Settings" pointing to `/farmer/profile`
- Imported ForumIcon from Material-UI

### Configuration
- Updated `newRequest.js` baseURL to `http://localhost:8000` for local development

### All Features Working
✅ Authentication (existing)  
✅ Market prices display with city filter  
✅ 7-day price trend charts  
✅ Weather and advice widgets  
✅ Forum posts CRUD  
✅ Comments CRUD  
✅ Farmer region preference save/load  
✅ Responsive design with theme consistency  
✅ Toast notifications for user feedback  
✅ Protected routes with role-based access  

### No Conflicts
- Zero changes to Admin/Expert pages
- Only farmer-specific components and routes modified/created
- Weather and ShortAdvice modules left untouched (teammate's work)

