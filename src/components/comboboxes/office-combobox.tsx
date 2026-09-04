import { useState } from "react";
import { AppComboBox } from "@/components/comboboxes/app-combobox";
import { useOffices } from "@/features/offices";
import { cn } from "@/lib/utils";

export default function OfficeComboBox({
  defaultValue,
  previousValue,
  onValueChange,
  className,
}: {
  defaultValue?: string;
  previousValue?: string;
  onValueChange: (value: string) => void;
  className?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [label, setLabel] = useState("");
  const [search, setSearch] = useState("");

  const { data: offices = [] } = useOffices();

  const items = offices
    .filter((office) => {
      if (!search) return true;
      const term = search.toLowerCase();
      return (
        office.name?.toLowerCase().includes(term) ||
        office.code?.toLowerCase().includes(term)
      );
    })
    .map((office) => ({
      value: String(office.id),
      label: office.code ? `${office.code} - ${office.name}` : office.name,
    }));

  return (
    <AppComboBox
      className={cn("w-full font-normal", className)}
      items={items}
      value={value}
      label={label}
      onSelect={(value, label) => {
        setValue(value || "");
        setLabel(label || "");
        onValueChange(value);
      }}
      onSearchChange={setSearch}
      searchPlaceholder="Search office..."
      noResultsMsg="No offices found"
      selectItemMsg={previousValue || "Select an office"}
    />
  );
}
