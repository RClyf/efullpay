# Point of Sale (POS) System Documentation

## Overview

This repository contains a simple Point of Sale (POS) system implemented using Node.js and Supabase as the backend database. The system includes features for user authentication, account management, inventory management, transaction processing, and recapitulation of sales.

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://gitlab.informatika.org/k2_g2/efullpay.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd efullpay
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Set up Supabase:**

   - Create an account on [Supabase](https://supabase.io/).
   - Create a new project and obtain the API URL and API Key.
   - Replace the `supabaseUrl` and `supabaseKey` variables in `app.js` with your Supabase project details.

5. **Run the application:**

    ```bash
    npm start
    ```

   The server will be accessible at `http://localhost:8080` by default.

## Features

### 1. User Authentication

- Users can log in using their username and password.
- Passwords are securely hashed using bcrypt for storage in the database.

### 2. Account Management

- Admin users can view and manage user accounts.
- Functionality includes adding, editing, and removing user accounts.

### 3. Inventory Management

- Admin users can manage the inventory of products.
- Functionality includes adding, editing, and removing products from the inventory.
- File upload for product images is implemented using multer.

### 4. Transaction Processing

- Admin and cashier users can process transactions.
- Users can add products to a shopping cart, edit quantities, and remove items.
- The system calculates the total price of the transaction.

### 5. Recapitulation

- Admin users can view a recapitulation of all transactions.
- The recapitulation includes details such as transaction ID, date, and total sales.

## File Structure

- **server/app.js**: Main server file containing the Express application.
- **utility/utility.js**: Utility function for generating unique IDs.
- **views/**: Folder containing EJS templates for different pages.

## Dependencies

- `@supabase/supabase-js`: Supabase JavaScript client.
- `axios`: HTTP client for making requests.
- `bcrypt`: Library for hashing passwords securely.
- `body-parser`: Middleware for handling HTTP POST requests.
- `connect-flash`: Middleware for displaying flash messages.
- `ejs`: Templating engine for rendering HTML.
- `express`: Web application framework for Node.js.
- `express-ejs-layouts`: Layout support for EJS templates.
- `express-session`: Middleware for managing user sessions.
- `morgan`: HTTP request logger middleware.
- `multer`: Middleware for handling file uploads.
- `randomstring`: Library for generating random strings.

## Usage

1. **Login**: Access the system by visiting `http://localhost:8080/`. Log in with valid credentials.

2. **Home Page**: After logging in, users are redirected to the home page (`/home`).

3. **Navigation**: Use the navigation links to access different sections of the POS system.

4. **Account Management**: Admin users can manage accounts, including adding, editing, and removing user accounts.

5. **Inventory Management**: Admin users can manage the inventory, including adding, editing, and removing products.

6. **Transaction Processing**: Admin and cashier users can process transactions. Add products to the cart, edit quantities, and complete transactions.

7. **Recapitulation**: Admin users can view a recapitulation of all transactions.

## Additional Notes

- This system uses Supabase as the backend, and you need to set up a Supabase project for database functionality.

- Ensure that the required dependencies are installed using `npm install` before running the application.

- The file upload functionality is set to save images in the `public/image` directory.

- Customize the Supabase connection details, session secret, and other configurations in the `app.js` file.

## Future Improvements

- Implement user roles and permissions for more fine-grained access control.
- Enhance the user interface for a more intuitive user experience.
- Implement validation for user inputs to improve data integrity.

Feel free to contribute to this project and make it even better!
