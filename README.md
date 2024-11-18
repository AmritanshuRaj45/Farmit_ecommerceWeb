
# FarmIT: Organic E-commerce Website


## EXECUTIVE SUMMARY  

FarmIT is an innovative and comprehensive e-commerce platform dedicated to promoting healthy, sustainable living by offering a wide range of organic products. This platform is thoughtfully designed to connect organic farmers and sellers directly with consumers who prioritize health, wellness, and environmental sustainability.  

FarmIT goes beyond just selling products—it fosters a community around the principles of organic living, providing a trusted marketplace for high-quality, fresh organic produce and goods.  

---  

## TABLE OF CONTENTS  

1. [Introduction](#1-introduction)  
2. [Technical Architecture](#2-technical-architecture)  
3. [Database Design](#3-database-design)  
4. [User Interface](#4-user-interface)  
5. [Customer Portal](#5-customer-portal)  
6. [Administrative System](#6-administrative-system)  
7. [Security Implementation](#7-security-implementation)  
8. [Installation & Setup](#8-installation--setup)  
9. [Maintenance & Support](#9-maintenance--support)  
10. [Future Enhancements](#10-future-enhancements)  
11. [Demo Video](#11-demo-video) 


---  

## 1. INTRODUCTION  

### 1.1 Project Overview  
FarmIT serves as a digital marketplace for organic products, implementing a user-friendly interface for customers while maintaining powerful backend capabilities for administrators. The platform emphasizes ease of use, security, and efficient order management.  


### 1.2 Key Features  
- Dual interface system (Customer/Admin)  
- Real-time inventory management  
- Secure authentication  
- Newsletter subscription system  
- Order tracking and management  
- Customer feedback system  

---  

## 2. TECHNICAL ARCHITECTURE  

## Technologies Used

### Frontend Technologies
- **HTML5**: Provides the structure and semantics of the web application.
- **CSS3**: Custom styles and responsive design for an optimal user experience.
- **JavaScript**: Handles client-side interactivity and logic.
- **[Bootstrap 5.1.3](https://getbootstrap.com/)**: Ensures a consistent, responsive layout with pre-designed components.
- **[Font Awesome 5](https://fontawesome.com/)**: Supplies icons for a modern and polished look.
- **[jQuery](https://jquery.com/)**: Simplifies DOM manipulations and AJAX requests.
- **[Lightbox](https://lokeshdhakar.com/projects/lightbox2/)**: Enables a user-friendly image gallery with pop-up overlays.

### Backend Technologies
- **[Node.js](https://nodejs.org/)**: A runtime environment to handle server-side logic.
- **[Express.js](https://expressjs.com/)**: Simplifies routing and middleware for the application.
- **[MySQL](https://www.mysql.com/)**: Database management for storing and retrieving structured data.
- **[JWT](https://jwt.io/)**: Secure token-based authentication to protect user sessions.

### Libraries & Plugins
- **[SweetAlert2](https://sweetalert2.github.io/)**: Displays custom alerts and notifications.
- **[Popper.js](https://popper.js.org/)**: Manages tooltips and popovers effectively.
- **[dotenv](https://www.npmjs.com/package/dotenv)**: Manages environment configuration securely.
- **[body-parser](https://www.npmjs.com/package/body-parser)**: Parses incoming requests for easier handling.
- **[express-fileupload](https://www.npmjs.com/package/express-fileupload)**: Enables file uploads within the application.
- **[express-session](https://www.npmjs.com/package/express-session)**: Handles user sessions efficiently.
- **[mysql2](https://www.npmjs.com/package/mysql2)**: Connects the application to the MySQL database.
- **[odbc](https://www.npmjs.com/package/odbc)**: Facilitates database connectivity through ODBC.

### External Resources
- **[Google Fonts](https://fonts.google.com/)**: Provides elegant typography for the website.
- **CDN**: Used to quickly load libraries like Bootstrap, jQuery, and Font Awesome, improving performance.
- **[Postman](https://www.postman.com/)**: Aids in API testing and debugging.
- **[Chrome DevTools](https://developer.chrome.com/docs/devtools/)**: Assists in debugging and performance optimization.

### Development Tools
- **[MySQL Workbench](https://www.mysql.com/products/workbench/)**: GUI for designing and managing the database schema.
- **[Git](https://git-scm.com/)**: Version control to track changes in the source code.
- **[GitHub](https://github.com/)**: Repository hosting for collaboration and deployment.

### Features Enabled by Technologies
- **Responsive Design**: Implemented using Bootstrap and CSS3.
- **Secure Authentication**: Managed via JWT and express-session.
- **Interactive Elements**: Powered by Bootstrap JS, SweetAlert2, and jQuery.
- **Database Operations**: Efficiently handled through MySQL and mysql2.
- **File Management**: Enabled via express-fileupload.
 

## 3. DATABASE DESIGN  

### 3.1 Schema Overview  
The database architecture consists of six primary tables, each serving specific functionality within the system.  

### 3.2 Table Descriptions  

#### USERS TABLE  
- Stores user information (customers and admins).  
- Role-based access control implementation.  

#### ORDERS TABLE  
- Tracks customer purchases and order history.  

#### ORDER ITEMS TABLE  
- Details of products in each order.  

#### ITEMS TABLE  
- Manages product inventory and stock tracking.  

#### CONTACTS TABLE  
- Stores customer feedback and support tickets.  

#### SUBSCRIPTION TABLE  
- Manages newsletter subscriptions.  

---  

## 4. USER INTERFACE  

### 4.1 Login System  
Secure login with role-based access control.  

### 4.2 Registration Process  
New user registration with validations.  

---  

## 5. CUSTOMER PORTAL  

### Navigation Structure  
- Home  
- About  
- Products  
- Contact  
- Cart  

---  

## 6. ADMINISTRATIVE SYSTEM  

### Key Functionalities  
- Order Management  
- Inventory Control  
- User Management  
- Reporting System  

---  

## 7. SECURITY IMPLEMENTATION  

- Role-based access control  
- Secure session handling  

---  

## 8. INSTALLATION & SETUP  

### Prerequisites  
- Node.js (v14+)  
- MySQL (v8+)  

### Setup  
```bash  
# Clone repository  
git clone [AmritanshuRaj45/Farmit_ecommerceWeb]  

# Install dependencies  
npm install  

# Configure environment  
cp .env.example .env  

# Initialize database  
mysql -u root -p < schema.sql  

# Start application  
npm start  
```  

---  

## 9. MAINTENANCE & SUPPORT  

- Regular performance optimizations.  

---  

## 10. FUTURE ENHANCEMENTS  

- OTP-based registration.  
- Advanced analytics.  

## 11. Demo Video  

[![Demo Video Thumbnail](https://github.com/user-attachments/assets/1f52848d-2756-47b0-9cd8-56af992cc971)](https://www.youtube.com/watch?v=adf1wH-CwL4)  

Currently, the linked video demonstrates the frontend implementation of FarmIT. A new demo video highlighting the full-stack functionality, including both frontend and backend features, will be available soon. Stay tuned for updates!


## Contact
Email: anshuraj204@gmail.com

