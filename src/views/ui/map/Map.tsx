import React from 'react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'

import { createCustomEqual } from 'fast-equals'
import { isLatLngLiteral } from '@googlemaps/typescript-guards'
import { DocumentoEntregaType } from 'src/types/apps/transportType'
import { TransportStatusEnum } from 'src/utils/transportMappings'

const innerFn: any = (deepEqual: any) => (a: any, b: any) => {
  if (
    isLatLngLiteral(a) ||
    a instanceof google.maps.LatLng ||
    isLatLngLiteral(b) ||
    b instanceof google.maps.LatLng
  ) {
    return new google.maps.LatLng(a).equals(new google.maps.LatLng(b))
  }

  // TODO extend to other types

  // use fast-equals for other objects
  return deepEqual(a, b)
}

const deepCompareEqualsForMaps = createCustomEqual(innerFn)

function useDeepCompareMemoize(value: any) {
  const ref = React.useRef()

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value
  }

  return ref.current
}

function useDeepCompareEffectForMaps(
  callback: React.EffectCallback,
  dependencies: any[],
) {
  React.useEffect(callback, dependencies.map(useDeepCompareMemoize))
}

interface MapComponentProps extends google.maps.MapOptions {
  center: google.maps.LatLngLiteral
  zoom: number
  children?: JSX.Element | JSX.Element[]
}

const MyMapComponent: React.FC<MapComponentProps> = ({
  center,
  zoom,
  children,
  ...options
}) => {
  const ref = React.useRef(null)
  const [map, setMap] = React.useState<google.maps.Map>()

  React.useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, { center, zoom }))
    }
  }, [ref, map])

  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options)
    }
  }, [map, options])

  return (
    <div style={{ height: '500px', width: '800px' }} ref={ref} id="map">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement<any>(child, { map })
        }
      })}
    </div>
  )
}

const render = (status: Status): React.ReactElement => {
  if (status === Status.FAILURE) return <div>error</div>
  return <div>loading</div>
}

const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
  const [marker, setMarker] = React.useState<google.maps.Marker>()

  React.useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker())
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null)
      }
    }
  }, [marker])

  React.useEffect(() => {
    if (marker) {
      marker.setOptions(options)
    }
  }, [marker, options])

  return null
}

interface MarketData {
  label: string
  icon: any
  position: {
    lng: number
    lat: number
  }
}
const getClientAndDeliveryLocations = (details?: DocumentoEntregaType[]) => {
  const markets = details?.reduce(
    (acc: MarketData[], current: DocumentoEntregaType): MarketData[] => {
      //if location client is pressent
      if (
        current.cliente.geoLocalizacion?.latitud &&
        current.cliente.geoLocalizacion.longitud
      ) {
        acc.push({
          label: `${current.cliente}-${current.cliente.nombre}`,
          icon: 'http://maps.google.com/mapfiles/kml/paddle/blu-circle.png',
          position: {
            lng: current.cliente.geoLocalizacion?.latitud,
            lat: current.cliente.geoLocalizacion.longitud,
          },
        })
      }

      if (current.entregaLongitud && current.entregaLatitud) {
        acc.push({
          label: `${current.cliente}-${current.cliente.nombre}`,
          icon:
            current.status === TransportStatusEnum.Entregado
              ? 'http://maps.google.com/mapfiles/kml/paddle/grn-circle.png'
              : 'http://maps.google.com/mapfiles/kml/paddle/pink-circle.png',
          position: {
            lng: current.entregaLongitud,
            lat: current.entregaLatitud,
          },
        })
      }
      return acc
    },
    [],
  )
  return markets
}

interface MapProps {
  orderDetails?: DocumentoEntregaType[]
}

export const Map = ({ orderDetails }: MapProps) => {
  const [zoom, setZoom] = React.useState(12) // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: 40.79000695417712,
    lng: -74.02202221689599,
  })

  const locations = getClientAndDeliveryLocations(orderDetails)

  React.useEffect(() => {
    if (locations && locations?.length > 0) {
      setCenter(locations[0].position)
    }
  }, [locations?.length])

  return (
    <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP || ''} render={render}>
      <MyMapComponent center={center} zoom={zoom}>
        {locations?.map((l) => (
          <Marker
            key={l.position.lat}
            position={l.position}
            label={l.label}
            icon={l.icon}
          />
        ))}
      </MyMapComponent>
    </Wrapper>
  )
}

export default Map
