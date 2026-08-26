# VERO VITA — Project Status

## Version: v1.0

## Project Objective
Production-ready website + admin dashboard for VERO VITA café (Tabarbour, Amman).
Bilingual (Arabic RTL / English LTR), Supabase backend, full CRUD admin, SEO, responsive.

## Completed
- **Database**: All tables created (categories, menu_items, gallery_images, feedback, suggestions, site_settings) with RLS policies + storage buckets. 90 menu items seeded across 9 categories.
- **Design System**: Tailwind custom colors (green/caramel/cream), fonts (Plus Jakarta Sans, Playfair Display, Cairo, Tajawal), animations, CSS components.
- **Public Website**: Header w/ nav + language switcher, Hero, About, Menu (search + filter + categories), Order (call/Talabat/Ashiai), Gallery, Contact (call/WhatsApp), Location (embedded map), Feedback + Suggestions forms, Footer, Floating call/WhatsApp buttons.
- **Admin Dashboard**: Login (Supabase auth), Overview KPIs, Menu CRUD + individual image upload, Category CRUD, Gallery management (multi-upload), Feedback management, Suggestions management, Settings (business info, hero, about, SEO, logo).
- **Infrastructure**: Supabase client, Language context, Auth context, Toast notifications, TypeScript types.
- **SEO**: Meta tags, Open Graph, Twitter cards, LocalBusiness structured data, robots.txt, sitemap.xml.
- **Build**: Passes `npm run build` and `npm run typecheck` cleanly.

## Admin Access
Navigate to `#admin` hash or `/admin` path. Uses Supabase email/password auth.
Admin user must be created via Supabase dashboard (Auth > Users > Add user).

## In Progress
- Nothing currently.

## Remaining / Future
- Admin user setup (create first admin in Supabase Auth dashboard)
- Real café photos upload (via admin gallery)
- Individual menu item photos (via admin menu manager)
- Custom domain connection
- Price addition for menu items (via admin, field exists)

## Important Decisions
- Default language: Arabic (RTL)
- No prices displayed initially (field exists, admin can add)
- No product images initially (upload field per item in admin)
- No invented addresses, hours, or social media
- Feedback/suggestions are admin-only (never auto-published)
- Storage: two buckets — `menu-images` and `gallery-images`

## Known Issues
- Admin route detection uses hash (`#admin`) — may need proper router if hosting requires path-based routing
- Google Maps embed uses generic Tabarbour location (no exact coordinates provided)

## Exact Next Step
1. Create an admin user in Supabase Dashboard > Authentication > Users > "Add user"
2. Upload real café photos via Admin > Gallery
3. Add product images via Admin > Menu Items > Edit > Upload
4. Add prices if desired via Admin > Menu Items > Edit > Price field
