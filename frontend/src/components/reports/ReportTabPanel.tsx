import React from 'react';
import { Box } from '@mui/material';

interface ReportTabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const ReportTabPanel: React.FC<ReportTabPanelProps> = ({
  children,
  value,
  index,
  ...other
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export default ReportTabPanel;
