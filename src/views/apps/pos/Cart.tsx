import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
  Stack,
  Divider,
} from '@mui/material'
import Icon from '@/@core/components/icon'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartProps {
  items: CartItem[]
  onCheckout: () => void
}

const items: CartItem[] = [
  { id: 1, name: 'Product 1', price: 29.99, quantity: 2 },
  { id: 2, name: 'Product 2', price: 49.99, quantity: 1 },
  { id: 3, name: 'Product 3', price: 19.99, quantity: 3 },
  { id: 4, name: 'Product 2', price: 49.99, quantity: 1 },
  { id: 5, name: 'Product 3', price: 19.99, quantity: 3 },
  { id: 6, name: 'Product 2', price: 49.99, quantity: 1 },
  { id: 7, name: 'Product 3', price: 19.99, quantity: 3 },
  { id: 8, name: 'Product 2', price: 49.99, quantity: 1 },
  { id: 9, name: 'Product 2', price: 49.99, quantity: 1 },
  { id: 10, name: 'Product 3', price: 19.99, quantity: 3 },
  { id: 11, name: 'Product 2', price: 49.99, quantity: 1 },
  { id: 12, name: 'Product 3', price: 19.99, quantity: 3 },
  { id: 13, name: 'Product 2', price: 49.99, quantity: 1 },
  { id: 14, name: 'Product 3', price: 19.99, quantity: 3 },
  { id: 15, name: 'Product 2', price: 49.99, quantity: 1 },
  { id: 16, name: 'Product 3', price: 19.99, quantity: 3 },
  { id: 17, name: 'Product 2', price: 49.99, quantity: 1 },
  { id: 18, name: 'Product 3', price: 19.99, quantity: 3 },
  { id: 19, name: 'Product 3', price: 19.99, quantity: 3 },
]

// Sample onCheckout function
const handleCheckout = () => {
  console.log('Proceed to checkout')
}
const Cart: React.FC<any> = () => {
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  )
  const tax = subtotal * 0.1 // assuming 10% tax
  const total = subtotal + tax

  return (
    <Paper style={{ padding: '16px' }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Button
            startIcon={<Icon icon="mdi:plus" fontSize={20} />}
            variant="outlined"
          >
            Agregar Cliente
          </Button>
        </Grid>
        <Grid item xs={4} sx={{ textAlign: 'right' }}>
          <IconButton>
            <Icon icon="mdi:barcode-scan" fontSize={25} />
          </IconButton>
          <IconButton>
            <Icon icon="mdi:reload" fontSize={25} />
          </IconButton>
        </Grid>
      </Grid>
      <TableContainer
        component={Paper}
        sx={{ height: '500px', overflow: 'auto' }}
      >
        <Table>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ width: '10%' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.quantity}
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: '80%' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.name}
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: '10%' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ${item.price.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => item.id}
                  >
                    <Icon icon="mdi:close-circle" fontSize={20} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container spacing={2} style={{ marginTop: '16px' }}>
        <Grid item xs={6}>
          <Typography variant="body1">Subtotal:</Typography>
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'right' }}>
          <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">Tax:</Typography>
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'right' }}>
          <Typography variant="body1">${tax.toFixed(2)}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Total:
          </Typography>
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'right' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            ${total.toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
      <Stack
        width={`100%`}
        direction={'row'}
        justifyContent="space-between"
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleCheckout()}
          style={{ marginTop: '16px', width: '180px' }}
        >
          Limpiar
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleCheckout()}
          style={{ marginTop: '16px', width: '180px' }}
        >
          Proceder
        </Button>
      </Stack>
    </Paper>
  )
}

export default Cart
