// ** React Imports
import type { ReactElement } from 'react'

// ** Next Imports
import { GetServerSideProps } from 'next/types'

// ** View Imports
import InventoryReconciliationDetail from 'src/views/apps/inventory-management/reconciliations/InventoryReconciliationDetail'

// ** Layout Import
import UserLayout from 'src/layouts/UserLayout'

interface ReconciliationDetailPageProps {
  id: string
}

const InventoryReconciliationDetailPage = ({
  id,
}: ReconciliationDetailPageProps) => {
  return <InventoryReconciliationDetail reconciliationId={id} />
}

InventoryReconciliationDetailPage.getLayout = (page: ReactElement) => (
  <UserLayout>{page}</UserLayout>
)

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {}

  if (!id || typeof id !== 'string') {
    return {
      notFound: true, // Returns 404 page
    }
  }

  try {
    return {
      props: {
        id,
      },
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}

export default InventoryReconciliationDetailPage
