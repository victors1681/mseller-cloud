import React, { useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  Button,
  Typography,
  FormControlLabel,
  Link,
} from '@mui/material'

const TermsDialog: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

  const handleOpenModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setOpen(true)
  }

  const handleCloseModal = () => setOpen(false)

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked)
  }

  return (
    <>
      {/* Dialog Component */}
      <Typography variant="body2">
        Acepta{' '}
        <Link
          href="/"
          onClick={handleOpenModal}
          sx={{
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          nuestros términos y condiciones
        </Link>
      </Typography>
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Términos y Condiciones</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Bienvenido a MSELLER. Antes de continuar, por favor, lee y acepta
            los siguientes términos:
            <br />
            1. Respetar las leyes locales e internacionales. <br />
            2. No usar esta plataforma para actividades ilícitas. <br />
            3. Proveer información verdadera al registrarte. <br />
            Al aceptar, confirmas que has leído y entendido estas condiciones.
          </Typography>
        </DialogContent>

        {/* Dialog Actions with Close Button */}
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseModal}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TermsDialog
