# DSA Sync Tracker

A comprehensive DSA (Data Structures and Algorithms) progress tracking application built with React, TypeScript, and Supabase.

## Features

- 📊 **Dashboard**: Track overall progress with statistics and visualizations
- 📋 **Problem Management**: Mark problems as solved/unsolved with notes
- 📁 **Sheet Organization**: Organize problems into custom sheets
- 🔄 **Smart Sync**: Automatically sync progress across duplicate problems
- 📤 **CSV Export**: Export your progress data
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 🔐 **Authentication**: Secure user authentication with Supabase
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Routing**: React Router v7
- **Icons**: Lucide React
- **File Processing**: XLSX, PapaParse

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Database**
   - Create a new Supabase project
   - Run the SQL migrations from `supabase/migrations/`
   - Copy your project URL and anon key to the `.env` file

5. **Start development server**
   ```bash
   npm run dev
   ```

## Database Schema

The application uses the following tables:

- **users**: User profiles (handled by Supabase Auth)
- **sheets**: Problem sheets (public or custom)
- **problems**: Individual DSA problems
- **sheet_problems**: Many-to-many relationship between sheets and problems
- **progress**: User progress tracking for problems

## Deployment

### Vercel Deployment

1. **Set Root Directory**: In Vercel settings, set the root directory to `project`

2. **Environment Variables**: Add these in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

3. **Build Settings**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Deploy**: Connect your GitHub repository and deploy

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Dashboard-specific components
│   ├── Layout/         # Layout components (Navbar, etc.)
│   └── Problems/       # Problem-related components
├── contexts/           # React contexts (Auth, Theme)
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries (Supabase client, helpers)
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── data/               # Static data and configurations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Troubleshooting

### Build Errors

1. **Missing dependencies**: Run `npm install`
2. **TypeScript errors**: Check type definitions in `src/types/`
3. **Environment variables**: Ensure all required env vars are set

### Runtime Errors

1. **Supabase connection**: Verify your Supabase URL and key
2. **Authentication**: Check if user is properly authenticated
3. **Database permissions**: Ensure RLS policies are correctly configured

### Vercel Deployment Issues

1. **Root Directory**: Make sure it's set to `project`
2. **Environment Variables**: Add all required env vars in Vercel dashboard
3. **Build Command**: Should be `npm run build`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details 