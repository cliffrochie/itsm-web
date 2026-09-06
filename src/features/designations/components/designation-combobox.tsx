import { useState } from "react";
import { AppComboBox } from "@/components/comboboxes/app-combobox";
import { useDesignations } from "@/features/designations";
import { cn } from "@/lib/utils";

export default function DesignationComboBox({
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

  const { data: designations = [] } = useDesignations();

  const items = designations
    .filter((designation) => {
      if (!search) return true;
      const term = search.toLowerCase();
      const title = (designation as { title?: string }).title;
      const text = designation.name || title || "";
      return text.toLowerCase().includes(term);
    })
    .map((designation) => ({
      value: String(designation.id),
      label: designation.name || (designation as { title?: string }).title || "",
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
      searchPlaceholder="Search designation..."
      noResultsMsg="No designation found"
      selectItemMsg={previousValue || "Select a designation"}
    />
  );
}
