import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { enrollmentsApi } from '../../api/enrollments';
import Layout from '../../components/layout/Layout';

interface EnrollmentStats {
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  averageCompletionRate: number;
}

const EnrollmentsAnalytics: React.FC = () => {
  const [stats, setStats] = useState<EnrollmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get overall stats without any filters
        const stats = await enrollmentsApi.getEnrollmentStats();
        setStats(stats);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching enrollment stats:', err);
        setError(err?.response?.data?.error?.message || err.message || 'Failed to fetch enrollment statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box p={3}>
          <Alert severity="error">{error}</Alert>
        </Box>
      );
    }

    return (
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Enrollment Analytics
        </Typography>

        <Grid container spacing={3} mt={1}>
          {/* Total Enrollments */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Enrollments
                </Typography>
                <Typography variant="h3">
                  {stats?.totalEnrollments || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Active Enrollments */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Enrollments
                </Typography>
                <Typography variant="h3">
                  {stats?.activeEnrollments || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Completed Enrollments */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Completed Enrollments
                </Typography>
                <Typography variant="h3">
                  {stats?.completedEnrollments || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Average Completion Rate */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Avg. Completion Rate
                </Typography>
                <Typography variant="h3">
                  {stats ? `${Math.round(stats.averageCompletionRate)}%` : '0%'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* TODO: Add charts for trends */}
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Course Performance
          </Typography>
          {/* TODO: Add course-specific stats and charts */}
        </Box>

        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Certificate Analytics
          </Typography>
          {/* TODO: Add certificate stats and charts */}
        </Box>
      </Box>
    );
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
};

export default EnrollmentsAnalytics;
