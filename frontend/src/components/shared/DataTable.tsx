import React from 'react';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit, Delete } from '@mui/icons-material';
import { Box, Alert } from '@mui/material';

interface DataTableProps {
  rows: any[];
  columns: GridColDef[];
  loading?: boolean;
  error?: boolean;
  errorMessage?: string;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  showActions?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  height?: number;
}

const DataTable: React.FC<DataTableProps> = ({
  rows,
  columns,
  loading = false,
  error = false,
  errorMessage = 'Failed to load data',
  onEdit,
  onDelete,
  showActions = true,
  showEdit = true,
  showDelete = true,
  height = 600,
}) => {
  const actionsColumn: GridColDef = {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 120,
    getActions: (params) => {
      const actions = [];
      if (showEdit && onEdit) {
        actions.push(
          <GridActionsCellItem
            key="edit"
            icon={<Edit />}
            label="Edit"
            onClick={() => onEdit(params.row)}
          />
        );
      }
      if (showDelete && onDelete) {
        actions.push(
          <GridActionsCellItem
            key="delete"
            icon={<Delete />}
            label="Delete"
            onClick={() => onDelete(params.row)}
          />
        );
      }
      return actions;
    },
  };

  const finalColumns = showActions && (onEdit || onDelete) 
    ? [...columns, actionsColumn] 
    : columns;

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{errorMessage}</Alert>
      </Box>
    );
  }

  return (
    <DataGrid
      rows={rows}
      columns={finalColumns}
      pageSizeOptions={[5, 10, 25]}
      loading={loading}
      disableRowSelectionOnClick
      initialState={{
        pagination: {
          paginationModel: { pageSize: 10 },
        },
      }}
      sx={{ height }}
    />
  );
};

export default DataTable;
