import axios, { isAxiosError } from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next/types'
import restClient from 'src/configs/restClient'
const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  try {
    const { method, query } = req
    const { path, ...params } = query
    const fullPath = `${Array.isArray(path) ? path?.join('/') : ''}`

    //restClient.defaults.baseURL = 'https://portal-int-api.mseller.app'

    axios.defaults.baseURL =
      process.env.NODE_ENV === 'production'
        ? 'https://portal-int-api.mseller.app'
        : 'https://portal-int-api.mseller.app' //'http://localhost:5186'

    //URL coming from the user configuration
    //const targetUrl = req.headers['x-url']
    //console.log('targetUrl', targetUrl)

    //console.log(req.headers.authorization)
    console.log('Call from:', fullPath)
    switch (method) {
      case 'GET':
        const response = await axios.get(fullPath, {
          params: params,
          headers: {
            Authorization: req.headers.authorization,
          },
        })
        res.status(200).json(response.data)
        break
      case 'POST':
        // Handle POST request logic
        // Access request body using req.body
        res.status(200).json({ method, path: fullPath, data: req.body })
        break
      case 'PUT':
        // Handle PUT request logic
        // Access request body using req.body
        res.status(200).json({ method, path: fullPath, data: req.body })
        break
      case 'DELETE':
        // Handle DELETE request logic
        res.status(200).json({ method, path: fullPath })
        break
      default:
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error: any) {
    if (isAxiosError(error)) {
      console.log(
        error.response?.status,
        error.response?.statusText,
        `${error.request.path}`,
        `Request to: ${axios.defaults.baseURL}`,
      )
      return res
        .status(error.response?.status || 500)
        .json({ message: error.message })
    }

    if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
      console.error('Connection was terminated or aborted:', error.message)
    } else {
      console.error('Error:', error.message)
      res.status(500).json({ message: error.message })
    }
  }
}

export default handler
