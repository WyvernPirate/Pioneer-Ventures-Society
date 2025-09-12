# Pioneer Ventures Society Main Website

Welcome to the official website codebase for the **Pioneer Ventures Society (PVS)**!

This platform is designed to showcase our mission, manage community members and events, publish blogs, and facilitate secure, role-based administration—all powered by Firebase and modern web technologies.

---

## 🚀 Features

- **Public Website** with information about PVS, events, blog, stats, and member directory
- **Role-based Admin Panel**  
  - T1 (Creators): Submit content for review  
  - T2 (Moderators): Review, approve, and publish content  
- **Moderation Workflow:** All public content goes through review before publishing
- **Member Profiles:** Dynamic directory with bios, images, and social links
- **Events Management:** List and manage upcoming and past events
- **Blog Section:** Publish news, updates, and stories
- **Statistical Highlights:** Showcase key numbers and infographics
- **Admin Audit Logs:** Track and review sensitive actions for security
- **Responsive Design:** Mobile-friendly and accessible

---

## 🛠️ Tech Stack

- **Frontend:** TypeScript, [your chosen framework: React/Vue/Other]
- **Styling:** CSS, [any framework: Tailwind, Material UI, etc.]
- **Backend & Hosting:** Firebase (Firestore, Authentication, Storage, Hosting)
- **Other:** Cloudflare (domain, DNS), [any analytics/SEO tool]

---

## 🔗 Live Site

> **www.pioneer-ventures-society.org**

---

## 🏗️ Project Structure

- `/src` — Main site source code
- `/assets` — Logos, images, and brand files
- `/admin` — (If separated) Admin panel source
- `/docs` — Requirements, process docs, design sketches
- `/public` — Static assets and entry point

---

## ⚡ Getting Started

1. **Clone the repo**
    ```sh
    git clone https://github.com/WyvernPirate/Pioneer-Ventures-Society.git
    cd Pioneer-Ventures-Society
    ```

2. **Install dependencies**
    ```sh
    npm install
    ```

3. **Configure Firebase**
    - The project uses `.env` file for Firebase configuration (already set up).

4. **Run locally**
    ```sh
    npm start
    ```

---

## 🔒 Roles & Permissions

| Role   | Abilities                                          |
|--------|----------------------------------------------------|
| T1     | Create/submit content for moderation               |
| T2     | Review, approve, and publish; moderate submissions |

All roles require secure authentication (Firebase Auth). Content moderation is enforced for all public publishing.

---

## 📦 Deployment

- The site is hosted via **Firebase Hosting**.
- For custom domains and subdomains, DNS is managed through **Cloudflare**.
- Admin panel can be deployed to a subdomain (e.g., `admin.pvsociety.org`) or subpath (`/admin`).

---

## 📄 License

[MIT](LICENSE) © Pioneer Ventures Society

---

## 🤝 Contributing

We welcome contributions!  
See [CONTRIBUTING.md](./CONTRIBUTING.md) or open an issue to get started.

---

## 📬 Contact

- [Your main email/contact form]
- [Social media handles, if public]

---

**Pioneer Ventures Society** – Empowering innovation and community.
