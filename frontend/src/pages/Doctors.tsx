import React, { useState } from 'react';
import { Box, Alert, Chip, Tooltip } from '@mui/material';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useGetDoctorsQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} from '../store/doctorsApi';
import { Doctor } from '../types';
import { doctorValidationSchema } from '../utils/validation';
import { useAuth } from '../utils/auth';
import PageHeader from '../components/shared/PageHeader';
import DataTable from '../components/shared/DataTable';
import FormDialog from '../components/shared/FormDialog';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import DoctorForm from '../components/forms/DoctorForm';
import DoctorViewDialog from '../components/dialogs/DoctorViewDialog';

interface DoctorFormData {
  identificationNumber: string;
  name: string;
  specialty: string;
  isFamilyDoctor: boolean;
}

const Doctors: React.FC = () => {
  const { data: doctors = [], isLoading, error } = useGetDoctorsQuery();
  const [createDoctor] = useCreateDoctorMutation();
  const [updateDoctor] = useUpdateDoctorMutation();
  const [deleteDoctor] = useDeleteDoctorMutation();
  
  const { canEditAllData, canViewAllData, isPatient } = useAuth();
  
  const [open, setOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [viewingDoctor, setViewingDoctor] = useState<Doctor | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DoctorFormData>({
    resolver: yupResolver(doctorValidationSchema),
    defaultValues: {
      identificationNumber: '',
      name: '',
      specialty: '',
      isFamilyDoctor: false,
    },
  });

  const handleOpenDialog = (doctor?: Doctor) => {
    if (doctor) {
      setEditingDoctor(doctor);
      reset({
        identificationNumber: doctor.identificationNumber,
        name: doctor.name,
        specialty: doctor.specialty,
        isFamilyDoctor: doctor.isFamilyDoctor,
      });
    } else {
      setEditingDoctor(null);
      reset({
        identificationNumber: '',
        name: '',
        specialty: '',
        isFamilyDoctor: false,
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingDoctor(null);
    reset();
  };

  const onSubmit = async (data: DoctorFormData) => {
    try {
      if (editingDoctor) {
        await updateDoctor({ id: editingDoctor.id, doctor: data }).unwrap();
      } else {
        await createDoctor(data).unwrap();
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save doctor:', error);
    }
  };

  const handleDelete = async () => {
    if (doctorToDelete) {
      try {
        await deleteDoctor(doctorToDelete.id).unwrap();
        setDeleteDialogOpen(false);
        setDoctorToDelete(null);
      } catch (error) {
        console.error('Failed to delete doctor:', error);
      }
    }
  };

  const handleView = (doctor: Doctor) => {
    setViewingDoctor(doctor);
  };

  const columns: GridColDef[] = [
    {
      field: 'identificationNumber',
      headerName: 'ID Number',
      width: 150,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      flex: 1,
    },
    {
      field: 'specialty',
      headerName: 'Specialty',
      width: 180,
    },
    {
      field: 'isFamilyDoctor',
      headerName: 'Family Doctor',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Yes' : 'No'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    // Hide patient and visit counts from patients
    ...(isPatient() ? [] : [
      {
        field: 'patientCount',
        headerName: 'Patients',
        width: 100,
        type: 'number' as const,
      },
      {
        field: 'visitCount',
        headerName: 'Visits',
        width: 100,
        type: 'number' as const,
      },
    ]),
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 160,
      getActions: (params) => {
        const actions = [
          <GridActionsCellItem
            key="view"
            icon={
              <Tooltip title="View Details">
                <ViewIcon />
              </Tooltip>
            }
            label="View"
            onClick={() => handleView(params.row)}
          />,
        ];

        // Only admins can edit/delete doctors
        if (canEditAllData()) {
          actions.push(
            <GridActionsCellItem
              key="edit"
              icon={
                <Tooltip title="Edit Doctor">
                  <EditIcon />
                </Tooltip>
              }
              label="Edit"
              onClick={() => handleOpenDialog(params.row)}
            />,
            <GridActionsCellItem
              key="delete"
              icon={
                <Tooltip title="Delete Doctor">
                  <DeleteIcon />
                </Tooltip>
              }
              label="Delete"
              onClick={() => {
                setDoctorToDelete(params.row);
                setDeleteDialogOpen(true);
              }}
            />
          );
        }

        return actions;
      },
    },
  ];

  if (!canViewAllData() && !isPatient()) {
    return (
      <Box>
        <Alert severity="warning">
          You don't have permission to view this page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={isPatient() ? "Doctors" : "Doctors Management"}
        onAdd={canEditAllData() ? () => handleOpenDialog() : undefined}
        addButtonText="Add Doctor"
        showAddButton={canEditAllData()}
      />

      <DataTable
        rows={doctors}
        columns={columns}
        loading={isLoading}
        error={!!error}
        showActions={false} // We have custom actions in columns
      />

      {/* Add/Edit Dialog */}
      <FormDialog
        open={open}
        onClose={handleCloseDialog}
        title={editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
        onSubmit={handleSubmit(onSubmit)}
        loading={false}
        submitText={editingDoctor ? 'Update' : 'Create'}
      >
        <DoctorForm
          control={control}
          errors={errors}
          isEditMode={!!editingDoctor}
        />
      </FormDialog>

      {/* View Details Dialog */}
      <DoctorViewDialog
        open={!!viewingDoctor}
        onClose={() => setViewingDoctor(null)}
        doctor={viewingDoctor}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirm Delete"
        message={`Are you sure you want to delete Dr. ${doctorToDelete?.name}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmColor="error"
        confirmText="Delete"
      />
    </Box>
  );
};

export default Doctors;
