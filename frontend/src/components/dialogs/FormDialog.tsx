import React from 'react';
import { Button } from '@mui/material';
import BaseDialog from './BaseDialog';

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  submitText?: string;
  cancelText?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const FormDialog: React.FC<FormDialogProps> = ({
  open,
  onClose,
  title,
  onSubmit,
  isLoading = false,
  submitText = 'Save',
  cancelText = 'Cancel',
  maxWidth = 'sm',
  children,
}) => {
  const actions = (
    <>
      <Button onClick={onClose} disabled={isLoading}>
        {cancelText}
      </Button>
      <Button
        type="submit"
        variant="contained"
        disabled={isLoading}
        form="form-dialog-form"
      >
        {submitText}
      </Button>
    </>
  );

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={title}
      maxWidth={maxWidth}
      actions={actions}
    >
      <form id="form-dialog-form" onSubmit={onSubmit}>
        {children}
      </form>
    </BaseDialog>
  );
};

export default FormDialog;
