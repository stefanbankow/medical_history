import React from 'react';
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  Box,
} from '@mui/material';
import { Controller, UseFormReturn } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { Doctor } from '../../types';

interface PatientFormData {
  name: string;
  egn: string;
  healthInsurancePaid: boolean;
  lastInsurancePaymentDate?: Date | null;
  familyDoctorId: number;
}

interface PatientFormProps {
  form: UseFormReturn<PatientFormData>;
  doctors: Doctor[];
  isEditing?: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({
  form: { control, formState: { errors } },
  doctors,
  isEditing = false,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <Controller
          name="name"
          control={control}
          rules={{ 
            required: 'Name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Full Name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />

        <Controller
          name="egn"
          control={control}
          rules={{ 
            required: 'EGN is required',
            pattern: {
              value: /^\d{10}$/,
              message: 'EGN must be exactly 10 digits'
            }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="EGN"
              fullWidth
              error={!!errors.egn}
              helperText={errors.egn?.message}
              disabled={isEditing} // EGN shouldn't be changed after creation
            />
          )}
        />

        <Controller
          name="familyDoctorId"
          control={control}
          rules={{ required: 'Family doctor is required' }}
          render={({ field }) => (
            <Autocomplete
              options={doctors}
              getOptionLabel={(option) => `${option.name} (${option.specialty})`}
              value={doctors.find(d => d.id === field.value) || null}
              onChange={(_, value) => field.onChange(value?.id || 0)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Family Doctor"
                  error={!!errors.familyDoctorId}
                  helperText={errors.familyDoctorId?.message}
                />
              )}
            />
          )}
        />

        <Controller
          name="healthInsurancePaid"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label="Health Insurance Paid"
            />
          )}
        />

        <Controller
          name="lastInsurancePaymentDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Last Insurance Payment Date"
              value={field.value}
              onChange={(date) => field.onChange(date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.lastInsurancePaymentDate,
                  helperText: errors.lastInsurancePaymentDate?.message,
                },
              }}
            />
          )}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default PatientForm;
export type { PatientFormData };
