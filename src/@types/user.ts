export interface IUser {
  id?: number;
  _id?: string;
  avatar?: string | null;
  username: string;
  password?: string;
  email: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  extensionName?: string | null;
  contactNo?: string | null;
  role: "user" | "staff" | "admin" | "service_engineer";
  isActive?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export function isUserInterface(obj: unknown): obj is IUser {
  if (!obj || typeof obj !== "object") return false;
  const u = obj as Record<string, unknown>;
  return (
    (typeof u.id === "number" || typeof u._id === "string") &&
    typeof u.username === "string" &&
    typeof u.email === "string" &&
    typeof u.firstName === "string" &&
    typeof u.lastName === "string"
  );
}
