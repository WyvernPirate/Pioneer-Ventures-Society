# Pioneer Ventures Society

Welcome to the official code repository for the **Pioneer Ventures Society (PVS)**!  
This project powers both the main website and the admin panel for PVS, facilitating community engagement, event management, content publishing, and secure administration.

---

## Repository Structure

This monorepo contains two primary subdirectories:

- **`Pioneers-Ventures-Society-Main/`**  
  The main, public-facing website—showcasing PVS’s mission, events, blogs, and member directory.

- **`Pioneers-Ventures-Society-Admin/`**  
  The secure admin panel for creators and moderators, including tools for content review, member management, and moderation.

Each directory includes its own README with detailed instructions and features.

---

## Key Technologies

- **TypeScript** — Modern, type-safe JavaScript for frontend development
- **CSS** — Custom and/or framework-based styling
- **Firebase** — Firestore (database), Authentication, Storage, and Hosting
- **Cloudflare** — Domain, DNS, and SSL
- **Modern Frontend Framework** — React/Vue/Other (configurable per project)

---

## Features

- **Role-based Access:**  
  - **Creators (T1):** Submit content for moderation  
  - **Moderators (T2):** Review, approve, and publish content; manage members and events
- **Content Moderation:** Every public submission goes through review before publishing
- **Member & Event Management:** Directory, bios, social links, event listings
- **Blog & News Section:** Publish and moderate updates
- **Audit Logging:** Transparency for sensitive admin actions
- **Responsive Design:** Mobile-friendly interface for both public and admin panels

---

## Getting Started

1. **Clone the repository**
    ```sh
    git clone https://github.com/WyvernPirate/Pioneer-Ventures-Society.git
    cd Pioneer-Ventures-Society
    ```

2. **Navigate to either subdirectory and follow its README instructions**
    - `cd Pioneers-Ventures-Society-Main`
    - `cd Pioneers-Ventures-Society-Admin`

3. **Install dependencies and configure Firebase as described in each subproject**

---

## Deployment

- Hosted with **Firebase Hosting** (main site and admin panel may be deployed to separate subdomains or paths)
- DNS and SSL managed via **Cloudflare**

---

## License

[MIT](LICENSE) © Pioneer Ventures Society

---

## Contributing

Contributions are welcome!  
See the subproject READMEs or open an issue to get started.

---

## Contact

- [Main contact email or form]
- [Social media handles, if public]

---

**Pioneer Ventures Society** – Empowering innovation and community.
