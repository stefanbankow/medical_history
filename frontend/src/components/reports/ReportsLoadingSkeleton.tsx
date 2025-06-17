import React from 'react';
import { Box, Skeleton, Paper } from '@mui/material';

const ReportsLoadingSkeleton: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header Skeleton */}
      <Skeleton variant="text" width={300} height={40} sx={{ mb: 3 }} />

      {/* Filter Panel Skeleton */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton variant="rectangular" width={200} height={56} />
          <Skeleton variant="rectangular" width={200} height={56} />
          <Skeleton variant="rectangular" width={200} height={56} />
        </Box>
      </Paper>

      {/* Statistics Cards Skeleton */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
        gap: 3, 
        mb: 3 
      }}>
        {[1, 2, 3, 4].map((item) => (
          <Paper key={item} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Tabs Skeleton */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1, p: 1 }}>
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} variant="rectangular" width={120} height={48} />
            ))}
          </Box>
        </Box>
        
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={300} />
        </Box>
      </Paper>
    </Box>
  );
};

export default ReportsLoadingSkeleton;
