export interface Office {
  id: number;
  _id?: string;
  name: string;
  code: string;
  alias?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
