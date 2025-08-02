# Total Compact Admin

A modern, responsive React-based admin dashboard for managing Total Compact. Built with TypeScript, Tailwind CSS, and Vite for optimal performance.

## 🚀 Features

### **Authentication & Security**

- **User Authentication**: Secure signin/signup system with JWT tokens
- **Protected Routes**: Role-based access control for admin functionality
- **Session Management**: Automatic token validation and refresh

### **Project Management**

- **Create Projects**: Upload new Total Compact projects with detailed information
- **Edit Projects**: Modify existing projects with comprehensive edit forms
- **Delete Projects**: Remove projects with confirmation dialogs
- **View Projects**: Detailed project view with image galleries

### **Dashboard Analytics**

- **Overview Dashboard**: Real-time statistics and project metrics
- **Recent Projects**: Display latest uploaded projects
- **Project Statistics**: Total projects, recent uploads, and activity tracking

### **Image Management**

- **Multiple Image Upload**: Support for multiple project images
- **Image Captions**: Add descriptive captions to project images
- **Image Gallery**: Interactive image gallery with lightbox view
- **Image Editing**: Update project images with existing/new image handling

### **Project Details**

- **Comprehensive Information**: Name, description, location, status, type
- **Location Data**: Address, city, state, zip code management
- **Project Specifications**: Completion dates, total units, price ranges
- **Features List**: Dynamic feature management for each project
- **Status Tracking**: Planning, Under Construction, Completed, On Hold, Cancelled

## 🛠️ Tech Stack

### **Frontend**

- **React 19**: Latest React with hooks and modern patterns
- **TypeScript**: Type-safe development with strict type checking
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Vite**: Fast build tool and development server

### **UI Components**

- **Headless UI**: Accessible, unstyled UI components
- **React Icons**: Comprehensive icon library
- **Lucide React**: Beautiful, customizable icons

### **HTTP Client**

- **Axios**: Promise-based HTTP client for API communication

### **Routing**

- **React Router DOM**: Client-side routing with nested routes

## 📦 Installation

### **Prerequisites**

- Node.js (v18 or higher)
- npm or yarn package manager

### **Setup Instructions**

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Total-Compact-admin
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   VITE_APP_API_URL=http://localhost:3000
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🚀 Usage

### **Development**

```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Preview production build
npm run preview
```

### **Available Scripts**

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build locally

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
│   ├── Dashboard.tsx           # Main dashboard layout
│   ├── DashboardOverview.tsx   # Dashboard overview with stats
│   ├── ManageProject.tsx       # Project management interface
│   ├── UploadProject.tsx       # Project creation form
│   ├── Signin.tsx             # User authentication
│   └── Signup.tsx             # User registration
├── utils/              # Utility functions and helpers
├── assets/             # Static assets (images, fonts)
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🎨 Key Features

### **Responsive Design**

- Mobile-first approach with Tailwind CSS
- Responsive grid layouts and components
- Touch-friendly interface for mobile devices

### **Modern UI/UX**

- Clean, professional design
- Smooth animations and transitions
- Intuitive navigation and user flow
- Loading states and error handling

### **Real-time Updates**

- Live project statistics
- Immediate UI updates after operations
- Optimistic updates for better UX

### **Image Handling**

- Drag-and-drop image upload
- Image preview and validation
- Multiple image support with captions
- Image gallery with lightbox functionality

## 🔧 Configuration

### **Environment Variables**

- `VITE_APP_API_URL`: Backend API base URL

### **API Integration**

The application integrates with a RESTful API for:

- User authentication and authorization
- Project CRUD operations
- Image upload and management
- Real-time data synchronization

## 🚀 Deployment

### **Vercel Deployment**

The project includes `vercel.json` for easy deployment on Vercel:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### **Build Output**

- Optimized production build
- Static file serving
- Client-side routing support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

## 🔄 Version History

- **v1.0.0**: Initial release with core project management features
- **v1.1.0**: Added image management and gallery functionality
- **v1.2.0**: Enhanced dashboard with real-time statistics
- **v1.3.0**: Improved edit functionality and image persistence

---

**© 2025 Total Compact. All rights reserved.**
