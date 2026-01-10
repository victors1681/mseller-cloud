// ** Next Imports
import dynamic from 'next/dynamic'

// ** Tawk.to Widget - Basic Version (Client-side only)
const TawkMessenger = dynamic(
  () =>
    import('@tawk.to/tawk-messenger-react').then((mod) => {
      const TawkComponent = () => (
        <mod.default
          propertyId="696247b67c8bd319796ac4dc"
          widgetId="1jejug80h"
        />
      )
      return TawkComponent
    }),
  { ssr: false },
)

export default TawkMessenger
