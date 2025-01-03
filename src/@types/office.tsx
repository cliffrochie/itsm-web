export interface IOffice {
  _id: string
  name: string
  alias?: string
  parentOffice: string | IOffice
  officeType: "unit" | "section" | "division" | "irrigation system"  | "satellite office" | "irrigation management office" | "regional office"
  createdBy: string
  updatedBy: string
  createdAt?: Date
  updatedAt?: Date
}

