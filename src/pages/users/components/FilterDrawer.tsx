import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
  Badge
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Role, UserStatus } from '../../../common/enums';

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: {
    role?: Role;
    status?: UserStatus;
  };
  onApplyFilters: (filters: { role?: Role; status?: UserStatus }) => void;
  activeFilterCount: number;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  open,
  onClose,
  filters,
  onApplyFilters,
  activeFilterCount
}) => {
  const [localFilters, setLocalFilters] = React.useState(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {
      role: undefined,
      status: undefined
    };
    setLocalFilters(clearedFilters);
    onApplyFilters(clearedFilters);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: 320 }
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Filters
            {activeFilterCount > 0 && (
              <Badge
                badgeContent={activeFilterCount}
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel id="role-filter-label">Role</InputLabel>
            <Select
              labelId="role-filter-label"
              id="role-filter"
              value={localFilters.role || ''}
              label="Role"
              onChange={(e) => setLocalFilters({ 
                ...localFilters, 
                role: e.target.value as Role || undefined 
              })}
            >
              <MenuItem value="">All</MenuItem>
              {Object.values(Role).map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={localFilters.status || ''}
              label="Status"
              onChange={(e) => setLocalFilters({ 
                ...localFilters, 
                status: e.target.value as UserStatus || undefined 
              })}
            >
              <MenuItem value="">All</MenuItem>
              {Object.values(UserStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleClear}
              disabled={!activeFilterCount}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleApply}
            >
              Apply Filters
            </Button>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default FilterDrawer;
