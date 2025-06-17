import React from 'react';
import {
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface FilterPanelProps {
  dateFrom: Date | null;
  dateTo: Date | null;
  selectedDoctor: number;
  doctors: Array<{ id: number; name: string; specialty: string }>;
  showDoctorFilter?: boolean;
  onDateFromChange: (date: Date | null) => void;
  onDateToChange: (date: Date | null) => void;
  onDoctorChange: (doctorId: number) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  dateFrom,
  dateTo,
  selectedDoctor,
  doctors,
  showDoctorFilter = true,
  onDateFromChange,
  onDateToChange,
  onDoctorChange,
}) => {
  const handleDoctorChange = (event: SelectChangeEvent<number>) => {
    onDoctorChange(event.target.value as number);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: showDoctorFilter 
            ? { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }
            : { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
          alignItems: 'center'
        }}>
          <DatePicker
            label="From Date"
            value={dateFrom}
            onChange={onDateFromChange}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small',
              },
            }}
          />
          
          <DatePicker
            label="To Date"
            value={dateTo}
            onChange={onDateToChange}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small',
              },
            }}
          />

          {showDoctorFilter && (
            <FormControl fullWidth size="small">
              <InputLabel>Doctor Filter</InputLabel>
              <Select
                value={selectedDoctor}
                label="Doctor Filter"
                onChange={handleDoctorChange}
              >
                <MenuItem value={0}>All Doctors</MenuItem>
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {doctor.name} ({doctor.specialty})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default FilterPanel;
