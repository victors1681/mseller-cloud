// ** Next Import
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next/types'

// ** Demo Components Imports
import Add from 'src/views/apps/products/add/Add'

// ** Styled Component
import LoadingWrapper from '@/views/ui/LoadingWrapper'

interface ProductEditProps {
  id: string
}

const ProductEdit = ({ id }: ProductEditProps) => {
  const router = useRouter()

  // If page is in loading state, display loading message
  if (router.isFallback) {
    return <LoadingWrapper isLoading={true}> </LoadingWrapper>
  }

  return (
    <div>
      <Add id={id} />
    </div>
  )
}

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

export default ProductEdit
