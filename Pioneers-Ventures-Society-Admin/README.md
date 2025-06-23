# Pioneer Ventures Society Admin Panel

This codebase powers the **Admin Panel** for the Pioneer Ventures Society (PVS) platform.

The Admin Panel is a secure, role-based interface for creators (T1) and moderators (T2) to manage site content, approve submissions, oversee members, and maintain the quality of the main PVS website.

---

## ✨ Features

- **Content Moderation:** Review, approve, and publish blog posts, events, and member profiles.
- **Role-based Permissions:**
  - **T1 (Creator):** Submit content for review.
  - **T2 (Moderator):** Review, approve, and publish content; manage member data.
- **Audit Logging:** Track all admin actions for transparency and security.
- **Member Management:** View, edit, and manage member records.
- **Event Management:** Create, update, and remove events.
- **Secure Authentication:** Firebase Authentication for admin access.
- **Responsive UI:** Works on desktop and mobile for admins on the go.

---

## 🛠️ Tech Stack

- **Frontend:** TypeScript, [your chosen framework: React/Vue/Other]
- **Styling:** CSS, [any framework or custom]
- **Backend & Hosting:** Firebase (Firestore, Authentication, Storage, Hosting)
- **Deployment:** [Subdomain or subpath, e.g., `admin.pvsociety.org` or `/admin`]

---

## 🚦 Access Control

- **Restricted to authorized PVS admins.**
- All actions are logged and subject to moderation workflows.
- Uses the same Firebase project as the main site for seamless data access and consistency.

---

## ⚡ Getting Started

1. **Clone the repo** (if in sub-directory, navigate to the admin folder)
    ```sh
    git clone https://github.com/WyvernPirate/Pioneer-Ventures-Society.git
    cd Pioneer-Ventures-Society/Pioneers-Ventures-Society-Admin
    ```

2. **Install dependencies**
    ```sh
    npm install
    ```

3. **Configure Firebase**
    - Copy `.env.example` to `.env` and insert your Firebase Admin Panel config (use same project as main site).

4. **Run locally**
    ```sh
    npm start
    ```

---

## 📦 Folder Structure

- `/src` — Admin panel source code
- `/assets` — Admin-specific images and icons
- `/public` — Static assets and entry point

---

## 🚀 Deployment

- Deployed via **Firebase Hosting**.
- Typically served on a subdomain (`admin.pvsociety.org`) or subpath (`/admin`) for separation from the main site.
- Uses Cloudflare for DNS and SSL.

---

## 📝 License

[MIT](LICENSE) © Pioneer Ventures Society

---

## 🤝 Contributing

Admin panel is restricted to authorized contributors.  
Open an issue for bug reports, improvements, or access requests.

---

## 📬 Contact

- [Your main email/contact form]
- [Internal communication channel if any]

---

**PVS Admin Panel** – Empowering secure, community-driven management.
