import type { NextApiRequest, NextApiResponse } from 'next/types'
import { POSAreaFilter } from 'src/types/apps/posTypes'

// Mock areas data
const mockAreas: POSAreaFilter[] = [
  {
    area: 'GRANOS',
    iDArea: 1,
    count: 15,
  },
  {
    area: 'LACTEOS',
    iDArea: 2,
    count: 8,
  },
  {
    area: 'PANADERIA',
    iDArea: 3,
    count: 12,
  },
  {
    area: 'BEBIDAS',
    iDArea: 4,
    count: 20,
  },
  {
    area: 'LIMPIEZA',
    iDArea: 5,
    count: 25,
  },
  {
    area: 'CUIDADO_PERSONAL',
    iDArea: 6,
    count: 18,
  },
  {
    area: 'CARNES',
    iDArea: 7,
    count: 10,
  },
  {
    area: 'VEGETALES',
    iDArea: 8,
    count: 22,
  },
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Simulate API delay
      setTimeout(() => {
        res.status(200).json({
          success: true,
          areas: mockAreas,
          total: mockAreas.length,
        })
      }, 300)
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching areas',
        error: error,
      })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
