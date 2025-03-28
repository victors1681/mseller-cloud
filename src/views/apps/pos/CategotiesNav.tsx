import React, { useState } from 'react'
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  styled,
  Stack,
  IconButton,
} from '@mui/material'
import Icon from '@/@core/components/icon'

const categories = [
  'Electronics',
  'Books',
  'Clothing',
  'Home',
  'Garden',
  'Toys',
  'Sports',
  'Automotive',
  'Health',
  'Beauty',
  'Groceries',
  'Music',
  'Movies',
  'Games',
  'Office',
]
const CustomAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
  // color: theme.palette.primary.main, // Set the desired color
  // '&.MuiSvgIcon-fontSizeSmall': {
  //   fontSize: '1.25rem', // Adjust the font size if needed
  // },
}))
const CategoriesNav: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedCategory(newValue)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <CustomAppBar position="static">
        <Stack direction={'row'}>
          <Tabs
            value={selectedCategory}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="categories navigation"
            sx={{ pr: 10 }}
          >
            {categories.map((category, index) => (
              <Tab key={index} label={category} />
            ))}
          </Tabs>
          <IconButton>
            <Icon icon="mdi:magnify" fontSize={25} />
          </IconButton>
        </Stack>
      </CustomAppBar>
    </Box>
  )
}

export default CategoriesNav
