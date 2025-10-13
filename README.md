# 🎓 Scholarship Track Portal

A comprehensive web application built with Next.js, TypeScript, Tailwind CSS, and Supabase for tracking and managing scholarship applications.

## ✨ Features

- **🔐 Authentication**: Email & Google sign-in with Supabase Auth
- **🎯 Smart Matching**: AI-powered scholarship matching based on user profile
- **📊 Dashboard**: Personalized dashboard with matched scholarships and analytics
- **🔔 Notifications**: Real-time alerts for deadlines and application status
- **📈 Readiness Score**: AI-powered application readiness tracking
- **📝 Application Management**: Track all scholarship applications in one place
- **👤 Profile Management**: Update academic and economic information
- **🌓 Dark Mode**: Full dark/light theme support
- **📱 Responsive Design**: Mobile-first responsive UI

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database & Auth**: Supabase
- **UI Components**: Custom components with Shadcn-inspired design
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account ([Sign up here](https://supabase.com))
- Git installed

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd internshiportal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [app.supabase.com](https://app.supabase.com)
2. Go to Project Settings > API
3. Copy your project URL and anon public key

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase-schema.sql`
4. Run the SQL script to create tables and policies

### 6. Configure Google OAuth (Optional)

To enable Google sign-in:

1. Go to Supabase Dashboard > Authentication > Providers
2. Enable Google provider
3. Follow the instructions to set up Google OAuth credentials
4. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://your-domain.com/auth/callback` (production)

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                      # Next.js app router pages
│   ├── api/                 # API routes
│   │   ├── apply/          # Application endpoints
│   │   ├── match/          # Scholarship matching
│   │   ├── notifications/  # Notification management
│   │   └── readiness/      # Readiness score calculation
│   ├── applied/            # Applied scholarships page
│   ├── auth/               # Auth callback
│   ├── dashboard/          # Main dashboard
│   ├── login/              # Login page
│   ├── profile/            # User profile page
│   ├── scholarships/       # All scholarships page
│   └── signup/             # Signup page
├── components/              # React components
│   ├── ui/                 # UI components
│   ├── navbar.tsx          # Navigation bar
│   └── theme-provider.tsx  # Theme context
├── data/                    # Mock data
│   └── scholarships.ts     # Scholarship seed data
├── lib/                     # Utility functions
│   ├── supabase/           # Supabase clients
│   └── utils.ts            # Helper functions
└── types/                   # TypeScript types
    └── database.types.ts   # Database type definitions
```

## 🎨 Key Pages

### Landing Page (`/`)
- Hero section with call-to-action
- Feature highlights
- Responsive design

### Dashboard (`/dashboard`)
- Readiness score widget
- Matched scholarships
- Quick stats
- Recent notifications
- Action items

### Scholarships (`/scholarships`)
- Browse all scholarships
- Search and filter functionality
- Quick apply feature

### Applied (`/applied`)
- Track application status
- View application history
- Status badges (Applied, Pending, Accepted, Rejected)

### Profile (`/profile`)
- Update personal information
- Profile completeness indicator
- Academic and economic details

## 🔑 API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/match` | GET | Get matched scholarships for user |
| `/api/apply` | POST | Submit scholarship application |
| `/api/apply` | GET | Get user's applications |
| `/api/notifications` | GET | Fetch user notifications |
| `/api/notifications` | POST | Mark notification as read |
| `/api/readiness` | GET | Calculate readiness score |

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- Protected routes with middleware
- Secure authentication flow
- Environment variable protection

## 🎯 Database Schema

### Tables

1. **users**: User profiles with academic information
2. **scholarships**: Scholarship listings
3. **applications**: User scholarship applications
4. **notifications**: User-specific alerts

See `supabase-schema.sql` for complete schema with indexes and policies.

## 🌟 Features Roadmap

- [ ] Document upload functionality
- [ ] Advanced search filters
- [ ] Email notifications
- [ ] Application timeline tracking
- [ ] Scholarship recommendations ML model
- [ ] Export applications to PDF
- [ ] Multi-language support

## 🐛 Known Issues

- Mock scholarship data used (replace with real data)
- Documents upload not yet implemented
- Email notifications require cron setup

## 📝 Development Notes

### Adding New Scholarships

Add scholarships to `src/data/scholarships.ts` or insert directly into Supabase:

```typescript
const newScholarship: Scholarship = {
  id: 'unique-id',
  title: 'Scholarship Name',
  description: 'Description...',
  eligibility_criteria: 'Criteria...',
  deadline: '2025-12-31',
  country: 'Country',
  language: 'Language',
  link: 'https://...',
  created_at: new Date().toISOString(),
};
```

### Customizing Theme

Edit theme colors in `src/app/globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  /* ... */
}
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for backend infrastructure
- Shadcn for UI component inspiration
- Lucide for beautiful icons

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation
- Review existing discussions

---

Built with ❤️ using Next.js, TypeScript, and Supabase
