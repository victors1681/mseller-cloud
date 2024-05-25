import axios, { isAxiosError } from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next/types'

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  try {
    const { method, query } = req
    const { path, ...params } = query
    const fullPath = `${Array.isArray(path) ? path?.join('/') : ''}`

    const targetUrl = req.headers['x-url']

    if (process.env.NODE_ENV === 'production') {
      //If production build use the url server from the user account
      axios.defaults.baseURL = targetUrl as string
    }
    if (process.env.NODE_ENV === 'development') {
      //If development, we can choose to use the user target server, localhost or hardcoded URL
      if (process.env.TARGET === '') {
      } else {
        //Default
        axios.defaults.baseURL = targetUrl as string
      }
      //Console log only on development mode
      console.log('targetUrl', axios.defaults.baseURL)
      console.log(
        'Call from:',
        `${axios.defaults.baseURL}/${fullPath}`,
        'payload',
        params,
      )
    }

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
