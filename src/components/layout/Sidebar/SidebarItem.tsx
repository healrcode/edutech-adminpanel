import React from 'react';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { SvgIconComponent } from '@mui/icons-material';

interface SidebarItemProps {
  title: string;
  path: string;
  icon?: SvgIconComponent;
  depth?: number;
  isCollapsed?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  title,
  path,
  icon: Icon,
  depth = 0,
  isCollapsed = false
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active = pathname === path;

  return (
    <ListItemButton
      onClick={() => navigate(path)}
      sx={{
        mb: 0.5,
        pl: depth * 3 + 2,
        py: 1,
        borderRadius: 1,
        '&:hover': {
          bgcolor: 'action.hover',
        },
        ...(active && {
          bgcolor: `${theme.palette.primary.main}15`,
          '&:hover': {
            bgcolor: `${theme.palette.primary.main}25`,
          },
        }),
      }}
    >
      {Icon && (
        <ListItemIcon
          sx={{
            minWidth: 32,
            color: active ? 'primary.main' : 'text.secondary',
          }}
        >
          <Icon />
        </ListItemIcon>
      )}
      
      {!isCollapsed && (
        <ListItemText
          primary={title}
          primaryTypographyProps={{
            noWrap: true,
            color: active ? 'primary.main' : 'text.primary',
            fontWeight: active ? 600 : 400,
          }}
        />
      )}
    </ListItemButton>
  );
};

export default SidebarItem;
