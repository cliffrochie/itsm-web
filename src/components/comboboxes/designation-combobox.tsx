import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppComboBox } from "@/components/comboboxes/app-combobox";
import { IDesignation } from "@/@types/designation";
import api from "@/hooks/use-api";
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

  const { data } = useQuery({
    queryKey: [search, "designationComboBox"],
    queryFn: async () => {
      let url = `/api/designations/?noPage=true&sort=title&title=${search}`;
      const response = await api.get<IDesignation[]>(url);

      let data: { value: string; label: string }[] = [];

      response.data.map((designation) => {
        data.push({
          value: designation._id,
          label: designation.title,
        });
      });

      console.log(response.data);
      console.log(data);

      return data;
    },
  });

  return (
    <>
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
        searchPlaceholder="Search designation..."
        noResultsMsg="No designation found"
        selectItemMsg={previousValue || "Select a designation"}
      />
    </>
  );
}
