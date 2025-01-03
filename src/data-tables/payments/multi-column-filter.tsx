import { FilterFn } from "@tanstack/react-table";
import { Payment } from './data'

// Custom filter function for multi-column searching
export const multiColumnFilterFn: FilterFn<Payment> = (row, columnId, filterValue) => {
  // Concatenate the values from multiple columns into a single string
  const searchableRowContent = `${row.original.email} ${row.original.status} ${row.original.amount}`;

  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};

