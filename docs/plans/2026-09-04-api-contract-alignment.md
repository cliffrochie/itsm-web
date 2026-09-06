# ITSM Web API Contract Alignment Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Fully align `itsm-web` with `itsm-backend` v2 (Express 5, Drizzle ORM, MySQL 8) by migrating endpoints, envelope structures, schemas, comboboxes, forms, and tables.

**Architecture:** Bulletproof React architecture using centralized Axios `src/lib/api-client.ts`, domain-scoped TanStack Query hooks in `src/features/**`, strictly typed DTOs conforming to backend v2 response envelopes, and real-time Socket.IO synchronization.

**Tech Stack:** React 18, TypeScript, Vite, TanStack Query v5, React Hook Form, Zod, Zustand, Axios, Socket.IO client, Sonner, Tailwind CSS.

---

### Task 1: Environment & API Client Realignment

**Files:**
- Modify: `src/config/env.ts`
- Modify: `.env.example`
- Modify: `src/lib/api-client.ts`
- Modify: `src/hooks/use-api.tsx`

**Step 1: Update environment configuration defaults**
In `src/config/env.ts` and `.env.example`:
Set `API_URL` default to `'http://localhost:5000/api/v1'` (port 5000, versioned `/api/v1` prefix, no trailing slash).
Set `SOCKET_URL` default to `'http://localhost:5000'`.

**Step 2: Update Axios client interceptors**
In `src/lib/api-client.ts`:
- Ensure Bearer token is properly attached from `useAuthStore.getState().token`.
- On 401 error, clear auth and redirect to `/auth/login`.
- Allow 422 errors to reject with `{ message, errors }` intact for form handling.

**Step 3: Route legacy `use-api.tsx` through `api-client.ts`**
In `src/hooks/use-api.tsx`:
Re-export or wrap `api` from `@/lib/api-client` so legacy callers immediately use the updated port and `/api/v1` base URL without duplicate instances.

**Step 4: Verify build**
Run: `npm run build`
Expected: PASS

**Step 5: Commit**
```bash
git add src/config/env.ts .env.example src/lib/api-client.ts src/hooks/use-api.tsx
git commit -m "feat: align environment and api client with v2 backend"
```

---

### Task 2: Auth Domain & User Roles Realignment

**Files:**
- Modify: `src/types/auth.ts`
- Modify: `src/features/auth/schemas/index.ts`
- Modify: `src/features/auth/types/index.ts`
- Modify: `src/features/auth/api/login.ts`
- Modify: `src/features/auth/api/get-current-user.ts`
- Modify: `src/features/auth/api/logout.ts`
- Modify: `src/features/auth/components/LoginForm.tsx`

**Step 1: Update Auth types and schemas**
- In `src/types/auth.ts`: Add `'service_engineer'` to `UserRole`. Set `id: number` on `AuthUser`.
- In `src/features/auth/schemas/index.ts`: Update `loginSchema` field to `identifier: z.string().min(1)`.
- In `src/features/auth/types/index.ts`: Update `LoginCredentials` to `{ identifier: string; password: string }`.

**Step 2: Update Auth API calls**
- In `login.ts`: Call `POST /auth/login` with `{ identifier, password }`. Unpack `response.data.data` to store `{ token, user }`.
- In `get-current-user.ts`: Call `GET /auth/me` with Bearer token. Unpack `response.data.data`.
- In `logout.ts`: Call `DELETE /auth/logout`.
- In `LoginForm.tsx`: Bind form field to `identifier`, handle role redirects (`admin` -> `/admin`, `service_engineer` -> `/service-engineer`, `staff` -> `/service-engineer`, `user` -> `/client`).

**Step 3: Verify build**
Run: `npm run build`
Expected: PASS

**Step 4: Commit**
```bash
git add src/types/auth.ts src/features/auth/
git commit -m "feat: align authentication domain with /api/v1/auth"
```

---

### Task 3: Reference Data Realignment (Offices & Designations)

**Files:**
- Modify: `src/@types/office.ts`
- Modify: `src/@types/designation.ts`
- Modify: `src/features/offices/types/index.ts`
- Modify: `src/features/offices/api/index.ts`
- Modify: `src/features/designations/types/index.ts`
- Modify: `src/features/designations/api/index.ts`
- Modify: `src/components/comboboxes/office-combobox.tsx`
- Modify: `src/components/comboboxes/designation-combobox.tsx`

**Step 1: Update Office & Designation types**
- `Office`: `id: number`, `name: string`, `code: string`.
- `Designation`: `id: number`, `name: string`.

**Step 2: Update API functions**
- In `features/offices/api/index.ts`: `getAll` calls `GET /offices` and returns `response.data.data` (array of `Office`).
- In `features/designations/api/index.ts`: `getAll` calls `GET /designations` and returns `response.data.data` (array of `Designation`).

**Step 3: Update Comboboxes**
- In `office-combobox.tsx`: Consume `useOffices()`, map items to `{ value: String(office.id), label: `${office.code} - ${office.name}` }`.
- In `designation-combobox.tsx`: Consume `useDesignations()`, map items to `{ value: String(designation.id), label: designation.name }`.

**Step 4: Verify build**
Run: `npm run build`
Expected: PASS

**Step 5: Commit**
```bash
git add src/@types/office.ts src/@types/designation.ts src/features/offices/ src/features/designations/ src/components/comboboxes/office-combobox.tsx src/components/comboboxes/designation-combobox.tsx
git commit -m "feat: align offices and designations with backend v2 schema"
```

---

### Task 4: Clients Domain Realignment

**Files:**
- Modify: `src/@types/client.ts`
- Modify: `src/features/clients/types/index.ts`
- Modify: `src/features/clients/api/index.ts`
- Modify: `src/components/comboboxes/client-combobox.tsx`
- Modify: `src/pages/admin/clients/index.tsx`
- Modify: `src/pages/admin/clients/client-form.tsx`

**Step 1: Update Client DTOs & Types**
- Set `id: number`, `officeId: number | null`, `designationId: number | null`, `userId: number | null`, `email: string | null`.

**Step 2: Update Clients API**
- In `features/clients/api/index.ts`:
  - `getAll`: queries `GET /clients`, unpacks `response.data` returning `{ rows: response.data.data, meta: response.data.meta }`.
  - `getById`, `create`, `update`, `delete` map to `/clients/:id`.

**Step 3: Update Client ComboBox & Admin Pages**
- In `client-combobox.tsx`: Fetch via `GET /clients?search=${search}&limit=50`, map to `{ value: String(client.id), label: `${client.firstName} ${client.lastName}` }`.
- In `admin/clients/index.tsx`: Map table data to `response.data.data` and pagination to `response.data.meta`.
- In `admin/clients/client-form.tsx`: Send `officeId: Number(val)` and `designationId: Number(val)`.

**Step 4: Verify build**
Run: `npm run build`
Expected: PASS

**Step 5: Commit**
```bash
git add src/@types/client.ts src/features/clients/ src/components/comboboxes/client-combobox.tsx src/pages/admin/clients/
git commit -m "feat: align clients domain with relational schema and numeric ids"
```

---

### Task 5: Users Domain & User ComboBox Realignment

**Files:**
- Modify: `src/@types/user.ts`
- Modify: `src/features/users/types/index.ts`
- Modify: `src/features/users/api/index.ts`
- Modify: `src/components/comboboxes/user-combobox.tsx`
- Modify: `src/pages/admin/users/index.tsx`
- Modify: `src/pages/admin/users/user-form.tsx`

**Step 1: Update User DTO & Types**
- Ensure `User` uses `id: number`, `role: 'admin' | 'service_engineer' | 'staff' | 'user'`, `isActive: boolean`.

**Step 2: Update Users API**
- Support query params: `search`, `role`, `isActive`, `page`, `limit`.
- Map endpoints: `GET /users`, `GET /users/:id`, `POST /users`, `PUT /users/:id`, `PATCH /users/:id/status`, `DELETE /users/:id`.

**Step 3: Update User ComboBox & Admin Pages**
- In `user-combobox.tsx`: Filter `role=service_engineer&search=${search}`, map to `{ value: String(user.id), label: `${user.firstName} ${user.lastName}` }`.
- In `admin/users/index.tsx`: Bind table to `response.data.data` and `response.data.meta`.
- In `admin/users/user-form.tsx`: Support `service_engineer` role selection.

**Step 4: Verify build**
Run: `npm run build`
Expected: PASS

**Step 5: Commit**
```bash
git add src/@types/user.ts src/features/users/ src/components/comboboxes/user-combobox.tsx src/pages/admin/users/
git commit -m "feat: align users domain with v2 role enums and numeric ids"
```

---

### Task 6: Service Tickets Domain Realignment (Admin Flow)

**Files:**
- Modify: `src/@types/service-ticket.ts`
- Modify: `src/features/tickets/types/index.ts`
- Modify: `src/features/tickets/schemas/index.ts`
- Modify: `src/features/tickets/api/index.ts`
- Modify: `src/pages/admin/it-service-tickets/index.tsx`
- Modify: `src/pages/admin/it-service-tickets/it-service-ticket-view.tsx`
- Modify: `src/pages/admin/it-service-tickets/it-service-ticket-form.tsx`

**Step 1: Update Service Ticket Types and Enums**
- Set `serviceStatus`: `'open' | 'in_progress' | 'resolved' | 'closed' | 'cancelled'`.
- Set `priority`: `'low' | 'medium' | 'high' | 'urgent'`.
- Set `rating`: `1 | 2 | 3 | 4 | 5`.
- Set `clientId: number | null`, `serviceEngineerId: number | null`.

**Step 2: Update Tickets API**
- In `features/tickets/api/index.ts`:
  - `getAll`: `GET /service-tickets?page=&limit=&search=&serviceStatus=&priority=&clientId=&serviceEngineerId=`.
  - `getById`: `GET /service-tickets/:id` (returns ticket with embedded `histories`).
  - `create`: `POST /service-tickets`.
  - `update`: `PUT /service-tickets/:id`.
  - `updateStatus`: `PATCH /service-tickets/:id/status` `{ serviceStatus, notes? }`.
  - `assignEngineer`: `PATCH /service-tickets/:id/assign` `{ serviceEngineerId, notes? }`.
  - Remove unsupported `deleteTicket`, `/requested`, `/assigned`.

**Step 3: Update Admin Ticket Views & Forms**
- In `admin/it-service-tickets/index.tsx`: Map table rows to `res.data.data` and pagination to `res.data.meta`.
- In `admin/it-service-tickets/it-service-ticket-view.tsx`: Read embedded `ticket.histories`, connect assign dialog to `PATCH /service-tickets/:id/assign`, connect status/escalate/close to `PATCH /service-tickets/:id/status`.
- In `admin/it-service-tickets/it-service-ticket-form.tsx`: Send `clientId: Number(...)` and `serviceEngineerId: Number(...)`.

**Step 4: Verify build**
Run: `npm run build`
Expected: PASS

**Step 5: Commit**
```bash
git add src/@types/service-ticket.ts src/features/tickets/ src/pages/admin/it-service-tickets/
git commit -m "feat: align service tickets admin flows and action endpoints"
```

---

### Task 7: Service Engineer & Client Dashboard Realignment

**Files:**
- Modify: `src/pages/service-engineer/index.tsx`
- Modify: `src/pages/service-engineer/it-service-ticket.tsx`
- Modify: `src/pages/client/index.tsx`
- Modify: `src/pages/client/client-ticket-form.tsx`
- Modify: `src/pages/client/client-ticket-view.tsx`

**Step 1: Update Service Engineer Pages**
- In `service-engineer/index.tsx`: Fetch assigned tickets using `GET /service-tickets?serviceEngineerId=${user.id}&serviceStatus=in_progress` and closed tickets using `serviceStatus=closed`.
- In `service-engineer/it-service-ticket.tsx`: Update status via `PATCH /service-tickets/:id/status`.

**Step 2: Update Client Pages**
- In `client/index.tsx`: Fetch client tickets using `GET /service-tickets?clientId=${client.id}` (or by linked user).
- In `client/client-ticket-form.tsx`: Create ticket with `clientId: Number(selectedClient)`.
- In `client/client-ticket-view.tsx`: Submit feedback using `POST /service-tickets/:id/feedback` with `{ rating: Number(stars), ratingComment }`.

**Step 3: Verify build**
Run: `npm run build`
Expected: PASS

**Step 4: Commit**
```bash
git add src/pages/service-engineer/ src/pages/client/
git commit -m "feat: align service engineer and client portals with backend v2"
```

---

### Task 8: Notifications & Socket.IO Real-Time Realignment

**Files:**
- Modify: `src/features/notifications/types/index.ts`
- Modify: `src/features/notifications/api/index.ts`
- Create: `src/lib/socket.ts`
- Modify: `src/app/provider.tsx`
- Modify: `src/components/app-dropdown-user.tsx`

**Step 1: Update Notifications API**
- In `features/notifications/api/index.ts`:
  - `getAll`: `GET /notifications?page=1&limit=20` (user identity inferred from JWT).
  - `markAsRead`: `PATCH /notifications/:id/read`.
  - `markAllAsRead`: `PATCH /notifications/read-all`.

**Step 2: Create Socket.IO client helper**
- In `src/lib/socket.ts`: Connect to `env.SOCKET_URL`, join user room on login (`socket.emit('join:user', user.id)`), listen for `'notification:new'`, invalidate TanStack query key `['notifications']`, and display toast banner.
- Register socket listener in global provider `src/app/provider.tsx`.

**Step 3: Verify build**
Run: `npm run build`
Expected: PASS

**Step 4: Commit**
```bash
git add src/features/notifications/ src/lib/socket.ts src/app/provider.tsx src/components/app-dropdown-user.tsx
git commit -m "feat: implement notifications api and socket.io real-time client"
```

---

### Task 9: Final Quality Gate & Verification

**Files:**
- Modify: `docs/plans/task.md`

**Step 1: Execute full TypeScript build**
Run: `npm run build`
Expected: Build passes with 0 errors and creates clean `dist/` bundle.

**Step 2: Run ESLint**
Run: `npm run lint`
Expected: 0 errors.

**Step 3: Update task tracker**
Update `docs/plans/task.md` to reflect full API contract alignment.

**Step 4: Commit**
```bash
git add docs/plans/task.md
git commit -m "chore: complete api contract alignment with itsm-backend"
```
