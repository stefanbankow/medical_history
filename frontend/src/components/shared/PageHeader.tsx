import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

interface PageHeaderProps {
  title: string;
  onAdd?: () => void;
  addButtonText?: string;
  showAddButton?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onAdd,
  addButtonText = 'Add',
  showAddButton = true,
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      {showAddButton && onAdd && (
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAdd}
        >
          {addButtonText}
        </Button>
      )}
    </Box>
  );
};

export default PageHeader;
