import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import {
  MedicalServices as MedicalIcon,
  Person as PersonIcon,
  LocalHospital as DoctorIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Assignment as DiagnosisIcon,
  Medication as MedicationIcon,
  Notes as NotesIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

import { MedicalVisit } from '../../types';

interface MedicalVisitViewDialogProps {
  visit: MedicalVisit | null;
  open: boolean;
  onClose: () => void;
}

const MedicalVisitViewDialog: React.FC<MedicalVisitViewDialogProps> = ({
  visit,
  open,
  onClose,
}) => {
  if (!visit) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MedicalIcon />
          Medical Visit Details
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Visit Basic Info */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Visit Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2">Date</Typography>
                    <Typography variant="body2">
                      {format(new Date(visit.visitDate), 'dd/MM/yyyy')}
                    </Typography>
                  </Box>
                </Box>

                {visit.visitTime && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimeIcon color="primary" />
                    <Box>
                      <Typography variant="subtitle2">Time</Typography>
                      <Typography variant="body2">{visit.visitTime}</Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Patient and Doctor Info */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PersonIcon color="primary" />
                  <Typography variant="h6">Patient</Typography>
                </Box>
                <Typography variant="body1">{visit.patientName}</Typography>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <DoctorIcon color="primary" />
                  <Typography variant="h6">Doctor</Typography>
                </Box>
                <Typography variant="body1">{visit.doctorName}</Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Diagnosis */}
          {visit.diagnosisName && (
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <DiagnosisIcon color="primary" />
                  <Typography variant="h6">Diagnosis</Typography>
                </Box>
                <Typography variant="body1">{visit.diagnosisName}</Typography>
              </CardContent>
            </Card>
          )}

          {/* Medical Details */}
          {visit.symptoms && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Symptoms
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {visit.symptoms}
                </Typography>
              </CardContent>
            </Card>
          )}

          {visit.treatment && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Treatment
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {visit.treatment}
                </Typography>
              </CardContent>
            </Card>
          )}

          {visit.prescribedMedication && (
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <MedicationIcon color="primary" />
                  <Typography variant="h6">Prescribed Medication</Typography>
                </Box>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {visit.prescribedMedication}
                </Typography>
              </CardContent>
            </Card>
          )}

          {visit.notes && (
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <NotesIcon color="primary" />
                  <Typography variant="h6">Notes</Typography>
                </Box>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {visit.notes}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Sick Leave */}
          {visit.sickLeave && (
            <Card variant="outlined" sx={{ backgroundColor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sick Leave
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2">
                    <strong>Start Date:</strong> {format(new Date(visit.sickLeave.startDate), 'dd/MM/yyyy')}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Duration:</strong> {visit.sickLeave.durationDays} days
                  </Typography>
                  {visit.sickLeave.endDate && (
                    <Typography variant="body2">
                      <strong>End Date:</strong> {format(new Date(visit.sickLeave.endDate), 'dd/MM/yyyy')}
                    </Typography>
                  )}
                  {visit.sickLeave.reason && (
                    <Typography variant="body2">
                      <strong>Reason:</strong> {visit.sickLeave.reason}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MedicalVisitViewDialog;
