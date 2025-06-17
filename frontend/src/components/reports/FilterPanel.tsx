import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  TextField,
  Button,
  Chip,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FilterAlt, Clear } from '@mui/icons-material';

interface FilterPanelProps {
  dateFrom: Date | null;
  dateTo: Date | null;
  selectedDoctor: number;
  doctors: Array<{ id: number; name: string; specialty: string }>;
  showDoctorFilter?: boolean;
  onDateFromChange: (date: Date | null) => void;
  onDateToChange: (date: Date | null) => void;
  onDoctorChange: (doctorId: number) => void;
  onClearFilters?: () => void;
  patientEgn?: string;
  onPatientEgnChange?: (egn: string) => void;
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
  onClearFilters,
  patientEgn = '',
  onPatientEgnChange,
}) => {
  const handleDoctorChange = (event: SelectChangeEvent<number>) => {
    onDoctorChange(event.target.value as number);
  };

  const hasActiveFilters = !!(
    dateFrom ||
    dateTo ||
    selectedDoctor ||
    (patientEgn && patientEgn.length > 0)
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterAlt />
              <Typography variant="h6">Report Filters</Typography>
              {hasActiveFilters && (
                <Chip label="Filters Active" color="primary" size="small" />
              )}
            </Box>
          }
        />
        <CardContent>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: showDoctorFilter 
              ? { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' }
              : { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 2,
            mb: 2
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

            {onPatientEgnChange && (
              <TextField
                label="Patient EGN"
                value={patientEgn}
                onChange={(e) => onPatientEgnChange(e.target.value)}
                fullWidth
                size="small"
                placeholder="Enter patient EGN"
              />
            )}

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

          {onClearFilters && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={onClearFilters}
                disabled={!hasActiveFilters}
                size="small"
              >
                Clear Filters
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default FilterPanel;
