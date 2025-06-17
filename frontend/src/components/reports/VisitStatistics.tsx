import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { format } from 'date-fns';

interface VisitByDateRange {
  id: number;
  visitDate: string;
  visitCount: number;
  uniquePatients: number;
  uniqueDoctors: number;
  sickLeavesIssued: number;
}

interface PeakVisitHour {
  hour: number;
  count: number;
  percentage: number;
}

interface VisitStatisticsProps {
  isLoading: boolean;
  visitsByDateRange: VisitByDateRange[];
  peakVisitHours: PeakVisitHour[];
}

const VisitStatistics: React.FC<VisitStatisticsProps> = ({
  isLoading,
  visitsByDateRange,
  peakVisitHours,
}) => {
  const columns: GridColDef[] = [
    { 
      field: 'visitDate', 
      headerName: 'Date', 
      width: 120,
      valueFormatter: (value) => value ? format(new Date(value), 'dd/MM/yyyy') : ''
    },
    { field: 'visitCount', headerName: 'Visits', width: 100, type: 'number' },
    { field: 'uniquePatients', headerName: 'Unique Patients', width: 150, type: 'number' },
    { field: 'uniqueDoctors', headerName: 'Unique Doctors', width: 150, type: 'number' },
    { field: 'sickLeavesIssued', headerName: 'Sick Leaves', width: 120, type: 'number' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Card>
        <CardHeader title="Visit Statistics by Date Range" />
        <CardContent>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <DataGrid
              rows={visitsByDateRange}
              columns={columns}
              autoHeight
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
            />
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Card>
          <CardHeader title="Peak Visit Hours" />
          <CardContent>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Hour</TableCell>
                      <TableCell align="right">Visit Count</TableCell>
                      <TableCell align="right">Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {peakVisitHours.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.hour}:00</TableCell>
                        <TableCell align="right">{item.count}</TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={`${item.percentage}%`}
                            size="small"
                            color={item.percentage > 10 ? 'primary' : 'default'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default VisitStatistics;
