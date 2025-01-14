export interface IUser {
  _id: string
  avatar?: string
  username: string
  password?: string
  email: string
  firstName: string 
  middleName?: string
  lastName: string
  extensionName?: string
  contactNo?: string
  role: "user" | "staff" | "admin"
  createdAt?: Date
  updatedAt?: Date
}

