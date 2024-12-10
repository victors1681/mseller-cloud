import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { Box, Fade, LinearProgress } from '@mui/material'

const LoginIllustration = styled(Box)(({ src }: any) => ({
  flex: 1,
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `url(${src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}))

const RandomBg = () => {
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        const randomIntNumber = Math.floor(Math.random() * 1000)
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=technology&per_page=1&page=${randomIntNumber}&orientation=landscape`,
          {
            headers: {
              Authorization: process.env.NEXT_PUBLIC_PEXELS_KEY || '',
            },
          },
        )
        const data = await response.json()
        if (data.photos && data.photos.length > 0) {
          setImageUrl(data.photos[0].src.large)
        }
      } catch (error) {
        console.error('Error fetching the image:', error)
      }
    }

    fetchRandomImage()
  }, [])

  return imageUrl ? (
    <Fade in={!!imageUrl} timeout={1000}>
      <LoginIllustration src={imageUrl} alt="Login background illustration" />
    </Fade>
  ) : (
    <Box
      sx={{
        mt: 11,
        mb: 11,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <LinearProgress color="info" sx={{ width: '100%', top: '-44px' }} />
    </Box>
  )
}

export default RandomBg
