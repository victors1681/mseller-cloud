// ** React Imports
import { useRouter } from 'next/router'

// ** View Import
import ReportDetailView from 'src/views/apps/reports/ReportDetailView'

const ReportDetailPage = () => {
  const router = useRouter()
  const { id } = router.query

  if (!id || Array.isArray(id)) {
    return null
  }

  return <ReportDetailView reportId={parseInt(id, 10)} />
}

export default ReportDetailPage
