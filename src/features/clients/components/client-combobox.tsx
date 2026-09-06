import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppComboBox } from "@/components/comboboxes/app-combobox";
import { clientsApi } from "@/features/clients";
import { cn } from "@/lib/utils";

export default function ClientComboBox({
  defaultValue,
  previousValue,
  onValueChange,
  className,
  searchPlaceholder,
  noResultsMsg,
  selectItemMsg,
}: {
  defaultValue?: string;
  previousValue?: string;
  onValueChange: (value: string) => void;
  className?: string;
  searchPlaceholder?: string;
  noResultsMsg?: string;
  selectItemMsg?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [label, setLabel] = useState("");
  const [search, setSearch] = useState("");

  const { data } = useQuery({
    queryKey: ["clientComboBox", search],
    queryFn: async () => {
      const result = await clientsApi.getAll({ search, limit: 50 });
      return result.rows.map((client) => ({
        value: String(client.id ?? client._id),
        label: `${client.firstName} ${client.middleName ? client.middleName[0] + ". " : ""}${client.lastName}${client.extensionName ? " " + client.extensionName : ""}`,
      }));
    },
  });

  return (
    <AppComboBox
      className={cn("w-full font-normal", className)}
      items={data || []}
      value={value}
      label={label}
      onSelect={(value, label) => {
        setValue(value || "");
        setLabel(label || "");
        onValueChange(value);
      }}
      onSearchChange={setSearch}
      searchPlaceholder={searchPlaceholder || "Search client..."}
      noResultsMsg={noResultsMsg || "No client found"}
      selectItemMsg={previousValue || selectItemMsg || "Select a client"}
    />
  );
}
