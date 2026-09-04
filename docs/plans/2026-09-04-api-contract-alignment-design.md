# ITSM Web API Contract Alignment Design Document

**Date:** 2026-09-04  
**Project:** itsm-web  
**Status:** Approved  
**Blueprint Reference:** `spec-vault/blueprint/dev-guidelines/api-contract.md` & `frontend.md`

---

## 1. Overview & Objective

Adapt `itsm-web` to 100% align with `itsm-backend` v2 (Express 5 + Drizzle ORM + MySQL 8). This eliminates legacy Express 4 + MongoDB patterns, aligns endpoints under `/api/v1/`, adheres to the standard response envelope (`{ data, meta, message, errors }`), normalizes enums and numeric IDs, and retires legacy direct Axios calls in favor of feature-scoped TanStack Query hooks.

---

## 2. Technology Stack & Dependencies

| Category | Technology |
| :--- | :--- |
| **Framework & Language** | React 18, TypeScript (strict mode) |
| **Build Tool** | Vite |
| **Routing** | React Router v6 (`createBrowserRouter`) |
| **Server State & Cache** | TanStack Query v5 |
| **Client State** | Zustand (`authStore`, `uiStore`) |
| **HTTP Client** | Axios (`src/lib/api-client.ts`) |
| **Form Management** | React Hook Form + Zod |
| **UI Components** | Radix UI primitives / Shadcn UI + Tailwind CSS |
| **Notifications** | Sonner |
| **Real-time** | Socket.IO client (`socket.io-client`) |

---

## 3. Architecture & API Client Specification

### 3.1 Environment Configuration
* `VITE_API_URL`: `http://localhost:5000/api/v1` (explicit version prefix, no trailing slash).
* `VITE_SOCKET_URL`: `http://localhost:5000`.

### 3.2 Centralized Axios Client (`src/lib/api-client.ts`)
* Request Interceptor:
  * Injects `Authorization: Bearer <token>` from persisted `useAuthStore`.
* Response Interceptor:
  * `401 Unauthorized`: Clears auth state and redirects to `/auth/login`.
  * `403 Forbidden`, `429 Too Many Requests`, `500 Server Error`: Emits toast alerts with `payload.message`.
  * `422 Unprocessable Entity`: Retains validation error details `{ message, errors }` for form handlers.
* Legacy Bridge & Retirement:
  * Re-route `src/hooks/use-api.tsx` to delegate through `api-client.ts` while legacy references are migrated.

---

## 4. Domain Models & Endpoint Contracts

### 4.1 Auth & Users Domain
* **User Roles:** `'admin' | 'service_engineer' | 'staff' | 'user'`.
* **User Entity:** `id: number`, `username: string`, `email: string`, `firstName: string`, `middleName?: string`, `lastName: string`, `extensionName?: string`, `contactNo?: string`, `avatar?: string`, `role: UserRole`, `isActive: boolean`.
* **Endpoints:**
  * `POST /auth/login`: `{ identifier, password }` → `{ data: { token, user } }`.
  * `GET /auth/me`: Header `Bearer <token>` → `{ data: User }`.
  * `DELETE /auth/logout`: Revokes token session.
  * `GET /users`: Params `{ page, limit, search, role, isActive }` → `PaginatedResponse<User>`.
  * `POST /users`: Admin creates user account with temporary password.
  * `GET /users/:id`: Single user detail.
  * `PUT /users/:id`: Updates user fields (excluding password).
  * `PATCH /users/:id/status`: `{ isActive: boolean }`.
  * `DELETE /users/:id`: Deactivates/removes user.

### 4.2 Service Tickets Domain
* **Enums:**
  * `serviceStatus`: `'open' | 'in_progress' | 'resolved' | 'closed' | 'cancelled'`.
  * `priority`: `'low' | 'medium' | 'high' | 'urgent'`.
  * `rating`: `1 | 2 | 3 | 4 | 5` (numeric tinyint).
* **Entity:** `id: number`, `ticketNo: string`, `taskType: string`, `title: string`, `natureOfWork?: string`, `serialNo?: string`, `equipmentType?: string`, `equipmentTypeOthers?: string`, `defectsFound?: string`, `serviceRendered?: string`, `serviceStatus`, `priority`, `remarks?: string`, `adminRemarks?: string`, `rating?: number`, `ratingComment?: string`, `clientId?: number`, `serviceEngineerId?: number`, `createdById?: number`, `updatedById?: number`, `histories?: ServiceTicketHistory[]`.
* **Endpoints:**
  * `GET /service-tickets`: Params `{ page, limit, search, serviceStatus, priority, clientId, serviceEngineerId }`.
  * `POST /service-tickets`: Creates ticket with atomic counter (e.g. `ST-202609-0001`).
  * `GET /service-tickets/:id`: Returns ticket with embedded `histories: ServiceTicketHistory[]`.
  * `PUT /service-tickets/:id`: Full ticket update.
  * `PATCH /service-tickets/:id/status`: `{ serviceStatus, notes? }`.
  * `PATCH /service-tickets/:id/assign`: `{ serviceEngineerId, notes? }`.
  * `POST /service-tickets/:id/feedback`: `{ rating: 1..5, ratingComment? }`.

### 4.3 Clients Domain
* **Entity:** `id: number`, `firstName: string`, `middleName?: string`, `lastName: string`, `extensionName?: string`, `email?: string`, `contactNo?: string`, `officeId?: number`, `designationId?: number`, `userId?: number`.
* **Endpoints:**
  * `GET /clients`: Params `{ page, limit, search, email, officeId, designationId, userId }`.
  * `POST /clients`: Creates client with auto-uppercase names, linking to `users` if email matches.
  * `GET /clients/:id`, `PUT /clients/:id`, `DELETE /clients/:id`.

### 4.4 Reference Data: Offices & Designations
* **Offices:** `id: number`, `name: string`, `code: string` (replacing legacy `alias`). `GET /offices` returns `{ data: Office[] }`.
* **Designations:** `id: number`, `name: string` (replacing legacy `title`). `GET /designations` returns `{ data: Designation[] }`.

### 4.5 Notifications Domain
* `GET /notifications`: Params `{ page, limit }` (derives user identity from JWT).
* `PATCH /notifications/:id/read`: Mark single notification read.
* `PATCH /notifications/read-all`: Mark all notifications for user read.

---

## 5. UI Components & Pages Migration

1. **Comboboxes:**
   * `OfficeComboBox`: Read `office.id` and `office.code`, extracting array from `response.data.data`.
   * `DesignationComboBox`: Read `designation.id` and `designation.name`, extracting array from `response.data.data`.
   * `UserComboBox`: Filter by `role=service_engineer&search=...` using numeric IDs.
   * `ClientComboBox`: Filter by `search=...` using numeric IDs.
2. **Data Tables:**
   * In `AdminITServiceTicketsPage`, `AdminClientsPage`, and `AdminUsersPage`, map TanStack Table pagination:
     * `rows = response.data.data`
     * `pageCount = response.data.meta.last_page`
     * `rowCount = response.data.meta.total`
3. **Ticket Detail & Dialogs:**
   * Display embedded `histories` from ticket detail.
   * Wire `AssignServiceEngineerDialog` to `PATCH /service-tickets/:id/assign`.
   * Wire status/close/escalate dialogs to `PATCH /service-tickets/:id/status`.
4. **Forms:**
   * Cast relational IDs to numbers (`clientId`, `serviceEngineerId`, `officeId`, `designationId`).
5. **Real-Time Integration:**
   * Connect `socket.io-client` on port 5000, join `user:<id>` room, and invalidate queries on `"notification:new"`.

---

## 6. Verification & Quality Gates

* Run full TypeScript build (`tsc -b && vite build`) with zero type errors.
* Validate all primary flows against running `itsm-backend` v2.
