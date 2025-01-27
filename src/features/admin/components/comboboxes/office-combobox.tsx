
import { useState } from 'react'
import { useQuery } from "@tanstack/react-query";
import { AppComboBox } from "@/components/app-combobox"
// import { IDesignation } from '@/@types/designation'
import { IOffice } from '@/@types/office';
import api from '@/services/use-api'

export default function OfficeComboBox({
  defaultValue,
  previousValue,
  onValueChange,
}: {
  defaultValue?: string;
  previousValue?: string;
  onValueChange: (value: string) => void;
}) {
  
  const [value, setValue] = useState(defaultValue);
  const [label, setLabel] = useState("");
  const [search, setSearch] = useState("");

  const { data } = useQuery({
    queryKey: [search, "officeComboBox"],
    queryFn: async () => {
      let data: {value: string, label: string}[] = []

      let aliasUrl = `/api/offices/?noPage=true&alias=${search}`
      const aliasResponse = await api.get<IOffice[]>(aliasUrl)

      aliasResponse.data.map(office => {
        if(office.alias) {
          data.push({
            value: office._id,
            label: office.alias
          })
        }
      })

      return data
    }
  });

  return (
    <AppComboBox
      className="w-full h-7"
      items={data || []}
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
  )
}