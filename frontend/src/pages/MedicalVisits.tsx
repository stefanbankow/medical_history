import React, { useState } from 'react';
import { Box, Alert, Chip } from '@mui/material';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

import { 
  useGetMedicalVisitsQuery, 
  useGetMedicalVisitsByDoctorQuery,
  useGetMedicalVisitsByPatientQuery,
  useCreateMedicalVisitMutation, 
  useUpdateMedicalVisitMutation, 
  useDeleteMedicalVisitMutation 
} from '../store/medicalVisitsApi';
import { useGetPatientsQuery } from '../store/patientsApi';
import { useGetDoctorsQuery } from '../store/doctorsApi';
import { useGetDiagnosesQuery } from '../store/diagnosesApi';
import { useAuth } from '../utils/auth';
import { MedicalVisit } from '../types';
import PageHeader from '../components/shared/PageHeader';
import DataTable from '../components/shared/DataTable';
import FormDialog from '../components/shared/FormDialog';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import MedicalVisitForm, { MedicalVisitFormData } from '../components/forms/MedicalVisitForm';
import MedicalVisitViewDialog from '../components/dialogs/MedicalVisitViewDialog';

const MedicalVisits: React.FC = () => {
  const { user, isAdmin, isDoctor, isPatient } = useAuth();

  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<MedicalVisit | null>(null);
  const [viewingVisit, setViewingVisit] = useState<MedicalVisit | null>(null);
  const [deletingVisit, setDeletingVisit] = useState<MedicalVisit | null>(null);

  // Use role-specific API calls
  const { 
    data: allVisits = [], 
    isLoading: isLoadingAll, 
    error: errorAll 
  } = useGetMedicalVisitsQuery(undefined, { 
    skip: !isAdmin() 
  });
  
  const { 
    data: doctorVisits = [], 
    isLoading: isLoadingDoctor, 
    error: errorDoctor 
  } = useGetMedicalVisitsByDoctorQuery(user?.doctorId || 0, { 
    skip: !isDoctor() || !user?.doctorId 
  });
  
  const { 
    data: patientVisits = [], 
    isLoading: isLoadingPatient, 
    error: errorPatient 
  } = useGetMedicalVisitsByPatientQuery(user?.patientId || 0, { 
    skip: !isPatient() || !user?.patientId 
  });

  // Get the appropriate data based on role
  const visits = isAdmin() ? allVisits : isDoctor() ? doctorVisits : patientVisits;
  const isLoading = isAdmin() ? isLoadingAll : isDoctor() ? isLoadingDoctor : isLoadingPatient;
  const error = isAdmin() ? errorAll : isDoctor() ? errorDoctor : errorPatient;

  // Load additional data based on role
  const { data: patients = [] } = useGetPatientsQuery(undefined, { 
    skip: isPatient() // Patients don't need patient list
  });
  
  const { data: doctors = [] } = useGetDoctorsQuery(undefined, { 
    skip: false // All roles can see doctors
  });
  
  const { data: diagnoses = [] } = useGetDiagnosesQuery(undefined, { 
    skip: false // All roles need diagnosis list
  });
  const [createVisit, { isLoading: isCreating }] = useCreateMedicalVisitMutation();
  const [updateVisit, { isLoading: isUpdating }] = useUpdateMedicalVisitMutation();
  const [deleteVisit, { isLoading: isDeleting }] = useDeleteMedicalVisitMutation();

  const form = useForm<MedicalVisitFormData>({
    defaultValues: {
      visitDate: null,
      visitTime: null,
      symptoms: '',
      treatment: '',
      prescribedMedication: '',
      notes: '',
      patientId: 0,
      doctorId: user?.doctorId || 0,
      diagnosisId: 0,
    },
  });

  const handleCreate = () => {
    setEditingVisit(null);
    
    // Set default patient and doctor based on user role
    let defaultPatientId = 0;
    let defaultDoctorId = 0;
    
    if (isPatient() && user?.patientId) {
      defaultPatientId = user.patientId;
    } else if (patients.length > 0) {
      defaultPatientId = patients[0].id;
    }
    
    if (isDoctor() && user?.doctorId) {
      defaultDoctorId = user.doctorId;
    } else if (doctors.length > 0) {
      defaultDoctorId = doctors[0].id;
    }
    
    console.log('Setting form defaults:', { defaultPatientId, defaultDoctorId, isPatient: isPatient(), isDoctor: isDoctor() });
    
    form.reset({
      visitDate: new Date(),
      visitTime: null,
      symptoms: '',
      treatment: '',
      prescribedMedication: '',
      notes: '',
      patientId: defaultPatientId,
      doctorId: defaultDoctorId,
      diagnosisId: 0,
    });
    setFormOpen(true);
  };

  const handleEdit = (visit: MedicalVisit) => {
    setEditingVisit(visit);
    form.reset({
      visitDate: new Date(visit.visitDate),
      visitTime: visit.visitTime ? new Date(`1970-01-01T${visit.visitTime}`) : null,
      symptoms: visit.symptoms || '',
      treatment: visit.treatment || '',
      prescribedMedication: visit.prescribedMedication || '',
      notes: visit.notes || '',
      patientId: visit.patientId,
      doctorId: visit.doctorId,
      diagnosisId: visit.diagnosisId || 0,
    });
    setFormOpen(true);
  };

  const handleView = (visit: MedicalVisit) => {
    setViewingVisit(visit);
    setViewOpen(true);
  };

  const handleDelete = (visit: MedicalVisit) => {
    setDeletingVisit(visit);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (data: MedicalVisitFormData) => {
    try {
      console.log('Form data before processing:', data);
      
      // Validate required fields
      if (!data.visitDate) {
        console.error('Visit date is required');
        return;
      }
      
      if (!data.patientId || data.patientId === 0) {
        console.error('Patient selection is required');
        return;
      }
      
      if (!data.doctorId || data.doctorId === 0) {
        console.error('Doctor selection is required');
        return;
      }
      
      const visitData = {
        visitDate: format(data.visitDate, 'yyyy-MM-dd'),
        visitTime: data.visitTime ? format(data.visitTime, 'HH:mm:ss') : undefined,
        symptoms: data.symptoms || '',
        treatment: data.treatment || '',
        prescribedMedication: data.prescribedMedication || '',
        notes: data.notes || '',
        patientId: data.patientId,
        doctorId: data.doctorId,
        diagnosisId: data.diagnosisId && data.diagnosisId > 0 ? data.diagnosisId : undefined,
      };

      console.log('Processed visit data:', visitData);

      if (editingVisit) {
        console.log('Updating visit:', editingVisit.id);
        await updateVisit({ id: editingVisit.id, visit: visitData }).unwrap();
      } else {
        console.log('Creating new visit');
        const result = await createVisit(visitData).unwrap();
        console.log('Visit created successfully:', result);
      }
      setFormOpen(false);
    } catch (error) {
      console.error('Failed to save visit:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingVisit) {
      try {
        await deleteVisit(deletingVisit.id).unwrap();
        setDeleteOpen(false);
        setDeletingVisit(null);
      } catch (error) {
        console.error('Failed to delete visit:', error);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'visitDate',
      headerName: 'Date',
      width: 120,
      valueFormatter: (value) => {
        if (!value) return '';
        return format(new Date(value), 'dd/MM/yyyy');
      },
    },
    { field: 'visitTime', headerName: 'Time', width: 100 },
    { field: 'patientName', headerName: 'Patient', width: 150 },
    { field: 'doctorName', headerName: 'Doctor', width: 150 },
    { field: 'diagnosisName', headerName: 'Diagnosis', width: 200 },
    {
      field: 'sickLeave',
      headerName: 'Sick Leave',
      width: 120,
      renderCell: (params) => {
        if (!params.value) return null;
        return (
          <Chip
            label={`${params.value.durationDays} days`}
            color="warning"
            size="small"
          />
        );
      },
    },
    {
      field: 'actions',
      type: 'actions' as const,
      headerName: 'Actions',
      width: 150,
      getActions: (params: any) => [
        <GridActionsCellItem
          key="view"
          icon={<Visibility />}
          label="View"
          onClick={() => handleView(params.row)}
        />,
        ...(isAdmin() || isDoctor() ? [
          <GridActionsCellItem
            key="edit"
            icon={<Edit />}
            label="Edit"
            onClick={() => handleEdit(params.row)}
          />,
        ] : []),
        ...(isAdmin() ? [
          <GridActionsCellItem
            key="delete"
            icon={<Delete />}
            label="Delete"
            onClick={() => handleDelete(params.row)}
          />
        ] : []),
      ],
    },
  ];

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load medical visits</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title={isPatient() ? "My Medical Visits" : "Medical Visits"}
        onAdd={isAdmin() || isDoctor() || isPatient() ? handleCreate : undefined}
        addButtonText={isPatient() ? "Request Visit" : "Add Visit"}
        showAddButton={isAdmin() || isDoctor() || isPatient()}
      />

      <DataTable
        rows={visits}
        columns={columns}
        loading={isLoading}
      />

      {/* Form Dialog */}
      <FormDialog
        open={formOpen}
        title={editingVisit ? 'Edit Medical Visit' : 'Add New Medical Visit'}
        onClose={() => setFormOpen(false)}
        onSubmit={form.handleSubmit(handleFormSubmit)}
        loading={isCreating || isUpdating}
        submitText={editingVisit ? 'Update' : 'Create'}
      >
        <MedicalVisitForm
          form={form}
          patients={patients}
          doctors={doctors}
          diagnoses={diagnoses}
          isEditing={!!editingVisit}
          userRole={user?.roles[0] || ''}
          userId={user?.doctorId || user?.patientId}
        />
      </FormDialog>

      {/* View Dialog */}
      <MedicalVisitViewDialog
        visit={viewingVisit}
        open={viewOpen}
        onClose={() => setViewOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteOpen}
        title="Confirm Delete"
        message={`Are you sure you want to delete this medical visit?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
        loading={isDeleting}
      />
    </Box>
  );
};

export default MedicalVisits;
