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