import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Grid,
  Paper,
  Stack
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <Stack spacing={2} sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'primary.lighter',
            color: 'primary.main',
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
  return (
    <Layout>
      <Container maxWidth="lg">
        <Stack spacing={3} sx={{ py: 4 }}>
          <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 600 }}>
            Dashboard
          </Typography>

          <Grid container spacing={3}>
            {/* Quick Stats */}
            <Grid item xs={12} md={3}>
              <StatCard
                title="Total Users"
                value="0"
                icon={<PeopleIcon />}
                subtitle="Active users"
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <StatCard
                title="Programs"
                value="0"
                icon={<SchoolIcon />}
                subtitle="Active programs"
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <StatCard
                title="Teachers"
                value="0"
                icon={<PersonIcon />}
                subtitle="Assigned teachers"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <StatCard
                title="Enrollments"
                value="0"
                icon={<TimelineIcon />}
                subtitle="Total enrollments"
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
                    No recent activity to display
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
