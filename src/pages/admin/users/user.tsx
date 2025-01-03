import { useParams } from 'react-router-dom'

export default function AdminUser() {
  const params = useParams<{userId: string}>()

  return (
    <section>
      <h3 className="text-xl font-semibold">User {params.userId}</h3>
    </section>
  )
}