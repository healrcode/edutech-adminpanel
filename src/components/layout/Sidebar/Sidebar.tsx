import React from 'react';
import {
  Box,
  Drawer,
  List,
  IconButton,
  useTheme,
  Typography,
  useMediaQuery
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { SvgIconComponent } from '@mui/icons-material';
import SidebarItem from './SidebarItem';
import SidebarGroup from './SidebarGroup';

interface NavItem {
  title: string;
  path: string;
  icon?: SvgIconComponent;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: DashboardIcon
  },
  {
    title: 'User Management',
    path: '/users',
    icon: PeopleIcon
  },
  {
    title: 'Courses',
    path: '/courses',
    icon: SchoolIcon
  },
  {
    title: 'Enrollment Analytics',
    path: '/enrollments',
    icon: AnalyticsIcon
  }
];

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  variant?: 'permanent' | 'persistent' | 'temporary';
}

const SIDEBAR_WIDTH = 280;
const COLLAPSED_WIDTH = 72;

const Sidebar: React.FC<SidebarProps> = ({
  open,
  onToggle,
  variant = 'permanent'
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const renderNavItems = (items: NavItem[], depth: number = 0) => {
    return items.map((item) => {
      if (item.children) {
        return (
          <SidebarGroup
            key={item.path}
            title={item.title}
            icon={item.icon}
            items={item.children}
            depth={depth}
            isCollapsed={!open}
          />
        );
      }

      return (
        <SidebarItem
          key={item.path}
          title={item.title}
          path={item.path}
          icon={item.icon}
          depth={depth}
          isCollapsed={!open}
        />
      );
    });
  };

  const drawerContent = (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          py: 2,
          px: 3,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {open && (
          <Typography
            variant="h6"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
            }}
          >
            EduTech Admin
          </Typography>
        )}
        <IconButton onClick={onToggle}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, py: 2 }}>
        <List>
          {renderNavItems(navigation)}
        </List>
      </Box>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true // Better performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            bgcolor: 'background.paper',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant={variant}
      open={open}
      sx={{
        width: open ? SIDEBAR_WIDTH : COLLAPSED_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? SIDEBAR_WIDTH : COLLAPSED_WIDTH,
          bgcolor: 'background.paper',
          borderRight: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
