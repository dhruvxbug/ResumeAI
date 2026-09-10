# Backend Architecture & Implementation Report

This document provides a detailed overview of the PHP backend implemented for the **ResumeAI** application. The backend is designed to handle secure user authentication and act as the bridge between the Next.js frontend and the Google Gemini AI.

## 1. Technology Stack
- **Framework:** Laravel 11/12 (PHP 8.5)
- **Database:** SQLite (Zero-configuration, lightweight relational database)
- **Authentication:** Laravel Sanctum (Token-based API authentication)
- **AI Provider:** Google Gemini API (REST HTTP integration)

## 2. Directory Structure Overview
The backend is completely decoupled from the Next.js frontend and resides in the `backend/` directory. Key files include:

```text
backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── AuthController.php      # Handles Login, Register, Logout
│   │   └── ResumeAiController.php  # Handles Gemini API communication
│   ├── Models/
│   │   └── User.php                # Uses Sanctum's HasApiTokens trait
├── database/
│   └── database.sqlite             # The SQLite database file
├── routes/
│   └── api.php                     # Defines all REST API endpoints
└── .env                            # Environment variables (DB config, Gemini Key)
```

## 3. Authentication Implementation
The authentication is managed by **Laravel Sanctum**.

- **Registration (`POST /api/auth/register`)**: Validates the user's name, email, and password. The password is securely hashed using `bcrypt` (via Laravel's `Hash` facade) before saving to the database. Upon success, a Sanctum Personal Access Token is generated and returned.
- **Login (`POST /api/auth/login`)**: Checks the provided email and verifies the password hash. If valid, a new token is issued.
- **Logout (`POST /api/auth/logout`)**: Protected by the `auth:sanctum` middleware. It revokes the current user's access token, logging them out safely.
- **Frontend Integration**: The Next.js app receives the token (e.g., `1|abcdef...`) and stores it in `localStorage`. This token must be sent in the `Authorization: Bearer <token>` header for subsequent authenticated requests.

## 4. AI Integration Logic
The AI capabilities are powered by the **Google Gemini API** (`gemini-1.5-flash`), accessed via Laravel's built-in HTTP Client (`Illuminate\Support\Facades\Http`).

- **Generate Resume (`POST /api/resume/generate`)**:
  - **Inputs:** `role` (string), `experience` (string), `skills` (array).
  - **Logic:** The controller formats these inputs into a structured prompt instructing the LLM to act as an expert resume writer. It strictly requests a JSON response containing a `summary` and `experience_bullets`.
  - **Output:** The raw text response from Gemini is decoded from JSON and returned directly to the frontend.

- **Rate Resume (`POST /api/resume/rate`)**:
  - **Inputs:** `resume_text` (string).
  - **Logic:** The controller prompts the LLM to act as an Applicant Tracking System (ATS). It evaluates the provided text and generates a numeric `score` out of 100, along with an array of actionable `feedback` strings.

## 5. Security & Best Practices
- **API Keys:** The Gemini API key is stored securely in the `.env` file (`GEMINI_API_KEY`) and is never exposed to the client-side Next.js app.
- **Validation:** All incoming HTTP requests are strictly validated using Laravel's `$request->validate()` to prevent injection and ensure data integrity.
- **Statelessness:** The API uses tokens rather than session cookies, ensuring the backend remains completely stateless, which is ideal for decoupling with a Next.js frontend.

## 6. Running the Backend
1. Ensure PHP and Composer are installed.
2. Navigate to the `backend/` directory.
3. Ensure `.env` is configured with `GEMINI_API_KEY=your_api_key`.
4. Run `php artisan serve` to start the server on `http://localhost:8000`.
