# Pioneer Ventures Society Main Website

Welcome to the official website codebase for the **Pioneer Ventures Society (PVS)**!

This comprehensive platform showcases our mission, manages community engagement, facilitates donations, and provides powerful administrative tools—all powered by Firebase and modern web technologies.

---

## 🚀 Key Features

### 🌐 **Public Website**
- **Mission & Vision** showcase with impact statistics
- **Dynamic Member Directory** with profiles, bios, and social links
- **Events Management** with registration and attendance tracking
- **Blog Section** for news, updates, and community stories
- **Merchandise Store** with WhatsApp integration for orders
- **Document Library** for important resources and downloads

### 💰 **Advanced Donation System**
- **Multiple Payment Methods** supporting Botswana mobile money and banking
- **Real-time Payment Verification** with proof of payment upload
- **Comprehensive Email Notifications** for donors and administrators
- **Admin Dashboard** for donation management and approval workflow
- **Flexible Payment Configuration** with dynamic payment method management
- **Professional Email Templates** for all donation states

### 🛠️ **Admin Panel**
- **Role-based Access Control** with secure authentication
- **Content Management** for all website sections
- **Donation Management** with approval/rejection workflow
- **Payment Method Configuration** for easy updates
- **Member Management** with profile editing capabilities
- **Event Management** with registration tracking
- **Document Management** with secure file uploads
- **Site Content Management** including dynamic initiatives

### 📧 **Email Notification System**
- **Donation Confirmations** sent to donors immediately
- **Admin Alerts** for new donations requiring attention
- **Approval/Rejection Notifications** with detailed reasons
- **Professional Templates** with clear instructions and branding
- **Multi-admin Support** for team notifications

### 🎯 **Enhanced User Experience**
- **Responsive Design** optimized for all devices
- **Instant Payment Details** display when methods are selected
- **Visual Feedback** throughout all user interactions
- **Accessibility Compliant** design and functionality
- **Fast Loading** with optimized builds and deployment

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui components
- **Backend:** Firebase (Firestore, Authentication, Storage, Hosting)
- **Email Service:** EmailJS (configurable)
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Build Tool:** Vite with dual build configuration
- **Deployment:** Firebase Hosting with custom domains

---

## 🔗 Live Sites

- **Main Website:** https://pioneer-ventures-society.web.app
- **Admin Panel:** https://pioneer-ventures-society-admin.web.app
- **Custom Domain:** www.pioneer-ventures-society.org (when configured)

---

## 🏗️ Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   │   └── ui/             # shadcn/ui components
│   ├── pages/              # Main website pages
│   ├── admin/              # Admin panel components
│   │   ├── donations/      # Donation management
│   │   ├── payment-config/ # Payment method configuration
│   │   ├── members/        # Member management
│   │   ├── events/         # Event management
│   │   └── site-content/   # Content management
│   ├── lib/                # Utility libraries
│   │   ├── firebase.ts     # Firebase configuration
│   │   ├── email.ts        # Email service and templates
│   │   ├── payment.ts      # Payment processing logic
│   │   └── admin-config.ts # Admin configuration
│   ├── types/              # TypeScript type definitions
│   └── hooks/              # Custom React hooks
├── public/                 # Static assets
├── dist-main/              # Main site build output
├── dist-admin/             # Admin panel build output
├── EMAIL_SETUP.md          # Email integration guide
├── PAYMENT_SETUP.md        # Payment system guide
└── vite.config.*.ts        # Vite build configurations
```

---

## ⚡ Getting Started

### 1. **Clone and Install**
```bash
git clone https://github.com/WyvernPirate/Pioneer-Ventures-Society.git
cd Pioneer-Ventures-Society
npm install
```

### 2. **Environment Configuration**
Copy the example environment file and configure your settings:
```bash
cp .env.example .env
```

Fill in your configuration values:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"

# Email Service (EmailJS)
NEXT_PUBLIC_EMAILJS_SERVICE_ID="your-service-id"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="your-template-id"
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="your-public-key"

# Admin Email Configuration
VITE_ADMIN_NOTIFICATION_EMAILS="admin@your-org.com,finance@your-org.com"
VITE_PRIMARY_ADMIN_EMAIL="admin@your-org.com"
VITE_FINANCE_EMAIL="finance@your-org.com"
```

### 3. **Development**
```bash
# Run main site in development
npm run dev:main

# Run admin panel in development  
npm run dev:admin

# Run both simultaneously
npm run dev
```

### 4. **Building**
```bash
# Build both main site and admin panel
npm run build

# Build individually
npm run build:main
npm run build:admin
```

### 5. **Deployment**
```bash
# Deploy to Firebase Hosting
firebase deploy

# Deploy specific targets
firebase deploy --only hosting:pioneer-ventures-society
firebase deploy --only hosting:pioneer-ventures-society-admin
```

---

## 🔒 Admin System

### **Authentication**
- Secure Firebase Authentication required for admin access
- Role-based access control for different admin functions
- Session management with automatic logout

### **Admin Capabilities**
- **Content Management:** Create, edit, and publish website content
- **Donation Management:** Review, approve, or reject donations with reasons
- **Payment Configuration:** Manage payment methods and instructions
- **Member Management:** Add, edit, and manage member profiles
- **Event Management:** Create and manage events with registration tracking
- **Document Management:** Upload and organize important documents
- **Email Notifications:** Automatic notifications for all admin actions

### **Donation Workflow**
1. **User submits donation** → Automatic confirmation email sent
2. **Admin receives notification** → Real-time email alert with donation details
3. **Admin reviews donation** → View proof of payment and details
4. **Admin approves/rejects** → Automatic email sent to donor with outcome
5. **System tracks everything** → Complete audit trail maintained

---

## 📦 Deployment & Configuration

### **Firebase Hosting**
The project uses dual Firebase Hosting configuration:
- **Main Site:** `pioneer-ventures-society` (public website)
- **Admin Panel:** `pioneer-ventures-society-admin` (admin interface)

### **Email Integration Setup**
For production email functionality, follow the [EMAIL_SETUP.md](./EMAIL_SETUP.md) guide:
1. Create EmailJS account
2. Configure email templates
3. Update environment variables
4. Test email functionality

### **Payment System Setup**
Configure payment methods using the admin panel:
1. Access admin panel → Payment Configuration
2. Add/edit payment methods (Orange Money, Mascom MyZaka, FNB, etc.)
3. Update payment instructions and contact details
4. Test donation flow

### **Custom Domain Setup**
1. Configure custom domain in Firebase Hosting
2. Update DNS records (A/CNAME)
3. Enable SSL certificates
4. Test both main site and admin panel access

### **Environment-Specific Configuration**
- **Development:** Uses local Firebase emulators (optional)
- **Staging:** Separate Firebase project for testing
- **Production:** Live Firebase project with real payment methods

---

## 📚 Additional Documentation

- **[EMAIL_SETUP.md](./EMAIL_SETUP.md)** - Complete email integration guide
- **[PAYMENT_SETUP.md](./PAYMENT_SETUP.md)** - Payment system configuration
- **[FIXES_APPLIED.md](./FIXES_APPLIED.md)** - Development history and fixes

## 🚀 Available Scripts

```bash
# Development
npm run dev              # Run both main and admin in development
npm run dev:main         # Run main site only
npm run dev:admin        # Run admin panel only

# Building
npm run build            # Build both applications
npm run build:main       # Build main site only
npm run build:admin      # Build admin panel only

# Preview
npm run preview:main     # Preview main site build
npm run preview:admin    # Preview admin panel build

# Deployment
firebase deploy          # Deploy both sites
firebase serve           # Serve locally using Firebase
```

## 🔧 Key Features Implementation

### **Donation System**
- **Multi-payment Support:** Orange Money, Mascom MyZaka, FNB Pay2Cell, Bank Transfer
- **Proof Upload:** Drag-and-drop image upload with validation
- **Real-time Notifications:** Instant email alerts for all stakeholders
- **Admin Dashboard:** Complete donation management with approval workflow

### **Email System**
- **Professional Templates:** Branded emails for all donation states
- **Multi-recipient Support:** Notify multiple admins simultaneously
- **Error Handling:** Graceful fallbacks if email service fails
- **Template Customization:** Easy to modify email content and styling

### **Admin Panel**
- **Secure Authentication:** Firebase Auth with role-based access
- **Content Management:** Full CRUD operations for all content types
- **File Management:** Secure file uploads with Firebase Storage
- **Audit Trail:** Complete logging of all admin actions

## 🐛 Troubleshooting

### **Common Issues**
1. **Build Errors:** Ensure all environment variables are set
2. **Email Not Sending:** Check EmailJS configuration and API keys
3. **Firebase Errors:** Verify Firebase project configuration
4. **Payment Issues:** Confirm payment method configuration in admin panel

### **Development Tips**
- Use Firebase emulators for local development
- Test email templates before production deployment
- Regularly backup Firestore data
- Monitor Firebase usage and quotas

## 📄 License

[MIT](LICENSE) © Pioneer Ventures Society

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📬 Contact

- **Website:** https://pioneer-ventures-society.web.app
- **Email:** info@pioneer-ventures-society.org
- **Admin Panel:** https://pioneer-ventures-society-admin.web.app

---

**Pioneer Ventures Society** – Empowering innovation and entrepreneurship in Botswana and beyond.
