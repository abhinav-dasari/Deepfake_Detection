# 🧪 Postman API Testing Guide — Deepfake Detection Backend

**Base URL:** `http://127.0.0.1:8000`

---

## Your Existing Users

| Username | 
|---|
| abhinav.dasari |
| abhinav |
| abhi |
| abhi1, abhi2, abhi3 |
| admin |

> [!NOTE]
> Usernames are **case-sensitive**. Use `abhinav`, not `Abhinav`.

---

## 1️⃣ Register a New User

| Setting | Value |
|---|---|
| **Method** | `POST` |
| **URL** | `http://127.0.0.1:8000/api/auth/register/` |
| **Headers** | `Content-Type: application/json` |

**Body → raw → JSON:**
```json
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "StrongPass123!"
}
```

**Expected Response (201):**
```json
{
    "message": "User created successfully"
}
```

---

## 2️⃣ Login (Get JWT Token)

| Setting | Value |
|---|---|
| **Method** | `POST` |
| **URL** | `http://127.0.0.1:8000/api/auth/login/` |
| **Headers** | `Content-Type: application/json` |

**Body → raw → JSON:**
```json
{
    "username": "abhinav",
    "password": "YOUR_PASSWORD_HERE"
}
```

**Expected Response (200):**
```json
{
    "refresh": "eyJhbGciOi...(long token)...",
    "access": "eyJhbGciOi...(long token)..."
}
```

> [!IMPORTANT]
> **Copy the `access` token!** You'll need it for all authenticated endpoints (Upload & History).
> The access token expires after some time. Use the refresh endpoint to get a new one.

---

## 3️⃣ Refresh Token

| Setting | Value |
|---|---|
| **Method** | `POST` |
| **URL** | `http://127.0.0.1:8000/api/auth/refresh/` |
| **Headers** | `Content-Type: application/json` |

**Body → raw → JSON:**
```json
{
    "refresh": "PASTE_YOUR_REFRESH_TOKEN_HERE"
}
```

**Expected Response (200):**
```json
{
    "access": "eyJhbGciOi...(new access token)..."
}
```

---

## 4️⃣ Upload Image for Detection (Authenticated)

| Setting | Value |
|---|---|
| **Method** | `POST` |
| **URL** | `http://127.0.0.1:8000/api/detect/upload/` |
| **Headers** | `Authorization: Bearer <YOUR_ACCESS_TOKEN>` |

> [!WARNING]
> Do **NOT** set `Content-Type` manually for this request. Postman sets it automatically to `multipart/form-data` when you use form-data body.

**Body → form-data:**

| Key | Type | Value |
|---|---|---|
| `image` | **File** | *(select an image file from your computer)* |

### How to set it up in Postman:
1. Go to **Body** tab
2. Select **form-data**
3. In the Key field, type `image`
4. Change the key type dropdown from **Text** to **File** (hover over the Key field to see the dropdown)
5. Click **Select Files** and pick an image

**Expected Response (201):**
```json
{
    "id": 1,
    "image": "http://127.0.0.1:8000/media/detections/your_image.jpg",
    "prediction": "Real",
    "confidence": 0.95,
    "created_at": "2026-05-18T21:43:00Z"
}
```

---

## 5️⃣ Get Detection History (Authenticated)

| Setting | Value |
|---|---|
| **Method** | `GET` |
| **URL** | `http://127.0.0.1:8000/api/detect/history/` |
| **Headers** | `Authorization: Bearer <YOUR_ACCESS_TOKEN>` |

**No body needed.**

**Expected Response (200):**
```json
[
    {
        "id": 1,
        "image": "http://127.0.0.1:8000/media/detections/image1.jpg",
        "prediction": "Fake",
        "confidence": 0.87,
        "created_at": "2026-05-18T21:43:00Z"
    }
]
```

---

## 🔑 Setting Up Authorization in Postman (Step-by-Step)

### Option A: Manual Header (per request)
1. Go to the **Headers** tab of your request
2. Add a new header:
   - **Key:** `Authorization`
   - **Value:** `Bearer eyJhbGciOi...YOUR_TOKEN_HERE`

### Option B: Using Postman's Auth Tab (recommended)
1. Go to the **Authorization** tab of your request
2. Select **Type** → `Bearer Token`
3. Paste your access token in the **Token** field
4. Postman will automatically add the header for you

### Option C: Collection-Level Variable (best for multiple requests)
1. Create a **Collection** in Postman (e.g., "Deepfake API")
2. Add all requests to this collection
3. Go to Collection → **Variables** tab → add variable `token`
4. Go to Collection → **Authorization** tab → set Type to `Bearer Token` → set Token to `{{token}}`
5. After login, copy the access token and update the `token` variable value
6. All requests in the collection will automatically inherit this token

---

## 📋 Quick Reference Table

| # | Endpoint | Method | Auth? | Body Type |
|---|---|---|---|---|
| 1 | `/api/auth/register/` | POST | ❌ No | JSON |
| 2 | `/api/auth/login/` | POST | ❌ No | JSON |
| 3 | `/api/auth/refresh/` | POST | ❌ No | JSON |
| 4 | `/api/detect/upload/` | POST | ✅ Yes (Bearer) | form-data (file) |
| 5 | `/api/detect/history/` | GET | ✅ Yes (Bearer) | None |

---

## ⚠️ Common Errors

| Error | Cause | Fix |
|---|---|---|
| `401 Unauthorized` | Missing or expired token | Login again and use the new access token |
| `400 Bad Request` | Missing required fields | Check the body format |
| `403 Forbidden` | Invalid token | Make sure you're using `Bearer <token>` (with space) |
| `404 Not Found` | Wrong URL | Make sure URL ends with `/` (trailing slash!) |
| `415 Unsupported Media Type` | Wrong Content-Type for upload | Don't set Content-Type manually for file uploads |
