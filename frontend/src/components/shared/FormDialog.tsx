import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@mui/material';

interface FormDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const FormDialog: React.FC<FormDialogProps> = ({
  open,
  title,
  onClose,
  onSubmit,
  children,
  loading = false,
  submitText = 'Save',
  cancelText = 'Cancel',
  maxWidth = 'sm',
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <form onSubmit={onSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {submitText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormDialog;
