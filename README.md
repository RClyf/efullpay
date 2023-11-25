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

- **node_modules/** : Containing nodejs modules.
- **public/css/style.css** : Containing css file for styling.
- **public/image/** : Containing image files.
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

## API Endpoints

### Authentication

- **Endpoint**: `/login`
  - **Method**: `POST`
  - **Description**: Authenticate user based on provided username and password.
  - **Request Body**:
    - `username` (string): User's username
    - `password` (string): User's password
  - **Response**:
    - Successful login redirects to the home page.
    - Invalid credentials redirect to the login page with an error message.

- **Endpoint**: `/signout`
  - **Method**: `GET`
  - **Description**: Log out the user and destroy the session.
  - **Response**: Redirects to the login page.

### Account Management

- **Endpoint**: `/account-management`
  - **Method**: `GET`
  - **Description**: Retrieve and display user accounts for admin users.
  - **Response**: Renders the account management page.

- **Endpoint**: `/remove-from-account`
  - **Method**: `POST`
  - **Description**: Remove a user account based on the provided user ID.
  - **Request Body**:
    - `id_pengguna` (string): User ID to be removed.
  - **Response**: Redirects to the account management page after removal.

- **Endpoint**: `/edit-from-account-management`
  - **Method**: `POST`
  - **Description**: Add or edit a user account.
  - **Request Body**:
    - `id_pengguna` (string): User ID (leave empty for new user).
    - `username` (string): User's username.
    - `password` (string): User's password.
    - `nama` (string): User's name.
    - `email` (string): User's email.
    - `role` (string): User's role (e.g., Admin, Cashier).
  - **Response**: Redirects to the account management page after the operation.

### Inventory Management

- **Endpoint**: `/inventory`
  - **Method**: `GET`
  - **Description**: Retrieve and display product inventory.
  - **Response**: Renders the inventory management page.

- **Endpoint**: `/remove-from-inventory`
  - **Method**: `POST`
  - **Description**: Remove a product from the inventory based on the provided product ID.
  - **Request Body**:
    - `id_barang` (string): Product ID to be removed.
  - **Response**: Redirects to the inventory management page after removal.

- **Endpoint**: `/edit-from-inventory`
  - **Method**: `POST`
  - **Description**: Add or edit a product in the inventory.
  - **Request Body**:
    - `id_barang` (string): Product ID (leave empty for new product).
    - `jenis_barang` (string): Product type.
    - `stock` (integer): Product stock quantity.
    - `harga` (integer): Product price.
    - `deskripsi` (string): Product description.
    - `image` (file): Product image.
  - **Response**: Redirects to the inventory management page after the operation.

### Transaction Processing

- **Endpoint**: `/transaction`
  - **Method**: `GET`
  - **Description**: Process transactions, add products to the cart, and calculate total prices.
  - **Response**: Renders the transaction processing page.

- **Endpoint**: `/add-to-cart`
  - **Method**: `POST`
  - **Description**: Add a product to the shopping cart.
  - **Request Body**:
    - `id_barang` (string): Product ID.
    - `jenis_barang` (string): Product type.
    - `harga` (integer): Product price.
    - `jumlah` (integer): Quantity of the product.
  - **Response**: Redirects to the transaction processing page after adding to the cart.

- **Endpoint**: `/edit-jumlah`
  - **Method**: `POST`
  - **Description**: Edit the quantity of a product in the cart.
  - **Request Body**:
    - `id_barang` (string): Product ID.
    - `jumlah` (integer): New quantity of the product.
  - **Response**: Redirects to the transaction processing page after editing the quantity.

- **Endpoint**: `/remove-from-cart`
  - **Method**: `POST`
  - **Description**: Remove a product from the cart.
  - **Request Body**:
    - `id_barang` (string): Product ID.
  - **Response**: Redirects to the transaction processing page after removal.

- **Endpoint**: `/reset-cart`
  - **Method**: `POST`
  - **Description**: Reset the shopping cart.
  - **Response**: Redirects to the transaction processing page after resetting the cart.

- **Endpoint**: `/pay`
  - **Method**: `POST`
  - **Description**: Finalize the transaction, update the database, and reset the cart.
  - **Request Body**:
    - `jenisPembayaran` (string): Payment method (e.g., Cash, Credit Card).
  - **Response**: Redirects to the transaction processing page after completing the transaction.

### Recapitulation

- **Endpoint**: `/recapitulation`
  - **Method**: `GET`
  - **Description**: View a recapitulation of all transactions for admin users.
  - **Response**: Renders the recapitulation page.

- **Endpoint**: `/transaction-details/:id`
  - **Method**: `GET`
  - **Description**: View details of a specific transaction for admin users.
  - **Response**: Returns JSON data with transaction details, including product details.

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
