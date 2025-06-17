import React, { useState } from 'react';
import { Box, Alert, Chip } from '@mui/material';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit, Delete, PersonAdd, Visibility } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

import { 
  useGetPatientsQuery,
  useGetPatientsByFamilyDoctorQuery, 
  useCreatePatientMutation, 
  useUpdatePatientMutation, 
  useDeletePatientMutation 
} from '../store/patientsApi';
import { useGetDoctorsQuery } from '../store/doctorsApi';
import { useAuth } from '../utils/auth';
import { Patient } from '../types';
import PageHeader from '../components/shared/PageHeader';
import DataTable from '../components/shared/DataTable';
import FormDialog from '../components/shared/FormDialog';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import PatientForm, { PatientFormData } from '../components/forms/PatientForm';
import PatientViewDialog from '../components/dialogs/PatientViewDialog';

const Patients: React.FC = () => {
  const { user, isAdmin, isDoctor } = useAuth();

  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);

  // Use role-specific API calls
  const { 
    data: allPatients = [], 
    isLoading: isLoadingAll, 
    error: errorAll 
  } = useGetPatientsQuery(undefined, { 
    skip: !isAdmin() 
  });
  
  const { 
    data: doctorPatients = [], 
    isLoading: isLoadingDoctor, 
    error: errorDoctor 
  } = useGetPatientsByFamilyDoctorQuery(user?.doctorId || 0, { 
    skip: !isDoctor() || !user?.doctorId 
  });

  // Get the appropriate data based on role
  const patients = isAdmin() ? allPatients : isDoctor() ? doctorPatients : [];
  const isLoading = isAdmin() ? isLoadingAll : isDoctor() ? isLoadingDoctor : false;
  const error = isAdmin() ? errorAll : isDoctor() ? errorDoctor : null;

  const { data: doctors = [] } = useGetDoctorsQuery();
  const [createPatient, { isLoading: isCreating }] = useCreatePatientMutation();
  const [updatePatient, { isLoading: isUpdating }] = useUpdatePatientMutation();
  const [deletePatient, { isLoading: isDeleting }] = useDeletePatientMutation();

  const form = useForm<PatientFormData>({
    defaultValues: {
      name: '',
      egn: '',
      healthInsurancePaid: false,
      lastInsurancePaymentDate: null,
      familyDoctorId: 0,
    },
  });

  const handleCreate = () => {
    setEditingPatient(null);
    form.reset({
      name: '',
      egn: '',
      healthInsurancePaid: false,
      lastInsurancePaymentDate: null,
      familyDoctorId: user?.doctorId || 0,
    });
    setFormOpen(true);
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    form.reset({
      name: patient.name,
      egn: patient.egn,
      healthInsurancePaid: patient.healthInsurancePaid,
      lastInsurancePaymentDate: patient.lastInsurancePaymentDate ? new Date(patient.lastInsurancePaymentDate) : null,
      familyDoctorId: patient.familyDoctorId,
    });
    setFormOpen(true);
  };

  const handleView = (patient: Patient) => {
    setViewingPatient(patient);
    setViewOpen(true);
  };

  const handleDelete = (patient: Patient) => {
    setDeletingPatient(patient);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (data: PatientFormData) => {
    try {
      const patientData = {
        ...data,
        lastInsurancePaymentDate: data.lastInsurancePaymentDate 
          ? format(data.lastInsurancePaymentDate, 'yyyy-MM-dd')
          : undefined,
      };

      if (editingPatient) {
        await updatePatient({ id: editingPatient.id, patient: patientData }).unwrap();
      } else {
        await createPatient(patientData).unwrap();
      }
      setFormOpen(false);
    } catch (error) {
      console.error('Failed to save patient:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingPatient) {
      try {
        await deletePatient(deletingPatient.id).unwrap();
        setDeleteOpen(false);
        setDeletingPatient(null);
      } catch (error) {
        console.error('Failed to delete patient:', error);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'egn', headerName: 'EGN', width: 120 },
    {
      field: 'healthInsurancePaid',
      headerName: 'Insurance Status',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Paid' : 'Unpaid'}
          color={params.value ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'lastInsurancePaymentDate',
      headerName: 'Last Payment',
      width: 120,
      valueFormatter: (value) => {
        if (!value) return 'N/A';
        return format(new Date(value), 'dd/MM/yyyy');
      },
    },
    {
      field: 'healthInsuranceValid',
      headerName: 'Valid Insurance',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Valid' : 'Invalid'}
          color={params.value ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
    { field: 'familyDoctorName', headerName: 'Family Doctor', width: 180 },
    ...(isAdmin() || isDoctor() ? [{
      field: 'actions',
      type: 'actions' as const,
      headerName: 'Actions',
      width: 120,
      getActions: (params: any) => [
        <GridActionsCellItem
          key="view"
          icon={<Visibility />}
          label="View"
          onClick={() => handleView(params.row)}
        />,
        <GridActionsCellItem
          key="edit"
          icon={<Edit />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
        />,
        ...(isAdmin() ? [
          <GridActionsCellItem
            key="delete"
            icon={<Delete />}
            label="Delete"
            onClick={() => handleDelete(params.row)}
          />
        ] : []),
      ],
    }] : []),
  ];

  if (!isAdmin() && !isDoctor()) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">You don't have permission to access this page.</Alert>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load patients</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Patients"
        onAdd={isAdmin() || isDoctor() ? handleCreate : undefined}
        addButtonText="Add Patient"
        showAddButton={isAdmin() || isDoctor()}
      />

      <DataTable
        rows={patients}
        columns={columns}
        loading={isLoading}
      />

      {/* Form Dialog */}
      <FormDialog
        open={formOpen}
        title={editingPatient ? 'Edit Patient' : 'Add New Patient'}
        onClose={() => setFormOpen(false)}
        onSubmit={form.handleSubmit(handleFormSubmit)}
        loading={isCreating || isUpdating}
        submitText={editingPatient ? 'Update' : 'Create'}
      >
        <PatientForm
          form={form}
          doctors={doctors}
          isEditing={!!editingPatient}
        />
      </FormDialog>

      {/* View Dialog */}
      <PatientViewDialog
        patient={viewingPatient}
        open={viewOpen}
        onClose={() => setViewOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteOpen}
        title="Confirm Delete"
        message={`Are you sure you want to delete patient "${deletingPatient?.name}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
        loading={isDeleting}
      />
    </Box>
  );
};

export default Patients;
