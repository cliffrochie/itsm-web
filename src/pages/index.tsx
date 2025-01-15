import { useState} from 'react'
import DesignationComboBox from '@/features/admin/components/designation-combobox'


export default function HomePage() {
  const [search, setSearch] = useState('')

  function handleSearch(value: string) {
    setSearch(value)
  }
  
  return (
    <div className="flex justify-center h-screen items-center">
      <h3>Home page</h3>
      <div className="m-5">
        <DesignationComboBox defaultValue={search} onValueChange={handleSearch} />
      </div>
    </div>
  )
}