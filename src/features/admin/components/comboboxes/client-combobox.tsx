
import { useState } from 'react'
import { useQuery } from "@tanstack/react-query";
import { AppComboBox } from "@/components/app-combobox"
// import { IDesignation } from '@/@types/designation'
import { IClient } from '@/@types/client';
import api from '@/hooks/use-api'
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
  searchPlaceholder?: string
  noResultsMsg?: string
  selectItemMsg?: string
}) {
  
  const [value, setValue] = useState(defaultValue);
  const [label, setLabel] = useState("");
  const [search, setSearch] = useState("");

  const { data } = useQuery({
    queryKey: [search, "clientComboBox"],
    queryFn: async () => {
      let data: {value: string, label: string}[] = []

      let clientUrl = `/api/clients/?noPage=true&fullName=${search}`
      const clientResponse = await api.get<IClient[]>(clientUrl)

      clientResponse.data.map(client => {
        if(client.firstName) {
          data.push({
            value: client._id,
            label: client.firstName +' '+ (client.middleName ? client.middleName[0] +'. ' : '') + client.lastName + (client.extensionName ? client.extensionName : '')
          })
        }
      })

      return data
    }
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
      searchPlaceholder={searchPlaceholder? searchPlaceholder : "Search client..."}
      noResultsMsg={ noResultsMsg ? noResultsMsg : "No client found"}
      selectItemMsg={previousValue || selectItemMsg || "Select a client"}
    />
  )
}