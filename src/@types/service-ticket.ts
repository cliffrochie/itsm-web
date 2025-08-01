import { IUser } from "./user";
import { IClient } from "./client";

export interface IServiceTicket {
  _id: string;
  ticketNo: string;
  taskType:
    | ""
    | "incident"
    | "service request"
    | "maintenance"
    | "consultation"
    | "accessibility";
  title: string;
  natureOfWork: string;
  serialNo?: string;
  equipmentType:
    | ""
    | "computer"
    | "software application"
    | "printer"
    | "scanner"
    | "phone"
    | "network"
    | "others";
  equipmentTypeOthers?: string;
  defectsFound?: string;
  serviceRendered?: string;
  serviceStatus?:
    | ""
    | "open"
    | "assigned"
    | "in progress"
    | "on hold"
    | "escalated"
    | "canceled"
    | "reopened"
    | "resolved"
    | "closed";
  priority: "" | "low" | "medium" | "high";
  remarks?: string;
  adminRemarks?: string;
  rating?: "" | "n" | "s" | "vs" | "d" | "vd";
  ratingComment?: string;
  serviceEngineer: IUser | string | null;
  client: IClient | string | null;
  createdBy?: IUser | string | null;
  updatedBy?: IUser | string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
