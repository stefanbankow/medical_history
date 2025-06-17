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

interface DiagnosisData {
  diagnosisName: string;
  count: number;
  percentage: number;
}

interface PatientsByDiagnosis {
  id: number;
  diagnosisName: string;
  patientCount: number;
}

interface DiagnosisReportsProps {
  isLoading: boolean;
  mostCommonDiagnoses: DiagnosisData[];
  patientsByDiagnosis: PatientsByDiagnosis[];
}

const DiagnosisReports: React.FC<DiagnosisReportsProps> = ({
  isLoading,
  mostCommonDiagnoses,
  patientsByDiagnosis,
}) => {
  const columns: GridColDef[] = [
    { field: 'diagnosisName', headerName: 'Diagnosis', width: 200 },
    { field: 'patientCount', headerName: 'Patient Count', width: 120, type: 'number' },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Card>
        <CardHeader title="Most Common Diagnoses" />
        <CardContent>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Diagnosis</TableCell>
                    <TableCell align="right">Count</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mostCommonDiagnoses.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.diagnosisName}</TableCell>
                      <TableCell align="right">{item.count}</TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={`${item.percentage}%`} 
                          size="small" 
                          color="primary"
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

      <Card>
        <CardHeader title="Patients by Diagnosis" />
        <CardContent>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <DataGrid
              rows={patientsByDiagnosis}
              columns={columns}
              autoHeight
              hideFooter
              disableRowSelectionOnClick
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default DiagnosisReports;
