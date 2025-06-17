import React from 'react';
import { Box, Typography, Chip, Divider } from '@mui/material';
import { Doctor } from '../../types';
import BaseDialog from '../dialogs/BaseDialog';

interface DoctorViewDialogProps {
  open: boolean;
  onClose: () => void;
  doctor: Doctor | null;
}

const DoctorViewDialog: React.FC<DoctorViewDialogProps> = ({
  open,
  onClose,
  doctor,
}) => {
  if (!doctor) return null;

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title="Doctor Details"
      maxWidth="md"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography>
              <strong>ID Number:</strong> {doctor.identificationNumber}
            </Typography>
            <Typography>
              <strong>Name:</strong> {doctor.name}
            </Typography>
            <Typography>
              <strong>Specialty:</strong> {doctor.specialty}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <strong>Family Doctor:</strong>
              <Chip
                label={doctor.isFamilyDoctor ? 'Yes' : 'No'}
                color={doctor.isFamilyDoctor ? 'success' : 'default'}
                size="small"
              />
            </Box>
          </Box>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" gutterBottom>
            Statistics
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography>
              <strong>Total Patients:</strong> {doctor.patientCount || 0}
            </Typography>
            <Typography>
              <strong>Total Visits:</strong> {doctor.visitCount || 0}
            </Typography>
          </Box>
        </Box>
      </Box>
    </BaseDialog>
  );
};

export default DoctorViewDialog;
