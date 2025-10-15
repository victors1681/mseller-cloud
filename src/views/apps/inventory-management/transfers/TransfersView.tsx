// ** React Imports

// ** MUI Imports
import { Box, Card, CardContent, Grid, Typography } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const TransfersView = () => {
  return (
    <Grid container spacing={{ xs: 3, sm: 6 }}>
      <Grid item xs={12}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2.125rem' },
            mb: 1,
          }}
        >
          Stock Transfers
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          Transfer inventory between locations with validation and tracking
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: { xs: 4, sm: 8 },
                gap: { xs: 2, sm: 3 },
                px: { xs: 1, sm: 2 },
              }}
            >
              <Box sx={{ fontSize: { xs: '3rem', sm: '4rem' } }}>
                <Icon
                  icon="mdi:transfer-right"
                  fontSize="inherit"
                  color="text.secondary"
                />
              </Box>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  textAlign: 'center',
                }}
              >
                Stock Transfers Module
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  px: { xs: 1, sm: 0 },
                }}
              >
                This module is under development. It will allow you to:
              </Typography>
              <Box
                component="ul"
                sx={{
                  color: 'text.secondary',
                  maxWidth: { xs: 320, sm: 400 },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  pl: { xs: 2, sm: 3 },
                  '& li': {
                    mb: 0.5,
                  },
                }}
              >
                <li>Transfer stock between locations</li>
                <li>Validate stock availability before transfer</li>
                <li>Track transfer history by location and product</li>
                <li>View before/after stock levels</li>
                <li>Generate transfer confirmation reports</li>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: { xs: 1, sm: 2 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                }}
              >
                Coming soon...
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default TransfersView
