// ** Demo Components Imports
import Docs from './index'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next/types'

/**
 * Transport document preview component
 * Renders a specific transport document based on the ID in the URL
 */
const InvoicePreview = ({ id }: { id: string }) => {
  const router = useRouter()

  // If the page is still generating via fallback
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  // Use the ID from props (provided by getStaticProps)
  const transportId = id || (router.query.id as string)

  if (!transportId) {
    return <div>Loading...</div>
  }

  return <Docs noTransporte={transportId} />
}

// Tell Next.js this is a dynamic route
export const getStaticPaths: GetStaticPaths = async () => {
  // No pre-rendered paths, all will be generated on-demand
  return {
    paths: [],
    fallback: 'blocking', // Wait until the page is generated server-side
  }
}

// Get the ID from the URL params
export const getStaticProps: GetStaticProps = ({
  params,
}: GetStaticPropsContext) => {
  // Get the ID from URL parameters
  const id = params?.id

  // If there's no ID, return 404
  if (!id) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      id: id as string,
    },
    // Revalidate the page every hour (3600 seconds)
    revalidate: 3600,
  }
}

export default InvoicePreview
