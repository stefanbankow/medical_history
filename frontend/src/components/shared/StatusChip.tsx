import React from 'react';
import { Chip } from '@mui/material';

interface StatusChipProps {
  value: boolean;
  trueLabel?: string;
  falseLabel?: string;
  trueColor?: 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary';
  falseColor?: 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary';
}

const StatusChip: React.FC<StatusChipProps> = ({
  value,
  trueLabel = 'Active',
  falseLabel = 'Inactive',
  trueColor = 'success',
  falseColor = 'error',
}) => {
  return (
    <Chip
      label={value ? trueLabel : falseLabel}
      color={value ? trueColor : falseColor}
      size="small"
    />
  );
};

export default StatusChip;
