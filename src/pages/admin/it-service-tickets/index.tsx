import { DataTable } from '@/data-tables/payments/data-table'
import { columns } from '@/data-tables/payments/columns'
import { payments } from '@/data-tables/payments/data' 


export default function AdminITServiceTicketsPage() {
  return (
    <section>
      <h3 className="text-xl font-semibold">IT Service Tickets</h3>
      <div className="container py-5">
        <DataTable columns={columns} data={payments} />
      </div>
    </section>
  )
}
