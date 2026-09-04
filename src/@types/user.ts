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

export function isUserInterface(obj: any): obj is IUser {
  return (
    obj &&
    (typeof obj.id === "number" || typeof obj._id === "string") &&
    typeof obj.username === "string" &&
    typeof obj.email === "string" &&
    typeof obj.firstName === "string" &&
    typeof obj.lastName === "string"
  );
}
