export interface IOffice {
  id?: number;
  _id?: string;
  name: string;
  code?: string;
  alias?: string;
  parentOffice?: string | IOffice;
  officeType?:
    | ""
    | "unit"
    | "section"
    | "division"
    | "irrigation system"
    | "satellite office"
    | "irrigation management office"
    | "regional office";
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
