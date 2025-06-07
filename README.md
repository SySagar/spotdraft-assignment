# PDF Collaboration App

PDF Collab is a collaborative document management platform that allows users to securely upload, preview, and comment on PDFs. It supports role-based access, shareable invite links, and real-time collaboration with rich-text comment threads—ideal for review workflows and team feedback.

# API Documentation

## 🔐 Auth APIs

### Login
```http
POST /auth/login
```
```json
{
    "email": "user@example.com",
    "password": "securepassword"
}
```

### Signup
```http
POST /auth/signup
```
```json
{
    "name": "User Name",
    "email": "user@example.com",
    "password": "securepassword"
}
```

### Verify Token
```http
GET /auth/verify
Authorization: Bearer <token>
```

## 📄 PDF Upload & Listing

### Upload PDF
```http
POST /pdf/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData: pdfs[] = <File>
```

### List PDFs
```http
GET /pdf/list
Authorization: Bearer <token>
```

### Get Presigned URL
```http
GET /pdf/:id/presigned-url
Authorization: Bearer <token>
```

## 🤝 Sharing & Invitation

### Share PDF
```http
POST /pdf/:id/share
Authorization: Bearer <token>
```
```json
{
    "email": "sysagar@example.com"
}
```

### Access Share Link
```http
GET /share/:token
# Optional Query Param (if user is logged in): 
GET /share/:token?accessToken=<JWT>
```
**Response:** `{ allowCommenting: true/false, comments: [...], fileUrl, ... }`

## 💬 Comments

### Add Comment
```http
POST /pdf/:id/comment
Authorization: Bearer <token>
```
```json
{
    "content": "<tiptap format comment>"
}
```

### Get PDF with Comments
```http
GET /pdf/:id
Authorization: Bearer <token>
```
**Response:** `{ comments: [...], ... }`

## 👥 Users API (Admin)

### List Users
```http
GET /users
Authorization: Bearer <token>
```
**Response:** `{ user: [...]}`

### Sidebar Counts
```http
GET /sidebar-counts
Authorization: Bearer <token>
```
**Response:** `{ count: [user:number]}`

## 🏪 Zustand State

- **`userStore`**: stores authenticated user object
- **`sidebarStore`**: stores sidebar tab active state

## ⚠️ Edge Cases to Handle

1. **Only PDF files pushed**: Frontend and backend side validation for only PDF files
2. **Multiple tabs with Zustand**: User state is not shared unless persisted using `localStorage` or cookies
3. **PDF file is empty or fails to upload**: Validate size and content server-side
4. **User invites same email twice**: Block in backend (already handled)
5. **Token expired or invalid in share link**: Return 404 and show "Invalid or expired link"
6. **Public viewer tries to comment**: Prevent based on `allowCommenting` flag
7. **PDF viewer broken URL or corrupt file**: Show error or "Cannot render document"
8. **User logs out on another tab**: Auth state synced with localStorage
9. **Multiple invites sent**: Avoid spam, optionally add cooldown
10. **Email invite delivery failure**: Log & handle via async mail job via resend
11. **Comment editor cleared on Submit**: Ensure no loss of input during async operation

## Future solutions:
1. Cron job to schedule cleanup of invalid or expired link
2. Role based access request for PDFS
3. Edit user lie remove or edit
