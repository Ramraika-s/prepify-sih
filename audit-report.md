# Prepify Codebase Audit Report

## Phase 1: Technical & Security Audit (Bugs)

### 🔴 High Priority
1. **RBAC Security Vulnerability (`middleware.ts`)**
   - **Issue:** The middleware relies on `user.user_metadata?.role` to determine Role-Based Access Control (RBAC). 
   - **Risk:** `user_metadata` can be arbitrarily modified by a user on the client-side if they have the anon key. A malicious user could update their metadata to `{ "role": "admin" }` and bypass middleware protections.
   - **Fix:** Enforce roles using a secure, read-only `user_roles` table in Supabase or use custom JWT claims handled by an admin backend.

2. **Insecure Auth Checks (`app/actions/user.ts`)**
   - **Issue:** The `completeOnboarding` server action uses `supabase.auth.getSession()` to verify authentication.
   - **Risk:** As per Supabase best practices, `getSession()` does not actively verify the JWT signature and can be spoofed. 
   - **Fix:** Always use `supabase.auth.getUser()` for secure, server-side authentication checks.

3. **Missing Input Validation & Privilege Escalation Risk (`app/actions/auth.ts`)**
   - **Issue:** The `signUp` action accepts `payload: any` and destructures `role, ...metadata`. It then inserts this directly into `user_metadata`.
   - **Risk:** Because there is no `Zod` validation, an attacker could inject unintended metadata fields or override critical system flags during registration.

### 🟡 Medium Priority
1. **Broken Auth Redirects (`app/actions/auth.ts`)**
   - **Issue:** The `signOutAndRedirect` and `deleteAccountAction` functions redirect the user to `/auth`.
   - **Risk:** There is no `/auth` route in the application (the correct routes are `/sign-in` and `/sign-up`). This will result in a 404 Not Found error upon sign-out.

2. **Lack of Graceful Error Handling (Server Actions)**
   - **Issue:** Most Server Actions lack `try/catch` blocks. 
   - **Risk:** If Supabase is down or a network error occurs, the server action will throw an unhandled exception, causing a 500 error on the frontend rather than returning a structured `{ error: "message" }` object.

### 🟢 Low Priority
1. **Unused / Extraneous Parameters**
   - **Issue:** The `deleteAccountAction` calls a Supabase RPC function (`delete_my_account`) without explicitly verifying the user context first via `getUser()`. While the cookies enforce the session context, explicitly checking for a user adds a layer of defense-in-depth.

---

## Phase 2: UI/UX & Routing Audit

### Architectural Anti-Patterns
1. **Missing Global Error Boundaries & 404 Pages**
   - **Issue:** The `app/` directory completely lacks `error.tsx` and `not-found.tsx` files.
   - **Impact:** Any unhandled exception in a Server Component will crash the React tree and show the default Next.js error overlay to users, degrading the premium UX.

2. **Missing Suspense/Loading States**
   - **Issue:** There are no `loading.tsx` files defined for the heavily nested dashboard layouts.
   - **Impact:** Users will experience hanging navigations instead of immediate, skeleton-based feedback as per frontend development guidelines.

3. **Placeholder & Dead Links (`components/layout/Footer.tsx`)**
   - **Issue:** The footer contains multiple dead links (`href="/"`) for critical pages such as "About Us", "Privacy Policy", and "Careers". Social media links use `href="#"`.

4. **Inconsistent API Layering**
   - **Issue:** Following the `backend-dev-guidelines`, database queries should be abstracted into a repository pattern. Currently, direct Supabase calls (e.g., `.from("user_preferences").upsert()`) are hardcoded directly inside Next.js Server Actions.

---

## Phase 3: Execution Plan

To bring the codebase up to enterprise standards, execute the following steps in order:

### Step 1: Secure the Authentication Flow (Backend)
- Refactor `app/actions/auth.ts` and `app/actions/user.ts` to use `zod` for strict payload validation.
- Replace all instances of `getSession()` with `getUser()` in Server Actions.
- Update `middleware.ts` to rely on a secure role-check (e.g., querying a `profiles` or `user_roles` table) rather than `user_metadata`.

### Step 2: Fix Routing and Navigation (Frontend)
- Update the redirect paths in `app/actions/auth.ts` from `/auth` to `/sign-in`.
- Purge or update the dead `href="/"` and `href="#"` links in `Footer.tsx`.

### Step 3: Implement Error Boundaries (Architecture)
- Create a global `app/error.tsx` and `app/not-found.tsx`.
- Create `loading.tsx` skeletons for `/dashboard/student`, `/dashboard/mentor`, `/dashboard/institute`, and `/dashboard/admin` layouts to handle Suspense gracefully.

### Step 4: Scaffold Missing Routes (Features)
- Create the missing dashboard pages and legal pages outlined in `to-be-done.md`.
