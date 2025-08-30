# NexusMart - Full-Stack E-Commerce Marketplace

NexusMart is a comprehensive, production-ready, three-sided marketplace application built with a modern tech stack. It provides a seamless experience for customers, a powerful control panel for administrators, and a dedicated interface for delivery riders.

This project was built collaboratively in Firebase Studio, showcasing the power of AI-assisted development to create complex, real-world applications.

---

## ✨ Features

### 🛒 Customer-Facing (User Panel)
- **Dynamic Homepage:** Features a hero section and "How It Works" guide.
- **Product Marketplace:** Browse products with search, main category, and sub-category filtering.
- **Product Details:** View product information in a scrollable pop-up dialog.
- **Product Inquiry:** Contact the admin directly about a product via an external chat link (e.g., WhatsApp) with a pre-filled message.
- **Shopping Cart:** Add/remove items and update quantities.
- **Full Checkout Process:** Multi-step checkout with user details, order notes, and payment method selection.
- **User Authentication:** Secure sign-up, login, and forgot password functionality using Firebase Auth.
- **Order History:** Authenticated users can view their past orders and current order statuses.
- **Guest Orders:** Non-logged-in users can place orders and track them via their browser's local storage.

### ⚙️ Admin Panel
- **Secure Login:** Separate, secure login for administrators.
- **Dashboard:** At-a-glance view of total revenue, orders, active orders, and product count, with a 7-day sales chart.
- **Order Management:** View and manage all orders, assign riders, and update order statuses in real-time.
- **Product Management:** Full CRUD (Create, Read, Update, Delete) functionality for products.
- **Category Management:** Manage main and sub-categories for the marketplace.
- **Rider Management:** Full CRUD functionality for delivery riders.
- **Admin Management:** Manage other admin accounts.
- **Appearance & General Settings:** Customize the site's hero image, delivery fees, carousel images, and contact/social media links without changing the code.
- **Finance Management:** Add, edit, and delete available payment methods for checkout.

### 🛵 Rider Panel
- **Secure Login:** Separate, secure login for riders.
- **Rider Dashboard:** View assigned and completed delivery orders.
- **Order Details:** Access customer information and address for assigned deliveries.
- **Status Updates:** Mark orders as "Picked Up" and "Delivered".
- **Delivery History:** View a complete history of all deliveries made.
- **Rider Profile:** View personal and vehicle information.

---

## 🚀 Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS with ShadCN UI components
- **Database & Auth:** Firebase (Firestore, Authentication)
- **State Management:** React Context API & Custom Hooks
- **Deployment:** Ready for Vercel, Netlify, or any other modern Next.js hosting.

---

This project is now complete and ready for deployment.