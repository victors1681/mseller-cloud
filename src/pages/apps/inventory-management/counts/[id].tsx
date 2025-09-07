// ** React Imports
import type { ReactElement } from 'react'

// ** Next Imports
import { GetServerSideProps } from 'next/types'

// ** Component Imports
import InventoryCountDetail from 'src/views/apps/inventory-management/counts/InventoryCountDetail'

// ** Layout Import
import UserLayout from 'src/layouts/UserLayout'

interface CountDetailPageProps {
  id: string
}

const ConteoDetail = ({ id }: CountDetailPageProps) => {
  return <InventoryCountDetail countId={id} />
}

ConteoDetail.getLayout = (page: ReactElement) => <UserLayout>{page}</UserLayout>

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

export default ConteoDetail
