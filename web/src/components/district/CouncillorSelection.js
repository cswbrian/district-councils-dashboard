import React from 'react'
import { PlainDialog } from '../molecules/Dialog'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { PlainCard } from '../molecules/Card'
import AddIcon from '@material-ui/icons/Add'
import { useTranslation } from 'react-i18next'

export default function CustomizedDialogs() {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const { t } = useTranslation()

  return (
    <>
      <PlainCard onClick={handleClickOpen}>
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography variant="h6" gutterBottom>
              {/* 現任區議員 */}
              {t('currentTerm.councilor')}
            </Typography>

            <Typography variant="h6">
              {/* 此為新設選區，按此選擇現任區議員 */}
              {t('councillorSelection.text1')}
            </Typography>
          </Box>
          <Box>
            <AddIcon style={{ fontSize: 48 }} />
          </Box>
        </Box>
      </PlainCard>
      <PlainDialog
        open={open}
        handleClose={handleClose}
        // title="此選區於2019年設立"
        title={t('councillorSelection.plainDialog.text1')}
        content="content"
        actions="actions"
      ></PlainDialog>
    </>
  )
}
