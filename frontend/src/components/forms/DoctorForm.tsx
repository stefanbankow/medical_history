import React from 'react';
import { TextField, FormControlLabel, Switch, Box } from '@mui/material';
import { Controller, Control, FieldErrors } from 'react-hook-form';

interface DoctorFormData {
  identificationNumber: string;
  name: string;
  specialty: string;
  isFamilyDoctor: boolean;
}

interface DoctorFormProps {
  control: Control<DoctorFormData>;
  errors: FieldErrors<DoctorFormData>;
  isEditMode?: boolean;
}

const DoctorForm: React.FC<DoctorFormProps> = ({
  control,
  errors,
  isEditMode = false,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Controller
        name="identificationNumber"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Identification Number"
            fullWidth
            margin="normal"
            error={!!errors.identificationNumber}
            helperText={errors.identificationNumber?.message}
            disabled={isEditMode} // ID cannot be changed when editing
          />
        )}
      />

      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Full Name"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />

      <Controller
        name="specialty"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Medical Specialty"
            fullWidth
            margin="normal"
            error={!!errors.specialty}
            helperText={errors.specialty?.message}
          />
        )}
      />

      <Controller
        name="isFamilyDoctor"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
            label="Is Family Doctor"
            sx={{ mt: 2 }}
          />
        )}
      />
    </Box>
  );
};

export default DoctorForm;
