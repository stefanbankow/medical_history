import React from 'react';
import {
  TextField,
  Box,
  InputAdornment,
} from '@mui/material';
import { Controller, UseFormReturn } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export interface SickLeaveFormData {
  startDate: Date | null;
  durationDays: number;
  reason?: string;
  medicalVisitId: number;
}

interface SickLeaveFormProps {
  form: UseFormReturn<SickLeaveFormData>;
  isEditing?: boolean;
  medicalVisitId: number;
}

const SickLeaveForm: React.FC<SickLeaveFormProps> = ({
  form: { control, formState: { errors }, watch },
  isEditing = false,
  medicalVisitId,
}) => {
  const startDate = watch('startDate');
  const durationDays = watch('durationDays');

  // Calculate end date
  const endDate = React.useMemo(() => {
    if (startDate && durationDays > 0) {
      const end = new Date(startDate);
      end.setDate(end.getDate() + durationDays - 1);
      return end;
    }
    return null;
  }, [startDate, durationDays]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <Controller
          name="startDate"
          control={control}
          rules={{ required: 'Start date is required' }}
          render={({ field }) => (
            <DatePicker
              label="Start Date"
              value={field.value}
              onChange={(date) => field.onChange(date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.startDate,
                  helperText: errors.startDate?.message,
                },
              }}
            />
          )}
        />

        <Controller
          name="durationDays"
          control={control}
          rules={{ 
            required: 'Duration is required',
            min: { value: 1, message: 'Duration must be at least 1 day' },
            max: { value: 365, message: 'Duration cannot exceed 365 days' }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Duration"
              type="number"
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">days</InputAdornment>,
              }}
              error={!!errors.durationDays}
              helperText={errors.durationDays?.message}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
            />
          )}
        />

        {endDate && (
          <TextField
            label="End Date"
            value={endDate.toLocaleDateString()}
            fullWidth
            disabled
            helperText="Calculated automatically based on start date and duration"
          />
        )}

        <Controller
          name="reason"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Reason (Optional)"
              fullWidth
              multiline
              rows={3}
              error={!!errors.reason}
              helperText={errors.reason?.message}
            />
          )}
        />

        <TextField
          label="Medical Visit ID"
          value={medicalVisitId}
          fullWidth
          disabled
          helperText="Associated medical visit"
        />
      </Box>
    </LocalizationProvider>
  );
};

export default SickLeaveForm;
