// ** React Imports
import { ReactNode } from 'react'

// ** MUI Imports
import { Link, LinkProps, SxProps, Theme } from '@mui/material'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

interface MSellerIOSAppLinkProps
  extends Omit<LinkProps, 'href' | 'target' | 'rel'> {
  children?: ReactNode
  showIcon?: boolean
  iconSize?: string | number
  sx?: SxProps<Theme>
}

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  fontWeight: 500,
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  '&:hover': {
    textDecoration: 'underline',
  },
}))

const MSellerIOSAppLink = ({
  children = 'MSeller iOS App',
  showIcon = true,
  iconSize = '1rem',
  sx,
  ...props
}: MSellerIOSAppLinkProps) => {
  return (
    <StyledLink
      href="https://apps.apple.com/us/app/mseller/id6496435577"
      target="_blank"
      rel="noopener noreferrer"
      sx={sx}
      {...props}
    >
      {children}
      {showIcon && <Icon icon="mdi:apple" fontSize={iconSize} />}
    </StyledLink>
  )
}

export default MSellerIOSAppLink
