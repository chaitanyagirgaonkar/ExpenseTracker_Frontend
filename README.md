# Expense Tracker Frontend

Modern React.js frontend for the Expense Tracker application with responsive design, dark mode, and comprehensive expense management features.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

The application will start on http://localhost:3000

## 🎨 Features

### Core Features
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark/Light Mode** - Theme switching with system preference detection
- **Authentication** - Secure login/signup with JWT tokens
- **Dashboard Analytics** - Visual charts and spending insights
- **Expense Management** - Add, edit, delete, and categorize expenses
- **Budget Tracking** - Set budgets with progress monitoring
- **Udhari Tracker** - Track borrow/lend transactions

### UI Components
- **Modern Design** - Clean, intuitive interface
- **Interactive Charts** - Recharts integration for data visualization
- **Form Validation** - Real-time input validation
- **Toast Notifications** - User feedback with react-hot-toast
- **Loading States** - Smooth loading indicators
- **Error Handling** - Graceful error management

## 🛠️ Tech Stack

- **React.js** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Hot Toast** - Notifications
- **Lucide React** - Icon library

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main layout wrapper
│   │   ├── ExpenseForm.jsx     # Expense form modal
│   │   ├── ExpenseList.jsx     # Expense list component
│   │   └── UdhariForm.jsx      # Udhari form modal
│   ├── context/
│   │   ├── AuthContext.jsx     # Authentication context
│   │   └── ThemeContext.jsx    # Theme management
│   ├── pages/
│   │   ├── Login.jsx          # Login page
│   │   ├── Signup.jsx         # Registration page
│   │   ├── Dashboard.jsx      # Analytics dashboard
│   │   ├── Expenses.jsx       # Expense management
│   │   ├── Budget.jsx         # Budget management
│   │   ├── Udhari.jsx         # Udhari tracking
│   │   └── Profile.jsx        # User profile
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # App entry point
│   └── index.css              # Global styles
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
└── index.html
```

## 🎯 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🎨 UI Components

### Layout Component
- Responsive sidebar navigation
- Mobile-friendly hamburger menu
- User profile section
- Theme toggle button

### Dashboard
- **Analytics Cards** - Total spent, budget, savings, highest category
- **Budget Progress** - Visual progress bar with utilization percentage
- **Category Breakdown** - Pie chart showing expense distribution
- **Monthly Trend** - Line chart showing spending over time
- **Udhari Summary** - Borrow/lend overview

### Expense Management
- **Quick Add Form** - Modal form for adding expenses
- **Expense List** - Categorized list with edit/delete actions
- **Search & Filter** - Filter by category, date range, and search terms
- **Pagination** - Efficient data loading

### Budget Management
- **Budget Setting** - Monthly budget configuration
- **Category Budgets** - Individual category budget allocation
- **Progress Tracking** - Visual budget utilization
- **Alerts** - Over-budget notifications

### Udhari Tracker
- **Transaction Types** - Borrow vs lend tracking
- **Person Management** - Track transactions by person
- **Settlement** - Mark transactions as settled
- **Summary Dashboard** - Net balance calculation

## 🎨 Styling

### Tailwind CSS Configuration
- Custom color palette
- Dark mode support
- Responsive breakpoints
- Custom animations
- Component utilities

### Theme System
- Light/Dark mode toggle
- System preference detection
- Persistent theme storage
- Smooth transitions

## 🔧 Development

### Component Structure
```jsx
// Example component structure
const ComponentName = () => {
  // State management
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // Event handlers
  const handleEvent = () => {
    // Event logic
  };
  
  // Render
  return (
    <div className="component-wrapper">
      {/* JSX content */}
    </div>
  );
};
```

### Context Usage
```jsx
// Authentication
const { user, login, logout } = useAuth();

// Theme
const { theme, toggleTheme, isDark } = useTheme();
```

### API Integration
```jsx
// API calls with error handling
const fetchData = async () => {
  try {
    const response = await axios.get('/api/endpoint');
    setData(response.data);
  } catch (error) {
    toast.error('Failed to fetch data');
  }
};
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
# Build the project
npm run build

# Deploy dist folder to Netlify
```

### Environment Variables
Create `.env` file for production:
```env
VITE_API_URL=https://your-api-domain.com/api
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Touch-friendly interface
- Swipe gestures
- Optimized forms
- Mobile navigation

## 🎨 Customization

### Colors
```javascript
// tailwind.config.js
colors: {
  primary: { /* Primary color palette */ },
  success: { /* Success color palette */ },
  warning: { /* Warning color palette */ },
  danger: { /* Danger color palette */ }
}
```

### Components
- Reusable button components
- Form input components
- Modal components
- Card components

## 🧪 Testing

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🆘 Support

For support and questions, please open an issue in the repository.
