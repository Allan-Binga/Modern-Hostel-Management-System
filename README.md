# Prestige Hostel Management System - Prestige Girls Hostel

Welcome to **Prestige Hostel Management System**!  
This web application is designed to help you manage your hostel easily and efficiently—no coding required.

---

## 🚀 Overview

Prestige Hostel Management System is your all-in-one digital assistant for organizing hostel operations. Manage tenants, bookings, payments, and more from a single, user-friendly dashboard.

---

## ✨ Features

- **Tenant Management**  
    Add, update, or remove tenant details (names, contacts, room assignments).

- **Booking Management**  
    Track room bookings, check-in, and check-out dates.

- **Payment Tracking**  
    Record and monitor payments.  
    - Supports **Stripe** for secure card payments.  
    - _M-Pesa integration is planned for registered business accounts._

- **Issue Reporting**  
    Tenants can report maintenance or service issues. Automated emails notify both tenants and admins.

- **Technician Assignment**  
    Admins can assign available technicians to reported issues. Tenants are notified with technician details.

- **Advertisement System**  
    Tenants can post ads for items or services. Admins review and approve them before publishing.

- **Direct Contact**  
    Tenants can click a **Contact Now** button, which opens the platform’s phonebook for quick communication.

- **Email Notifications**  
    Automated emails for payment confirmations, booking updates, issue reports, and advertisement approvals (via Nodemailer).

- **User Authentication**  
    Secure login for admins and tenants. Passwords are safely stored using hashing methods.

- **Dashboard**  
    Visual overview of occupancy, payments, issues, and more.

---

## 🧭 User Flow

### 🔑 Tenant Journey

1. **Login & Home View**  
   Tenants log into the system and land on the home screen. From there, they scroll down to view available rooms.

2. **Room Booking**  
   A tenant selects a room and books it. Upon successful booking, they are redirected to the **Bookings** page.

3. **Payment via Stripe**  
   The tenant proceeds to pay for the room using the integrated Stripe payment gateway.  
   - Use test card: `4242 4242 4242 4242`  
   - Enter any **future expiry date** and any **3-digit CVV**.

4. **Reporting Issues**  
   Tenants can report issues (e.g., water problems, electrical faults).  
   - Upon reporting, they receive an email confirming the issue has been initiated.  
   - Admins receive an **"Action Required"** email with the report.

5. **Technician Assignment**  
   Admins log into the platform, view reported issues, and assign available technicians.  
   - Tenants are notified via email or platform alerts, including technician **name** and **phone number**.

6. **Posting Advertisements**  
   Tenants can post ads (e.g., selling items or services).  
   - Admins review and approve each advertisement.  
   - Tenants receive a notification upon approval, and the ad's status is updated to "Approved".

7. **Contact Now**  
   A **Contact Now** button allows tenants to access a phonebook to reach out to relevant contacts quickly.

---

## 🛠️ How It Works

- **Frontend:**  
    Built with [React Vite](https://vitejs.dev/), providing a fast and intuitive interface.

- **Backend:**  
    Powered by [Express](https://expressjs.com/) and [Node.js](https://nodejs.org/), ensuring reliability and speed.

- **Database:**  
    All data is securely stored in a [PostgreSQL](https://www.postgresql.org/) database.

- **Hosting:**  
    Deployed on [Heroku](https://www.heroku.com/) for 24/7 online access.

- **Code Storage:**  
    Source code managed on [GitHub](https://github.com/).

- **Automations:**  
    [Jenkins](https://www.jenkins.io/) automates testing and deployments.

- **Containerization:**  
    [Docker](https://www.docker.com/) ensures easy setup and portability.

- **API Testing:**  
    [Postman](https://www.postman.com/) used for backend testing.

- **Development Tools:**  
    Built using [VS Code](https://code.visualstudio.com/).

---

## 🔐 Security

- **JWT Authentication:**  
    Uses [JWT](https://jwt.io/) for secure cookie-based session management.

- **Password Protection:**  
    All passwords are hashed using industry-standard algorithms to prevent leaks.

- **Secure Payments:**  
    Stripe handles payment processing with full PCI compliance.

---

## 📝 Getting Started

1. **Access the Website:**  
     - Open the provided Heroku link.
     - Select admin login or the tenant login.

2. **Navigate the Dashboard:**  
     - Use sections like **Tenants**, **Bookings**, and **Payments**.

3. **Manage Tenants & Bookings:**  
     - Add, update, or remove tenants and bookings via simple forms.

4. **Handle Payments:**  
     - Process payments securely with Stripe.  
     - _M-Pesa will be available once a registered business account is set up._

5. **Check Emails:**  
     - Tenants receive automated notifications—no extra steps needed.

---

## ℹ️ Good to Know

- **No Coding Needed:**  
    Designed for ease of use—just like a smartphone app.

- **Internet Required:**  
    Access the system from any device with an internet connection.

- **Support:**  
    For help or feature requests, contact the developer (details provided separately).

- **Updates:**  
    New features (like M-Pesa or reports) can be added—just let us know!

---

## ⚠️ Limitations

- **M-Pesa Integration:**  
    Not available until you have a registered business account.

- **Learning Curve:**  
    If you’re new to web systems, a quick guide or demo will be provided.

---

## 🌟 Why Choose Prestige Hostel Management System?

- Centralizes all your hostel data.
- Automates routine tasks (like sending emails).
- Secures payments and logins.
- Accessible anytime, anywhere.

---

## 📋 Next Steps

1. **Get Started:**  
     - Receive your website link, login details, and a quick-start guide.

2. **Feedback:**  
     - Share your thoughts or request new features.

3. **M-Pesa Integration:**  
     - Once you have a registered business account, we can enable this payment option.

---

Thank you for choosing **Prestige Hostel Management System**!  
We’re here to make hostel management simple and efficient.  
_Questions? Reach out anytime!_
