# AWS Route 53 Clone

A full-stack clone of the AWS Route 53 console experience, built with Next.js, TypeScript, FastAPI, SQLAlchemy, and SQLite.

This project recreates the core Route 53 workflows and UI, including hosted zone management, DNS record management, authentication, search, filtering, pagination, modals, and persistent database storage.

> **Note:** This is a functional UI/API clone for educational and evaluation purposes. It does not perform real DNS operations.

---

## Features

### Authentication

- Mock login and logout
- Session persistence using browser storage
- Protected backend API routes
- Demo credentials included for local testing

### Hosted Zones

- View all hosted zones
- Create a hosted zone
- Edit an existing hosted zone
- Delete a hosted zone
- Search hosted zones
- Filter by Public / Private zone type
- View hosted zone details
- Persistent SQLite storage

### DNS Records

Supported DNS record types:

- A
- AAAA
- CNAME
- TXT
- MX
- NS
- PTR
- SRV
- CAA

Record functionality includes:

- Create records
- Edit records
- Delete records
- Search records
- Filter by record type
- View records belonging to a hosted zone
- Persistent database storage

### Route 53 Console Experience

- AWS-style navigation
- Route 53 sidebar navigation
- Breadcrumb navigation
- Hosted zone and record tables
- Search and filter controls
- Pagination
- Action buttons
- Create/Edit/Delete modals
- Success and error notifications
- Responsive layout
- Dark mode

### Mocked Sections

The following Route 53 sections are included as placeholders:

- Dashboard
- Traffic Policies
- Health Checks
- Resolver
- Profiles

These sections are intentionally mocked because they are outside the core hosted-zone and DNS-record workflows.

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- CSS
- App Router

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- SQLite

### Authentication

- Mock authentication
- Bearer token authentication
- SHA-256 password hashing

---

### Keyboard Shortcuts

The Route 53 console supports keyboard shortcuts for faster navigation and common actions.

| Shortcut | Action |
|---|---|
| `?` | Open keyboard shortcuts help |
| `/` | Focus the current page's search field |
| `Esc` | Close the currently open modal |
| `n` | Create a new item |
| `g` → `h` | Go to Hosted Zones |
| `g` → `d` | Go to Dashboard |
| `g` → `r` | Go to Resolver |
| `g` → `t` | Go to Traffic Policies |

#### Context-aware Create Shortcut

The `n` shortcut adapts to the current page:

- Inside a hosted zone, `n` opens the **Create Record** form.

Shortcuts are disabled while typing inside text inputs, textareas, selects, or editable fields to avoid interfering with normal typing.

### Theme / Visual Mode

The console supports both **Light Mode** and **Dark Mode**, with the theme preference persisted across sessions.

To change the visual mode:

1. Log in using the demo account:
   - **Username:** `admin`
   - **Password:** `admin123`
  
2. Click the **Admin** account menu in the top-right corner of the console.
3. Open the **Visual Mode / Theme** option.
4. Select either:
   - **Light Mode**
   - **Dark Mode**
5. The selected mode is applied immediately and saved in the browser, so it remains active when you return to the application.

The dark mode is designed to follow the AWS Management Console visual style, including dark navigation, pages, tables, forms, modals, and other console components.

## How to Use the Application

This project is a working clone of the AWS Route 53 console. You can use it to create and manage Hosted Zones and DNS Records through a simple web interface.

### 1. Open the Application

Open the deployed application in your browser:

**https://aws-route53-clone-alpha.vercel.app/**

You will first see the login page.

### 2. Login

Use the demo account:

- **Username:** `admin`
- **Password:** `admin123`

After logging in, you will be taken to the Route 53 console.

### 3. Explore Hosted Zones

From the sidebar, open **Hosted Zones**.

Here you can:

- View all hosted zones
- Search for a hosted zone
- Filter between Public and Private zones
- Create a new hosted zone
- Edit an existing hosted zone
- Delete a hosted zone
- Select multiple zones when needed

Click **Create Hosted Zone** to add a new zone. Enter the zone name, choose whether it is Public or Private, and optionally add a comment.

### 4. Manage DNS Records

Click on any hosted zone to open it.

Inside the zone, you can:

- View DNS records
- Search records by name, type, or value
- Filter records by record type
- Create new DNS records
- Edit existing records
- Delete records
- Select multiple records and delete them together

The application supports:

`A`, `AAAA`, `CNAME`, `TXT`, `MX`, `NS`, `PTR`, `SRV`, and `CAA` records.

### 5. Export Records

Inside a hosted zone, click **Export JSON** to export the hosted zone and its DNS records as a JSON file.

### 6. Keyboard Shortcuts

The application also supports some keyboard shortcuts:

- `G` → `H` → Hosted Zones
- `G` → `D` → Dashboard
- `G` → `R` → Resolver
- `G` → `T` → Traffic Policies
- `C` → Create a new item on the current page

### 7. Dark Mode

Use the theme option in the top navigation bar to switch between light and dark mode.

### 8. Important Note

This is a **Route 53 UI and management clone for demonstration purposes**.

It does not perform real DNS operations or modify actual AWS Route 53 resources. All hosted zones and DNS records are stored in the project's SQLite database and are managed through the FastAPI backend.


## Running Locally

If you want to run the project on your own computer, you need Node.js and Python installed.

### Start the Backend and frontend 

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

cd frontend
npm install
npm run dev 

