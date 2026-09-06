import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppComboBox } from "@/components/comboboxes/app-combobox";
// import { IDesignation } from '@/@types/designation'
import { IUser } from "@/@types/user";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export default function UserComboBox({
  defaultValue,
  previousValue,
  onValueChange,
  className,
  excludeUser,
}: {
  defaultValue?: string;
  previousValue?: string;
  onValueChange: (value: string) => void;
  className?: string;
  excludeUser?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [label, setLabel] = useState("");
  const [search, setSearch] = useState("");

  const { data } = useQuery({
    queryKey: [search, "userComboBox"],
    queryFn: async () => {
      const response = await api.get("/users", {
        params: {
          role: "service_engineer",
          search: search || undefined,
          limit: 50,
        },
      });

      const envelope = response.data;
      const users: IUser[] = Array.isArray(envelope?.data)
        ? envelope.data
        : Array.isArray(envelope)
        ? envelope
        : [];

      const filteredUsers = excludeUser
        ? users.filter((u) => String(u.id ?? u._id) !== String(excludeUser))
        : users;

      return filteredUsers.map((user) => ({
        value: String(user.id ?? user._id),
        label: [
          user.firstName,
          user.middleName ? `${user.middleName[0]}.` : "",
          user.lastName,
          user.extensionName || "",
        ]
          .filter(Boolean)
          .join(" "),
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
      searchPlaceholder="Search service engineer..."
      noResultsMsg="No service engineer found"
      selectItemMsg={previousValue || "Select a service engineer"}
    />
  );
}
