import type { NextApiRequest, NextApiResponse } from 'next/types'
import axios from 'axios'
import restClient from 'src/configs/restClient'
import https from 'https'
const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  try {
    const { method, query } = req
    const { path, ...params } = query
    const fullPath = `${Array.isArray(path) ? path?.join('/') : ''}`

    // axios.defaults.baseURL =
    //   process.env.NODE_ENV === 'production'
    //     ? 'https://mseller-portal-api.azurewebsites.net'
    //     : 'http://localhost:5186'

    restClient.defaults.baseURL = 'https://portal-int-api.mseller.app'

    const agent = new https.Agent({
      rejectUnauthorized: false,
    })

    //URL coming from the user configuration
    //const targetUrl = req.headers['x-url']
    //console.log('targetUrl', targetUrl)

    //console.log(req.headers.authorization)
    switch (method) {
      case 'GET':
        params
        const response = await restClient.get(fullPath, {
          params: params,
          headers: {
            Authorization: req.headers.authorization,
          },
          //httpsAgent: agent,
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
    if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
      console.error('Connection was terminated or aborted:', error.message)
    } else {
      console.error('Error:', error.message)
      res.status(500).json({ message: error.message })
    }
  }
}

export default handler