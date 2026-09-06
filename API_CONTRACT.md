# Bizflow API Contract

This document summarizes the current backend contract for frontend integration. It is based on the NestJS controllers, DTOs, and service responses currently in the repository.

## Base URL

- Local dev: `http://localhost:3000/api/v1`
- The app sets a global prefix of `/api` and enables URI versioning with default version `1`, so endpoints are effectively under `/api/v1/...`.

## Authentication

### Access token

- Header: `Authorization: Bearer <accessToken>`
- Used for protected routes in `JwtAuthGuard` protected endpoints.

### Refresh token

- Cookie-based auth via `refresh-token` cookie.
- The app uses `ApiCookieAuth('refresh-token')` for refresh/logout flows.
- Refresh endpoints are guarded by `RefreshTokenGuard`.

### Authenticated user shape

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Jane Doe",
  "role": "OWNER | ADMIN | STAFF",
  "businessId": "uuid | null"
}
```

## Common response patterns

### Successful auth response

```json
{
  "accessToken": "jwt-string",
  "refreshToken": "opaque-refresh-token",
  "user": {
    "id": "uuid",
    "businessId": "uuid | null",
    "role": "OWNER | ADMIN | STAFF"
  }
}
```

### Generic success response

```json
{
  "success": true
}
```

### Two-factor challenge response

```json
{
  "twoFactorRequired": true,
  "userId": "uuid"
}
```

### Error responses

NestJS will return standard HTTP error payloads, typically shaped like:

```json
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized"
}
```

---

# Endpoints

## 1) Authentication

### POST /auth/register

Create a new owner account.

Request body:

```json
{
  "name": "Ada Lovelace",
  "email": "owner@acme.test",
  "password": "SecurePass1!"
}
```

Validation:

- `name`: optional, 2-80 chars
- `email`: valid email
- `password`: strong password (`minLength: 8`, uppercase + number + symbol required)

Success response:

```json
{
  "accessToken": "jwt-string",
  "refreshToken": "opaque-refresh-token",
  "user": {
    "id": "uuid",
    "businessId": null,
    "role": "OWNER"
  }
}
```

---

### POST /auth/register-business

Alias for registration flow; currently calls the same service as `register`.

Request body: same as `register`.

---

### POST /auth/login

Login with email/password. Requires `LocalAuthGuard`.

Request body:

```json
{
  "email": "owner@acme.test",
  "password": "SecurePass1!",
  "twoFactorCode": "123456"
}
```

Notes:

- `twoFactorCode` is optional.
- If 2FA is enabled and no code is supplied, the server responds with:

```json
{
  "twoFactorRequired": true,
  "userId": "uuid"
}
```

Success response: same as `register`.

---

### POST /auth/social/google

Social login via Google ID token.

Request body:

```json
{
  "idToken": "google-identity-token",
  "businessName": "Acme Ltd",
  "name": "Jane Doe",
  "twoFactorCode": "123456"
}
```

Notes:

- `idToken` is required.
- `businessName` and `name` are optional.
- `twoFactorCode` is optional.

Success response: same as `register`.

---

### POST /auth/social/apple

Social login via Apple ID token.

Request body:

```json
{
  "idToken": "apple-identity-token",
  "businessName": "Acme Ltd",
  "name": "Jane Doe",
  "twoFactorCode": "123456"
}
```

Success response: same as `register`.

---

### POST /auth/2fa/enable

Enable TOTP 2FA for the current user. Requires bearer token.

Auth: `Bearer <accessToken>`

Success response:

```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCodeDataUrl": "data:image/png;base64,...",
  "issuer": "Bizflow",
  "account": "user@example.com"
}
```

---

### POST /auth/2fa/verify

Verify the TOTP code after enabling 2FA. Requires bearer token.

Request body:

```json
{
  "code": "123456"
}
```

Success response:

```json
{
  "success": true,
  "enabled": true
}
```

---

### POST /auth/2fa/disable

Disable TOTP 2FA for the current user. Requires bearer token.

Request body:

```json
{
  "code": "123456"
}
```

Success response:

```json
{
  "success": true,
  "enabled": false
}
```

---

### POST /auth/2fa/validate

Validate a TOTP code without changing state. Requires bearer token.

Request body:

```json
{
  "code": "123456"
}
```

Success response:

```json
{
  "success": true,
  "valid": true
}
```

---

### POST /auth/refresh

Refresh access token using refresh token cookie.

Auth: cookie `refreshToken` (guarded by `RefreshTokenGuard`)

Success response: same as auth success response, with a fresh `accessToken` and `refreshToken`.

Notes:

- The route also rotates the session and issues new tokens.
- There is a second route alias: `POST /auth/refresh-token` with the same behavior.

---

### POST /auth/logout

Logout current session by invalidating the active refresh token.

Auth: cookie `refreshToken`

Success response:

```json
{
  "success": true
}
```

---

### GET /auth/me

Fetch the current user's public profile. Requires bearer token.

Auth: `Bearer <accessToken>`

Success response:

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Jane Doe",
  "role": "OWNER",
  "business": {
    "id": "uuid",
    "name": "Acme Ltd",
    "type": "Retail"
  }
}
```

---

### POST /auth/verify-email

Verify a user account using an email verification token.

Request body:

```json
{
  "token": "verification-token"
}
```

Success response:

```json
{
  "success": true
}
```

---

### POST /auth/resend-verification

Resend email verification.

Request body:

```json
{
  "email": "owner@acme.test"
}
```

Success response:

```json
{
  "success": true,
  "verificationToken": "token"
}
```

---

### POST /auth/forgot-password

Trigger password reset flow.

Request body:

```json
{
  "email": "owner@acme.test"
}
```

Success response:

```json
{
  "success": true,
  "resetToken": "token"
}
```

Notes:

- The request returns success even if the email is not registered.

---

### POST /auth/reset-password

Reset password using a reset token.

Request body:

```json
{
  "token": "reset-token",
  "password": "NewSecurePass1!"
}
```

Success response:

```json
{
  "success": true
}
```

---

### PATCH /auth/change-password

Change the current user’s password. Requires bearer token.

Auth: `Bearer <accessToken>`

Request body:

```json
{
  "currentPassword": "CurrentPass1!",
  "newPassword": "NewSecurePass1!"
}
```

Success response:

```json
{
  "success": true
}
```

Notes:

- Other active sessions except the current session are revoked.

---

### POST /auth/invite

Invite a user to the current business. Requires owner/admin access.

Auth: `Bearer <accessToken>`

Request body:

```json
{
  "email": "staff@acme.test",
  "role": "ADMIN"
}
```

Accepted role values:

- `ADMIN`
- `STAFF`

Success response:

```json
{
  "id": "uuid",
  "email": "staff@acme.test",
  "role": "ADMIN",
  "inviteToken": "invite-token",
  "expiresAt": "2026-10-01T00:00:00.000Z"
}
```

---

### POST /auth/accept-invite

Accept an invitation and create the invited user account.

Request body:

```json
{
  "token": "invitation-token",
  "password": "SecurePass1!",
  "name": "Jane Doe"
}
```

Success response: same as auth success response.

---

### GET /auth/invites

List pending invites for the current business. Requires bearer token and owner/admin access.

Success response:

```json
[
  {
    "id": "uuid",
    "email": "staff@acme.test",
    "role": "ADMIN",
    "expiresAt": "2026-10-01T00:00:00.000Z",
    "createdAt": "2026-09-02T00:00:00.000Z"
  }
]
```

---

### DELETE /auth/invites/:id

Revoke a pending invite.

Auth: `Bearer <accessToken>`

Success response:

```json
{
  "success": true
}
```

---

### GET /auth/sessions

List active sessions for the current user.

Auth: `Bearer <accessToken>`

Success response:

```json
[
  {
    "id": "uuid",
    "userAgent": "Mozilla/5.0 ...",
    "ipAddress": "127.0.0.1",
    "expiresAt": "2027-09-02T00:00:00.000Z",
    "createdAt": "2026-09-02T00:00:00.000Z"
  }
]
```

---

### DELETE /auth/sessions/:id

Revoke one active session for the current user.

Success response:

```json
{
  "count": 1,
  "status": "success"
}
```

Notes:

- The Prisma updateMany call returns a bulk update summary; the server does not wrap it in a custom object.

---

### DELETE /auth/sessions

Revoke all active sessions for the current user.

Success response:

```json
{
  "count": 1,
  "status": "success"
}
```

---

## 2) Businesses

### POST /businesses/onboarding

Complete business onboarding for the current user. Requires bearer token.

Auth: `Bearer <accessToken>`

Request body:

```json
{
  "businessName": "Acme Ltd",
  "type": "Retail",
  "streetAddress": "12 Marina Road",
  "city": "Lagos",
  "country": "Nigeria",
  "teamSize": "1-5",
  "primaryService": "Digital services",
  "taxId": "NG-12345"
}
```

Validation:

- `businessName`: 2-120 chars
- `type`: 2-80 chars
- `streetAddress`: 2-160 chars
- `city`: 2-80 chars
- `country`: 2-80 chars
- `teamSize`: 1-40 chars
- `primaryService`: 2-120 chars
- `taxId`: optional

Success response: backend service response shape is not yet exposed in controller-level DTOs; treat as implementation-defined until endpoint contracts are finalized.

---

## 3) System

### GET /

System health/base route.

Response:

```json
"Hello World!"
```

This is the app root and not the main consumer-facing endpoint.

---

# Security notes

- Access token: JWT bearer token.
- Refresh token: cookie named `refreshToken`.
- Protected endpoints require a valid bearer token unless specifically using refresh-token cookie routes.
- Passwords require strong password policy:
  - minimum 8 chars
  - at least 1 uppercase
  - at least 1 number
  - at least 1 symbol

# Frontend integration guidance

1. Prefer the base URL `http://localhost:3000/api/v1` during local development.
2. Store `accessToken` in memory or secure storage and send it as `Authorization: Bearer ...`.
3. Keep refresh token handling cookie-driven unless your frontend intentionally proxies the cookie manually.
4. If a login or social auth response includes `twoFactorRequired`, prompt the user for the 2FA code and retry the same endpoint.
5. For onboarding, complete the business setup before invoking business-scoped endpoints.

# Known caveat

The backend has multiple extension controller stubs under `src/extensions/_extensions/*`, but they currently do not expose concrete user-facing routes in the active codebase. The valid contract in this repo is therefore dominated by the `auth` and `businesses` controllers.
