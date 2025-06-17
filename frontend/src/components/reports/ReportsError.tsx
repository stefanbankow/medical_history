import React from 'react';
import { Box, Alert, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface ReportsErrorProps {
  error: string;
  onRetry: () => void;
}

const ReportsError: React.FC<ReportsErrorProps> = ({ error, onRetry }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Alert
        severity="error"
        action={
          <Button
            color="inherit"
            size="small"
            startIcon={<Refresh />}
            onClick={onRetry}
          >
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    </Box>
  );
};

export default ReportsError;
