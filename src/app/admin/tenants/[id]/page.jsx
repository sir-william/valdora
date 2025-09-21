'use client'

import { useParams } from 'next/navigation'
import TenantDetail from '@/views/tenant/TenantDetail'

const TenantDetailPage = () => {
  const params = useParams()
  const { id } = params

  if (!id) {
    return <div>ID du tenant manquant</div>
  }

  return <TenantDetail tenantId={id} />
}

export default TenantDetailPage
