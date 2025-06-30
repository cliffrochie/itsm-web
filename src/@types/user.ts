export interface IUser {
  _id: string;
  avatar?: string;
  username: string;
  password?: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  extensionName?: string;
  contactNo?: string;
  role: "user" | "staff" | "admin";
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export function isUserInterface(obj: any): obj is IUser {
  // console.log(obj)
  return (
    obj &&
    typeof obj._id === "string" &&
    typeof (
      obj.avatar === "string" ||
      obj.avatar === null ||
      obj.avatar === ""
    ) &&
    typeof obj.username === "string" &&
    typeof obj.email === "string" &&
    typeof (
      obj.password === "string" ||
      obj.password === null ||
      obj.password === ""
    ) &&
    typeof obj.firstName === "string" &&
    typeof (
      obj.middleName === "string" ||
      obj.middleName === null ||
      obj.middleName === ""
    ) &&
    typeof obj.lastName === "string" &&
    typeof (
      obj.extensionName === "string" ||
      obj.extensionName === null ||
      obj.extensionName === ""
    ) &&
    typeof (
      obj.contactNo === "string" ||
      obj.contactNo === null ||
      obj.contactNo === ""
    ) &&
    typeof (obj.role === "string" || obj.role === null || obj.role === "") &&
    typeof (
      obj.createdBy === "string" ||
      obj.createdBy === null ||
      obj.createdBy === ""
    ) &&
    typeof (
      obj.updatedBy === "string" ||
      obj.updatedBy === null ||
      obj.updatedBy === ""
    ) &&
    typeof (
      obj.createdAt === "object" ||
      obj.createdAt === null ||
      obj.createdAt === ""
    ) &&
    typeof (
      obj.updatedAt === "object" ||
      obj.updatedAt === null ||
      obj.updatedAt === ""
    )
  );
}
