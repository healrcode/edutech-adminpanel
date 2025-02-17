import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
  Button,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Role, UserStatus } from '../../../common/enums';

interface CreateUserDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreateUser: (data: {
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    status: UserStatus;
  }) => void;
}

const CreateUserDrawer: React.FC<CreateUserDrawerProps> = ({
  open,
  onClose,
  onCreateUser
}) => {
  const [formData, setFormData] = React.useState({
    email: '',
    firstName: '',
    lastName: '',
    role: Role.STUDENT,
    status: UserStatus.ACTIVE
  });
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onCreateUser(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      role: Role.STUDENT,
      status: UserStatus.ACTIVE
    });
    setErrors({});
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { width: 400 }
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Create User
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Stack spacing={3}>
          <Box>
            <TextField
              label="Email"
              fullWidth
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={!!errors.email}
              helperText={errors.email}
              size="small"
            />
          </Box>

          <Stack spacing={2}>
            <TextField
              label="First Name"
              fullWidth
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              size="small"
            />
            <TextField
              label="Last Name"
              fullWidth
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              size="small"
            />
          </Stack>

          <FormControl fullWidth size="small">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              value={formData.role}
              label="Role"
              onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
            >
              {Object.values(Role).map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={formData.status}
              label="Status"
              onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
            >
              {Object.values(UserStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
          >
            Create User
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default CreateUserDrawer;
