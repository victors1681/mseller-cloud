// ** React Imports
import type { ReactElement } from 'react'

// ** Next Imports
import { GetServerSideProps } from 'next/types'

// ** View Import
import InventoryAnalytics from 'src/views/apps/inventory-management/analytics/InventoryAnalytics'

// ** Layout Import
import UserLayout from 'src/layouts/UserLayout'

interface AnalyticsPageProps {
  id: string
}

const InventoryConteoAnalyticsPage = ({ id }: AnalyticsPageProps) => {
  return <InventoryAnalytics countId={id} />
}

InventoryConteoAnalyticsPage.getLayout = (page: ReactElement) => (
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

export default InventoryConteoAnalyticsPage
