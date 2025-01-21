
import { useState } from 'react'
import { useQuery } from "@tanstack/react-query";
import { AppComboBox } from "@/components/app-combobox"
// import { IDesignation } from '@/@types/designation'
import { IUser } from '@/@types/user';
import api from '@/services/use-api'

export default function UserComboBox({
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
    queryKey: [search, "userComboBox"],
    queryFn: async () => {
      let data: {value: string, label: string}[] = []

      let userUrl = `/api/users/?noPage=true&personnel=true&fullName=${search}`
      const userResponse = await api.get<IUser[]>(userUrl)

      userResponse.data.map(user => {
        if(user.firstName) {
          data.push({
            value: user._id,
            label: user.firstName +' '+ (user.middleName ? user.middleName[0] +'. ' : '') + user.lastName + (user.extensionName ? user.extensionName : '')
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
      searchPlaceholder="Search service engineer..."
      noResultsMsg="No service engineer found"
      selectItemMsg={previousValue || "Select a service engineer"}
    />
  )
}