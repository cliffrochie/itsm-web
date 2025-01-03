
import { useState } from 'react'
import { useQuery } from "@tanstack/react-query";
import { AppComboBox } from "@/components/app-combobox"
import { IDesignation } from '@/@types/designation'
import api from '@/services/use-api'

export default function DesignationComboBox({
  defaultValue,
  onValueChange,
}: {
  defaultValue?: string;
  onValueChange: (value: string) => void;
}) {
  
  const [value, setValue] = useState(defaultValue);
  const [label, setLabel] = useState("");
  const [search, setSearch] = useState("");

  const { data } = useQuery({
    queryKey: [search, "designations"],
    queryFn: async () => {
      
      let url = `/api/designations/?noPage=true&title=${search}`
      const response = await api.get<IDesignation[]>(url)

      let data: {value: string, label: string}[] = []

      response.data.map(designation => {
        data.push({
          value: designation._id,
          label: designation.title
        })
      })

      console.log(response.data)
      console.log(data)

      return data
    }
  });

  return (
    <>
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
        searchPlaceholder="Search designation..."
        noResultsMsg="No designation found"
        selectItemMsg="Select a designation"
      />
    </>
    
  )
}