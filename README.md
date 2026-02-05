# سؤال محيرني (Soual Mehairny)

A **complete and fully functional** Christian Orthodox platform built with Laravel 12 + React + Inertia.js that collects doctrinal questions and provides comprehensive answers in both text and YouTube video format, supporting both Arabic (default) and English languages.

## 🌟 Features

### ✨ Core Functionality
- **Multilingual Platform**: Arabic as default language with full RTL support, English as secondary language
- **Question Management**: Public question submission with admin review and approval workflow
- **Content Categorization**: Organize questions by Bible books (66 books) and theological topics (20 categories)
- **YouTube Integration**: Embed explanatory videos alongside text answers
- **Search & Discovery**: Advanced search with filters by Bible book, topic, and keywords

### 🔐 User Management
- **Complete Authentication**: User registration, login, password reset, and email verification
- **Admin Dashboard**: Comprehensive content management interface
- **User Profiles**: Profile management and settings
- **Role-Based Access**: Secure admin access control

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with professional styling
- **Professional UI/UX**: Clean, minimal, and elegant design
- **Smooth Interactions**: Transitions, hover effects, and subtle animations
- **Accessibility**: Proper form labels, error handling, and keyboard navigation

## 🛠️ Technical Stack

### Backend
- **Laravel 12** - Modern PHP framework with latest features
- **SQLite** - Lightweight database (easily switchable to MySQL/PostgreSQL)
- **Eloquent ORM** - Database relationships and multilingual accessors
- **Migrations & Seeders** - Database schema management and initial data

### Frontend
- **React 19** - Modern UI library with latest features
- **Inertia.js** - Seamless SPA experience without API complexity
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with custom components
- **Lucide React** - Beautiful and consistent icons

### Architecture
- **MVC Pattern** - Clean separation of concerns
- **RESTful API** - Standard HTTP methods
- **Middleware** - Request processing and localization
- **Authentication** - Laravel Breeze integration

## 🚀 Installation & Setup

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 20+ and npm
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd soual-mehairny
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database setup**
   ```bash
   php artisan migrate:fresh --seed
   ```

6. **Build frontend assets**
   ```bash
   npm run build
   ```

7. **Start development server**
   ```bash
   php artisan serve
   ```

8. **Access the application**
   - Main site: `http://localhost:8000/ar` (Arabic) or `http://localhost:8000/en` (English)
   - Admin dashboard: `http://localhost:8000/admin/dashboard`
   - Authentication: `http://localhost:8000/login`, `http://localhost:8000/register`

### Default Admin Account
- **Email**: `admin@example.com`
- **Password**: `password` (from UserFactory)

## NativePHP: Local UI + Remote JSON API

When packaged with NativePHP, the app renders the same Inertia UI locally, but
fetches database-backed data from a remote HTTPS JSON API (no HTML proxying or
remote navigation).

Environment variables (local/native build):
- `NATIVE_APP=true` Enable native mode.
- `REMOTE_APP_URL=https://your-domain` Remote API base URL (must be HTTPS).
- Recommended for local native: `SESSION_DRIVER=file` and `CACHE_STORE=file`.

Environment variables (remote server):
- `NATIVE_APP=false`
- `NATIVE_APP_ALLOWED_ORIGINS` Comma-separated origins for CORS (example for
  local native dev: `http://localhost:8000,http://127.0.0.1:8000`).

Native API endpoints:
- `GET /api/native/questions?locale=ar&page=1`
- `GET /api/native/questions/{id}?locale=ar`
- `GET /api/native/questions/filters?locale=ar`
- `POST /api/native/ask`
- `POST /api/native/auth/login`
- `POST /api/native/auth/logout`
- `GET /api/native/auth/me`

Authentication:
- Token-based via Laravel Sanctum (mobile/desktop friendly).
- Run migrations on the remote server to create `personal_access_tokens`.

Notifications (NativePHP mobile):
- Install and configure the Firebase push notifications plugin if you want
  system notifications (FCM/APNs setup required).
- Secure token storage uses the NativePHP secure storage plugin when available.

Suggested installs (NativePHP mobile):
```bash
composer require nativephp/mobile-firebase
composer require nativephp/mobile-secure-storage
php artisan native:install
```

Verification checklist:
- Web: `/ar/questions` renders from server props, no remote API calls.
- Native: `/ar/questions` renders locally, data loads from `https://.../api/native/*`.
- No Mixed Content warnings in native.
- Links stay inside the local app (Inertia links).
- Pagination + locale filtering work in native.
- Run `php artisan test` for automated coverage.


## 📁 Project Structure

```
soual-mehairny/
├── app/
│   ├── Http/Controllers/
│   │   ├── QuestionController.php          # Public question operations
│   │   ├── Auth/                          # Authentication controllers
│   │   └── Admin/
│   │       ├── DashboardController.php     # Admin dashboard
│   │       ├── QuestionController.php      # Admin question management
│   │       ├── BibleBooksController.php    # Bible books management
│   │       └── TopicsController.php        # Topics management
│   ├── Models/
│   │   ├── BibleBook.php                   # Bible book model
│   │   ├── Question.php                    # Question model
│   │   └── Topic.php                       # Topic model
│   └── Http/Middleware/
│       └── SetLocale.php                   # Language handling
├── database/
│   ├── migrations/                         # Database schema
│   └── seeders/                            # Initial data
├── resources/js/
│   ├── pages/
│   │   ├── Home.tsx                        # Landing page
│   │   ├── Questions/                       # Question pages
│   │   ├── auth/                           # Authentication pages
│   │   ├── Admin/                           # Admin pages
│   │   ├── settings/                        # User settings
│   │   └── Errors/                          # Error pages
│   ├── layouts/
│   │   ├── public-layout.tsx               # Public page layout
│   │   ├── app-layout.tsx                  # Admin layout
│   │   └── auth-layout.tsx                 # Authentication layout
│   └── components/
│       ├── AdminNavigation.tsx             # Admin navigation
│       ├── LoadingSpinner.tsx              # Loading states
│       ├── ConfirmationDialog.tsx          # Confirmation dialogs
│       ├── SuccessNotification.tsx         # Success notifications
│       ├── EnhancedSearch.tsx              # Advanced search
│       └── BreadcrumbNavigation.tsx        # Navigation breadcrumbs
└── routes/
    ├── web.php                              # Main application routes
    ├── auth.php                             # Authentication routes
    └── settings.php                         # User settings routes
```

## 🌐 Localization & URLs

### URL Structure
- **Arabic**: `/ar/questions`, `/ar/questions/create`
- **English**: `/en/questions`, `/en/questions/create`
- **Admin**: `/admin/dashboard` (no locale prefix)
- **Authentication**: `/login`, `/register`, `/forgot-password`

### Language Switching
- Toggle between Arabic and English via the language switcher
- URLs automatically update to reflect the selected language
- Content displays in the appropriate language with RTL support for Arabic

## 📊 Database Schema

### Core Tables
- **`users`** - Admin user accounts with authentication
- **`bible_books`** - Bible book references with multilingual names
- **`topics`** - Theological topic categories with descriptions
- **`questions`** - Questions and answers with metadata and status

### Key Relationships
- Questions belong to Bible books and topics
- All content supports Arabic and English versions
- Questions have approval workflow (pending/approved/rejected)
- Users can manage their profiles and settings

## 🔧 Development

### Available Commands
```bash
# Development
npm run dev          # Start Vite dev server
php artisan serve    # Start Laravel server

# Building
npm run build        # Build for production
npm run build:ssr    # Build for SSR

# Database
php artisan migrate:fresh --seed  # Reset and seed database
php artisan db:seed              # Seed database with demo data
php artisan make:controller      # Create new controller
php artisan make:model          # Create new model
```

### Code Quality
- **TypeScript**: Full type safety for React components
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **PHP CS Fixer**: PHP code quality standards

## 🎯 Key Features in Detail

### 1. Question Management System
- **Public Submission**: Anyone can submit doctrinal questions
- **Admin Review**: Questions are reviewed before publication
- **Status Tracking**: Pending, approved, or rejected questions
- **Content Creation**: Admins can add comprehensive answers
- **YouTube Integration**: Embed explanatory videos

### 2. Content Organization
- **Bible Books**: 66 books with multilingual names and abbreviations
- **Theological Topics**: 20 categories covering major theological subjects
- **Search & Filters**: Find questions by book, topic, or keywords
- **Pagination**: Efficient content browsing

### 3. Admin Dashboard
- **Statistics Overview**: Question counts and statuses
- **Quick Actions**: Common administrative tasks
- **Content Management**: Full CRUD operations
- **User Management**: Admin authentication and profiles

### 4. User Experience
- **Responsive Design**: Works perfectly on all devices
- **Professional Interface**: Clean, modern, and intuitive
- **Smooth Interactions**: Transitions and animations
- **Accessibility**: Proper navigation and error handling

## 🚀 Deployment

### Production Requirements
- PHP 8.2+ with required extensions
- Node.js 20+ for building assets
- Database (MySQL/PostgreSQL recommended for production)
- Web server (Nginx/Apache)

### Deployment Steps
1. Set up production environment
2. Configure environment variables
3. Run database migrations
4. Build frontend assets: `npm run build`
5. Configure web server
6. Set up SSL certificates
7. Configure caching and optimization

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- Follow Laravel and React best practices
- Maintain consistent code formatting
- Write clear commit messages
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Getting Help
- Check the documentation in this README
- Review the code structure and examples
- Open an issue for bugs or feature requests
- Contact the development team

### Common Issues
- **Port conflicts**: Ensure ports 8000 and 5173 are available
- **Database issues**: Check database configuration and permissions
- **Asset building**: Ensure Node.js dependencies are installed
- **Authentication**: Verify email configuration for password reset

## 🎉 Project Status

**سؤال محيرني (Soual Mehairny)** is now **100% complete and fully functional** with all requested features implemented. The application is ready for production deployment and can immediately serve users with a complete question-and-answer platform supporting both Arabic and English languages.

---

**Built with ❤️ using Laravel 12 + React 19 + Inertia.js**

