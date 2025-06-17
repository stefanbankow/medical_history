import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  LocalHospital as DoctorIcon,
  HealthAndSafety as InsuranceIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

import { Patient } from '../../types';

interface PatientViewDialogProps {
  patient: Patient | null;
  open: boolean;
  onClose: () => void;
}

const PatientViewDialog: React.FC<PatientViewDialogProps> = ({
  patient,
  open,
  onClose,
}) => {
  if (!patient) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon />
          Patient Details
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {patient.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              EGN: {patient.egn}
            </Typography>
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DoctorIcon color="primary" />
            <Box>
              <Typography variant="subtitle2">Family Doctor</Typography>
              <Typography variant="body2">
                {patient.familyDoctorName || 'Not assigned'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InsuranceIcon color="primary" />
            <Box>
              <Typography variant="subtitle2">Insurance Status</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Chip
                  label={patient.healthInsurancePaid ? 'Paid' : 'Unpaid'}
                  color={patient.healthInsurancePaid ? 'success' : 'error'}
                  size="small"
                />
                <Chip
                  label={patient.healthInsuranceValid ? 'Valid' : 'Invalid'}
                  color={patient.healthInsuranceValid ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
            </Box>
          </Box>

          {patient.lastInsurancePaymentDate && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon color="primary" />
              <Box>
                <Typography variant="subtitle2">Last Payment Date</Typography>
                <Typography variant="body2">
                  {format(new Date(patient.lastInsurancePaymentDate), 'dd/MM/yyyy')}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientViewDialog;
