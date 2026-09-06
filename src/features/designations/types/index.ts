export interface Designation {
  id: number;
  _id?: string;
  name: string;
  title?: string;
  code?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type IDesignation = Designation;

