# 🎓 Scholarship Track Portal# 🎓 Scholarship Track Portal



A comprehensive, enterprise-grade web application built with Next.js, TypeScript, Tailwind CSS, and Supabase for tracking and managing scholarship applications. The application follows standard system design principles with a clean layered architecture.A comprehensive web application built with Next.js, TypeScript, Tailwind CSS, and Supabase for tracking and managing scholarship applications.



## ✨ Features## ✨ Features



- **🔐 Authentication**: Email & Google sign-in with Supabase Auth- **🔐 Authentication**: Email & Google sign-in with Supabase Auth

- **🎯 Smart Matching**: AI-powered scholarship matching based on user profile- **🎯 Smart Matching**: AI-powered scholarship matching based on user profile

- **📊 Dashboard**: Personalized dashboard with matched scholarships and analytics- **📊 Dashboard**: Personalized dashboard with matched scholarships and analytics

- **🔔 Notifications**: Real-time alerts for deadlines and application status- **🔔 Notifications**: Real-time alerts for deadlines and application status

- **📈 Readiness Score**: AI-powered application readiness tracking- **📈 Readiness Score**: AI-powered application readiness tracking

- **📝 Application Management**: Track all scholarship applications in one place- **📝 Application Management**: Track all scholarship applications in one place

- **👤 Profile Management**: Update academic and economic information- **👤 Profile Management**: Update academic and economic information

- **🌓 Dark Mode**: Full dark/light theme support- **🌓 Dark Mode**: Full dark/light theme support

- **📱 Responsive Design**: Mobile-first responsive UI- **📱 Responsive Design**: Mobile-first responsive UI



## 🛠️ Tech Stack## 🛠️ Tech Stack



- **Framework**: Next.js 15 (App Router)- **Framework**: Next.js 15 (App Router)

- **Language**: TypeScript- **Language**: TypeScript

- **Styling**: Tailwind CSS v4- **Styling**: Tailwind CSS v4

- **Database & Auth**: Supabase- **Database & Auth**: Supabase

- **UI Components**: Custom components with Shadcn-inspired design- **UI Components**: Custom components with Shadcn-inspired design

- **Icons**: Lucide React- **Icons**: Lucide React

- **Date Handling**: date-fns- **Date Handling**: date-fns

- **Architecture**: Layered Architecture (Controller → Service → Repository → Model)

## 📋 Prerequisites

## 🏗️ Architecture

Before you begin, ensure you have:

This application follows **standard system design principles** with a clean **layered architecture**:

- Node.js 18+ installed

```- A Supabase account ([Sign up here](https://supabase.com))

┌─────────────────────────────────────────────────────────────┐- Git installed

│                    Presentation Layer                        │

│                  (React Components / UI)                     │## 🚀 Getting Started

└───────────────────────────┬─────────────────────────────────┘

                            │### 1. Clone the Repository

┌───────────────────────────▼─────────────────────────────────┐

│                     Controller Layer                         │```bash

│              (API Routes - HTTP Request Handlers)            │git clone <your-repo-url>

│   /api/apply, /api/match, /api/notifications, /api/readiness│cd internshiportal

└───────────────────────────┬─────────────────────────────────┘```

                            │

┌───────────────────────────▼─────────────────────────────────┐### 2. Install Dependencies

│                      Service Layer                           │

│                   (Business Logic)                           │```bash

│   ApplicationService, ScholarshipService,                    │npm install

│   NotificationService, ReadinessService                      │```

└───────────────────────────┬─────────────────────────────────┘

                            │### 3. Set Up Supabase

┌───────────────────────────▼─────────────────────────────────┐

│                    Repository Layer                          │1. Create a new project at [app.supabase.com](https://app.supabase.com)

│                   (Data Access Layer)                        │2. Go to Project Settings > API

│   ApplicationRepository, ScholarshipRepository,              │3. Copy your project URL and anon public key

│   NotificationRepository, UserRepository                     │

└───────────────────────────┬─────────────────────────────────┘### 4. Configure Environment Variables

                            │

┌───────────────────────────▼─────────────────────────────────┐Create a `.env.local` file in the root directory:

│                      Model Layer                             │

│              (Domain Models & Interfaces)                    │```bash

│   User, Scholarship, Application, Notification               │NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url

└───────────────────────────┬─────────────────────────────────┘NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

                            │```

┌───────────────────────────▼─────────────────────────────────┐

│                      Database Layer                          │### 5. Set Up Database

│                      (Supabase / PostgreSQL)                 │

└─────────────────────────────────────────────────────────────┘1. Go to your Supabase project dashboard

```2. Navigate to SQL Editor

3. Copy the contents of `supabase-schema.sql`

### Layer Responsibilities4. Run the SQL script to create tables and policies



1. **Controllers (API Routes)**: Handle HTTP requests, validate inputs, call services### 6. Configure Google OAuth (Optional)

2. **Services**: Implement business logic, orchestrate repositories

3. **Repositories**: Database operations and data accessTo enable Google sign-in:

4. **Models**: Define domain entities and data structures

5. **DTOs**: Data Transfer Objects for API contracts1. Go to Supabase Dashboard > Authentication > Providers

2. Enable Google provider

## 📋 Prerequisites3. Follow the instructions to set up Google OAuth credentials

4. Add authorized redirect URIs:

- Node.js 18+ installed   - `http://localhost:3000/auth/callback` (development)

- A Supabase account ([Sign up here](https://supabase.com))   - `https://your-domain.com/auth/callback` (production)

- Git installed

### 7. Run the Development Server

## 🚀 Getting Started

```bash

### 1. Clone the Repositorynpm run dev

```

```bash

git clone <your-repo-url>Open [http://localhost:3000](http://localhost:3000) to see the application.

cd internshiportal

```## 📁 Project Structure



### 2. Install Dependencies```

src/

```bash├── app/                      # Next.js app router pages

npm install│   ├── api/                 # API routes

```│   │   ├── apply/          # Application endpoints

│   │   ├── match/          # Scholarship matching

### 3. Set Up Supabase│   │   ├── notifications/  # Notification management

│   │   └── readiness/      # Readiness score calculation

1. Create a new project at [app.supabase.com](https://app.supabase.com)│   ├── applied/            # Applied scholarships page

2. Go to Project Settings > API│   ├── auth/               # Auth callback

3. Copy your project URL and anon public key│   ├── dashboard/          # Main dashboard

│   ├── login/              # Login page

### 4. Configure Environment Variables│   ├── profile/            # User profile page

│   ├── scholarships/       # All scholarships page

Create a `.env.local` file in the root directory:│   └── signup/             # Signup page

├── components/              # React components

```bash│   ├── ui/                 # UI components

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url│   ├── navbar.tsx          # Navigation bar

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key│   └── theme-provider.tsx  # Theme context

```├── data/                    # Mock data

│   └── scholarships.ts     # Scholarship seed data

### 5. Set Up Database├── lib/                     # Utility functions

│   ├── supabase/           # Supabase clients

1. Go to your Supabase project dashboard│   └── utils.ts            # Helper functions

2. Navigate to SQL Editor└── types/                   # TypeScript types

3. Copy the contents of `supabase-schema.sql`    └── database.types.ts   # Database type definitions

4. Run the SQL script to create tables and policies```



### 6. Configure Google OAuth (Optional)## 🎨 Key Pages



To enable Google sign-in:### Landing Page (`/`)

- Hero section with call-to-action

1. Go to Supabase Dashboard > Authentication > Providers- Feature highlights

2. Enable Google provider- Responsive design

3. Follow the instructions to set up Google OAuth credentials

4. Add authorized redirect URIs:### Dashboard (`/dashboard`)

   - `http://localhost:3000/auth/callback` (development)- Readiness score widget

   - `https://your-domain.com/auth/callback` (production)- Matched scholarships

- Quick stats

### 7. Run the Development Server- Recent notifications

- Action items

```bash

npm run dev### Scholarships (`/scholarships`)

```- Browse all scholarships

- Search and filter functionality

Open [http://localhost:3000](http://localhost:3000) to see the application.- Quick apply feature



## 📁 Project Structure### Applied (`/applied`)

- Track application status

```- View application history

src/- Status badges (Applied, Pending, Accepted, Rejected)

├── app/                          # Next.js app router

│   ├── api/                     # API routes (Controllers)### Profile (`/profile`)

│   │   ├── apply/              # Application endpoints- Update personal information

│   │   ├── match/              # Scholarship matching- Profile completeness indicator

│   │   ├── notifications/      # Notification management- Academic and economic details

│   │   └── readiness/          # Readiness score calculation

│   ├── applied/                # Applied scholarships page## 🔑 API Routes

│   ├── auth/                   # Auth callback

│   ├── dashboard/              # Main dashboard| Endpoint | Method | Description |

│   ├── login/                  # Login page|----------|--------|-------------|

│   ├── profile/                # User profile page| `/api/match` | GET | Get matched scholarships for user |

│   ├── scholarships/           # All scholarships page| `/api/apply` | POST | Submit scholarship application |

│   └── signup/                 # Signup page| `/api/apply` | GET | Get user's applications |

│| `/api/notifications` | GET | Fetch user notifications |

├── services/                    # Service Layer (Business Logic)| `/api/notifications` | POST | Mark notification as read |

│   ├── application.service.ts  # Application business logic| `/api/readiness` | GET | Calculate readiness score |

│   ├── scholarship.service.ts  # Scholarship matching logic

│   ├── notification.service.ts # Notification management## 🔒 Security Features

│   ├── readiness.service.ts    # Readiness calculation

│   └── index.ts                # Service exports- Row Level Security (RLS) enabled on all tables

│- Protected routes with middleware

├── repositories/                # Repository Layer (Data Access)- Secure authentication flow

│   ├── base.repository.ts      # Base repository with common operations- Environment variable protection

│   ├── application.repository.ts

│   ├── scholarship.repository.ts## 🎯 Database Schema

│   ├── notification.repository.ts

│   ├── user.repository.ts### Tables

│   └── index.ts                # Repository exports

│1. **users**: User profiles with academic information

├── models/                      # Domain Models2. **scholarships**: Scholarship listings

│   ├── User.model.ts           # User entity3. **applications**: User scholarship applications

│   ├── Scholarship.model.ts    # Scholarship entity4. **notifications**: User-specific alerts

│   ├── Application.model.ts    # Application entity

│   ├── Notification.model.ts   # Notification entitySee `supabase-schema.sql` for complete schema with indexes and policies.

│   └── index.ts                # Model exports

│## 🌟 Features Roadmap

├── dtos/                        # Data Transfer Objects

│   ├── application.dto.ts      # Application DTOs- [ ] Document upload functionality

│   ├── scholarship.dto.ts      # Scholarship DTOs- [ ] Advanced search filters

│   ├── notification.dto.ts     # Notification DTOs- [ ] Email notifications

│   ├── readiness.dto.ts        # Readiness DTOs- [ ] Application timeline tracking

│   └── index.ts                # DTO exports- [ ] Scholarship recommendations ML model

│- [ ] Export applications to PDF

├── components/                  # React components- [ ] Multi-language support

│   ├── ui/                     # UI components

│   ├── navbar.tsx              # Navigation bar## 🐛 Known Issues

│   └── theme-provider.tsx      # Theme context

│- Mock scholarship data used (replace with real data)

├── lib/                         # Utility functions- Documents upload not yet implemented

│   ├── supabase/               # Supabase clients- Email notifications require cron setup

│   └── utils.ts                # Helper functions

│## 📝 Development Notes

└── types/                       # TypeScript types

    └── database.types.ts       # Database type definitions### Adding New Scholarships

```

Add scholarships to `src/data/scholarships.ts` or insert directly into Supabase:

## 🔑 API Endpoints

```typescript

| Endpoint | Method | Description | Request Body | Response |const newScholarship: Scholarship = {

|----------|--------|-------------|--------------|----------|  id: 'unique-id',

| `/api/match` | GET | Get matched scholarships | - | `MatchedScholarshipsResponseDTO` |  title: 'Scholarship Name',

| `/api/apply` | POST | Submit scholarship application | `CreateApplicationDTO` | `ApplicationSuccessResponseDTO` |  description: 'Description...',

| `/api/apply` | GET | Get user's applications | - | `ApplicationListResponseDTO` |  eligibility_criteria: 'Criteria...',

| `/api/notifications` | GET | Fetch user notifications | - | `NotificationListResponseDTO` |  deadline: '2025-12-31',

| `/api/notifications` | POST | Mark notification as read | `MarkNotificationReadDTO` | Success response |  country: 'Country',

| `/api/readiness` | GET | Calculate readiness score | - | `ReadinessScoreResponseDTO` |  language: 'Language',

  link: 'https://...',

## 🎯 Database Schema  created_at: new Date().toISOString(),

};

### Tables```



1. **users**: User profiles with academic information### Customizing Theme

2. **scholarships**: Scholarship listings

3. **applications**: User scholarship applicationsEdit theme colors in `src/app/globals.css`:

4. **notifications**: User-specific alerts

```css

See `supabase-schema.sql` for complete schema with indexes and policies.:root {

  --primary: 221.2 83.2% 53.3%;

## 🔒 Security Features  --secondary: 210 40% 96.1%;

  /* ... */

- Row Level Security (RLS) enabled on all tables}

- Protected routes with middleware```

- Secure authentication flow

- Environment variable protection## 🤝 Contributing

- Type-safe database operations

Contributions are welcome! Please:

## 🌟 Key Design Principles

1. Fork the repository

1. **Separation of Concerns**: Each layer has a single responsibility2. Create a feature branch

2. **Dependency Injection**: Services and repositories use DI pattern3. Commit your changes

3. **Type Safety**: Full TypeScript coverage with strict mode4. Push to the branch

4. **Error Handling**: Consistent error handling across layers5. Open a Pull Request

5. **Scalability**: Easy to add new features without modifying existing code

6. **Testability**: Each layer can be tested independently## 📄 License



## 📝 Development GuidelinesThis project is licensed under the MIT License.



### Adding a New Feature## 🙏 Acknowledgments



1. **Define Models**: Create/update models in `src/models/`- Next.js team for the amazing framework

2. **Create DTOs**: Define request/response DTOs in `src/dtos/`- Supabase for backend infrastructure

3. **Add Repository Methods**: Implement data access in `src/repositories/`- Shadcn for UI component inspiration

4. **Implement Business Logic**: Add service methods in `src/services/`- Lucide for beautiful icons

5. **Create API Route**: Add controller in `src/app/api/`

6. **Update UI**: Create/update components as needed## 📞 Support



### Code StyleFor issues and questions:

- Open an issue on GitHub

- Use TypeScript strict mode- Check the documentation

- Follow ESLint rules- Review existing discussions

- Document complex business logic

- Use meaningful variable and function names---

- Keep functions small and focused

Built with ❤️ using Next.js, TypeScript, and Supabase

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**: Check `.env.local` credentials
2. **Authentication Issues**: Verify Supabase project settings
3. **Build Errors**: Clear `.next` folder and rebuild

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for backend infrastructure
- Shadcn for UI component inspiration
- Lucide for beautiful icons

---

Built with ❤️ using Clean Architecture principles
