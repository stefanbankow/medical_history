import React, { useState } from 'react';
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Visibility, TrendingUp, Assessment } from '@mui/icons-material';
import { 
  useGetPatientsByDiagnosisQuery,
} from '../../store/reportsApi';

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
  const [selectedDiagnosisId, setSelectedDiagnosisId] = useState<number | null>(null);
  const [viewPatientsOpen, setViewPatientsOpen] = useState(false);

  // Fetch patients for selected diagnosis
  const { 
    data: patientsForDiagnosis = [], 
    isLoading: isLoadingPatients 
  } = useGetPatientsByDiagnosisQuery(selectedDiagnosisId!, {
    skip: selectedDiagnosisId === null,
  });

  const handleViewPatients = (diagnosisId: number) => {
    setSelectedDiagnosisId(diagnosisId);
    setViewPatientsOpen(true);
  };

  const columns: GridColDef[] = [
    { field: 'diagnosisName', headerName: 'Diagnosis', width: 250 },
    { field: 'patientCount', headerName: 'Patient Count', width: 130, type: 'number' },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          key="view"
          icon={<Visibility />}
          label="View Patients"
          onClick={() => handleViewPatients(params.row.id)}
        />,
      ],
    },
  ];

  const selectedDiagnosisData = patientsByDiagnosis.find(d => d.id === selectedDiagnosisId);

  return (
    <>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Card>
          <CardHeader 
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp />
                Most Common Diagnoses
              </Box>
            } 
          />
          <CardContent>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
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
                    {mostCommonDiagnoses.slice(0, 10).map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {item.diagnosisName}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={item.count} 
                            size="small" 
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={`${item.percentage.toFixed(1)}%`} 
                            size="small" 
                            color="success"
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
          <CardHeader 
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assessment />
                Patients by Diagnosis
              </Box>
            } 
          />
          <CardContent>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <DataGrid
                rows={patientsByDiagnosis}
                columns={columns}
                autoHeight
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
              />
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Patient List Dialog */}
      <Dialog 
        open={viewPatientsOpen} 
        onClose={() => setViewPatientsOpen(false)}
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            Patients with {selectedDiagnosisData?.diagnosisName}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {isLoadingPatients ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {patientsForDiagnosis.map((patient) => (
                <ListItem key={patient.id} divider>
                  <ListItemText
                    primary={patient.name}
                    secondary={`EGN: ${patient.egn} | Family Doctor: ${patient.familyDoctorName || 'Not assigned'}`}
                  />
                </ListItem>
              ))}
              {patientsForDiagnosis.length === 0 && (
                <ListItem>
                  <ListItemText primary="No patients found for this diagnosis" />
                </ListItem>
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewPatientsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DiagnosisReports;
