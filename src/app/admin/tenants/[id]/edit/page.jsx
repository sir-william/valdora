'use client'

import { useParams } from 'next/navigation'
import TenantForm from '@/views/tenant/TenantForm'

const EditTenantPage = () => {
  const params = useParams()
  const { id } = params

  if (!id) {
    return <div>ID du tenant manquant</div>
  }

  return <TenantForm tenantId={id} mode="edit" />
}

export default EditTenantPage
