import React from 'react';
import {
  TextField,
  Autocomplete,
  Box,
} from '@mui/material';
import { Controller, UseFormReturn } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { Patient, Doctor, Diagnosis } from '../../types';

interface MedicalVisitFormData {
  visitDate: Date | null;
  visitTime?: Date | null;
  symptoms?: string;
  treatment?: string;
  prescribedMedication?: string;
  notes?: string;
  patientId: number;
  doctorId: number;
  diagnosisId?: number;
}

interface MedicalVisitFormProps {
  form: UseFormReturn<MedicalVisitFormData>;
  patients: Patient[];
  doctors: Doctor[];
  diagnoses: Diagnosis[];
  isEditing?: boolean;
  userRole: string;
  userId?: number;
}

const MedicalVisitForm: React.FC<MedicalVisitFormProps> = ({
  form: { control, formState: { errors } },
  patients,
  doctors,
  diagnoses,
  isEditing = false,
  userRole,
  userId,
}) => {
  const isPatient = userRole === 'ROLE_PATIENT';
  const isDoctor = userRole === 'ROLE_DOCTOR';

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <Controller
          name="visitDate"
          control={control}
          rules={{ required: 'Visit date is required' }}
          render={({ field }) => (
            <DatePicker
              label="Visit Date"
              value={field.value}
              onChange={(date) => field.onChange(date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.visitDate,
                  helperText: errors.visitDate?.message,
                },
              }}
            />
          )}
        />

        <Controller
          name="visitTime"
          control={control}
          render={({ field }) => (
            <TimePicker
              label="Visit Time"
              value={field.value}
              onChange={(time) => field.onChange(time)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.visitTime,
                  helperText: errors.visitTime?.message,
                },
              }}
            />
          )}
        />

        <Controller
          name="patientId"
          control={control}
          rules={{ required: 'Patient is required' }}
          render={({ field }) => (
            <Autocomplete
              options={patients}
              getOptionLabel={(option) => `${option.name} (${option.egn})`}
              value={patients.find(p => p.id === field.value) || null}
              onChange={(_, value) => field.onChange(value?.id || 0)}
              disabled={isPatient} // Patients can only create visits for themselves
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Patient"
                  error={!!errors.patientId}
                  helperText={errors.patientId?.message}
                />
              )}
            />
          )}
        />

        <Controller
          name="doctorId"
          control={control}
          rules={{ required: 'Doctor is required' }}
          render={({ field }) => (
            <Autocomplete
              options={doctors}
              getOptionLabel={(option) => `${option.name} (${option.specialty})`}
              value={doctors.find(d => d.id === field.value) || null}
              onChange={(_, value) => field.onChange(value?.id || 0)}
              disabled={isDoctor} // Doctors are automatically assigned to their own visits
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Doctor"
                  error={!!errors.doctorId}
                  helperText={errors.doctorId?.message}
                />
              )}
            />
          )}
        />

        <Controller
          name="diagnosisId"
          control={control}
          render={({ field }) => (
            <Autocomplete
              options={diagnoses}
              getOptionLabel={(option) => `${option.code} - ${option.name}`}
              value={diagnoses.find(d => d.id === field.value) || null}
              onChange={(_, value) => field.onChange(value?.id || 0)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Diagnosis (Optional)"
                  error={!!errors.diagnosisId}
                  helperText={errors.diagnosisId?.message}
                />
              )}
            />
          )}
        />

        <Controller
          name="symptoms"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Symptoms"
              fullWidth
              multiline
              rows={3}
              error={!!errors.symptoms}
              helperText={errors.symptoms?.message}
            />
          )}
        />

        <Controller
          name="treatment"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Treatment"
              fullWidth
              multiline
              rows={3}
              error={!!errors.treatment}
              helperText={errors.treatment?.message}
            />
          )}
        />

        <Controller
          name="prescribedMedication"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Prescribed Medication"
              fullWidth
              multiline
              rows={2}
              error={!!errors.prescribedMedication}
              helperText={errors.prescribedMedication?.message}
            />
          )}
        />

        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Notes"
              fullWidth
              multiline
              rows={3}
              error={!!errors.notes}
              helperText={errors.notes?.message}
            />
          )}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default MedicalVisitForm;
export type { MedicalVisitFormData };
