import { CircularProgress } from '@mui/material'
import { Stack } from '@mui/system'
import React from 'react'

export const CustomLoading = () => {
  return (
    <Stack
    direction="row"
    justifyContent="center"
    alignItems="center"
    spacing={4}
    mt={10}
  >
    <CircularProgress />
  </Stack>
  )
}
