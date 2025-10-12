// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled, Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
}))

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography sx={{ mr: 2 }} variant="body2">
        {`© ${new Date().getFullYear()}, Powered by `}
        {` by `}
        <LinkStyled target="_blank" href="https://mseller.app">
          Mobile Seller LLC
        </LinkStyled>
      </Typography>
      {/* {hidden && false ? null : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
          <LinkStyled target='_blank' href='https://mui.com/store/license/'>
            License
          </LinkStyled>
          <LinkStyled target='_blank' href='https://mui.com/store/contributors/themeselection/'>
            More Themes
          </LinkStyled>
          <LinkStyled
            target='_blank'
            href='https://demos.themeselection.com/marketplace/materio-mui-react-nextjs-admin-template/documentation'
          >
            Documentation
          </LinkStyled>
          <LinkStyled target='_blank' href='https://themeselection.com/support/'>
            Support
          </LinkStyled>
        </Box>
      )} */}
    </Box>
  )
}

export default FooterContent
