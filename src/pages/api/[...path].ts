import axios, { isAxiosError } from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next/types'
import restClient from 'src/configs/restClient'
const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  try {
    const { method, query } = req
    const { path, ...params } = query
    const fullPath = `${Array.isArray(path) ? path?.join('/') : ''}`

    //restClient.defaults.baseURL = 'https://portal-int-api.mseller.app'

    const targetUrl = req.headers['x-url']

    const enableProdEnPoint = true

    axios.defaults.baseURL =
      process.env.NODE_ENV === 'production'
        ? (targetUrl as string) // 'https://portal-int-api.mseller.app'
        : !enableProdEnPoint
        ? 'http://localhost:5186'
        : 'https://portal-int-api.mseller.app'

    console.log('targetUrl', axios.defaults.baseURL)

    //URL coming from the user configuration

    //console.log(req.headers.authorization)
    console.log(
      'Call from:',
      `${axios.defaults.baseURL}/${fullPath}`,
      'payload',
      params,
    )
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
        const postResponse = await axios.post(fullPath, req.body, {
          params: params,
          headers: {
            Authorization: req.headers.authorization,
          },
        })
        // Access request body using req.body
        res.status(200).json(postResponse.data)
        break
      case 'PUT':
        const putResponse = await axios.put(fullPath, req.body, {
          params: params,
          headers: {
            Authorization: req.headers.authorization,
          },
        })
        // Access request body using req.body
        res.status(200).json(putResponse.data)
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
