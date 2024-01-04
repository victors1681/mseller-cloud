import type { NextApiRequest, NextApiResponse } from 'next/types'
import axios from 'axios'
type ResponseData = {
  message: string
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) => {
  try {
    const { procesado, parameter2 } = req.query

    const response = await axios.get(
      'http://localhost:5186/portal/Transporte',
      {
        params: req.query,
      },
    )
    res.status(200).json(response.data)
  } catch (error: any) {
    if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
      console.error('Connection was terminated or aborted:', error.message)
    } else {
      console.error('Error:', error.message)
      res.status(500).json({ message: error.message })
    }
  }
}

export default handler
