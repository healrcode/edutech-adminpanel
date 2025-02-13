import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Grid,
  Stack,
  Alert
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, subtitle, color = 'primary.main' }) => (
  <Card sx={{ height: '100%' }}>
    <Stack spacing={2} sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: `${color}15`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>
    </Stack>
  </Card>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return 'Admin';
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Stack spacing={3} sx={{ py: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 600, mb: 1 }}>
              Dashboard
            </Typography>
            <Typography color="text.secondary">
              Welcome back, {getDisplayName()}
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            This is a demo dashboard. The stats below are placeholder data.
          </Alert>

          <Grid container spacing={3}>
            {/* Quick Stats */}
            <Grid item xs={12} md={3}>
              <StatCard
                title="Total Users"
                value="256"
                icon={<PeopleIcon />}
                subtitle="Active users"
                color="primary.main"
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <StatCard
                title="Programs"
                value="12"
                icon={<SchoolIcon />}
                subtitle="Active programs"
                color="secondary.main"
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <StatCard
                title="Teachers"
                value="24"
                icon={<PersonIcon />}
                subtitle="Assigned teachers"
                color="success.main"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <StatCard
                title="Enrollments"
                value="1,234"
                icon={<TimelineIcon />}
                subtitle="Total enrollments"
                color="warning.main"
              />
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12}>
              <Card>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  <Typography color="text.secondary">
                    Successfully logged in as: {user?.email}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Layout>
  );
};

export default Dashboard;
