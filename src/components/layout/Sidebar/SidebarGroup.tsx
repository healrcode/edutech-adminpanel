import React, { useState } from 'react';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { SvgIconComponent } from '@mui/icons-material';
import SidebarItem from './SidebarItem';

interface NavItem {
  title: string;
  path: string;
  icon?: SvgIconComponent;
}

interface SidebarGroupProps {
  title: string;
  icon?: SvgIconComponent;
  items: NavItem[];
  depth?: number;
  isCollapsed?: boolean;
}

const SidebarGroup: React.FC<SidebarGroupProps> = ({
  title,
  icon: Icon,
  items,
  depth = 0,
  isCollapsed = false
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={{
          mb: 0.5,
          pl: depth * 3 + 2,
          py: 1,
          borderRadius: 1,
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        {Icon && (
          <ListItemIcon
            sx={{
              minWidth: 32,
              color: 'text.secondary',
            }}
          >
            <Icon />
          </ListItemIcon>
        )}
        
        {!isCollapsed && (
          <>
            <ListItemText
              primary={title}
              primaryTypographyProps={{
                noWrap: true,
                color: 'text.primary',
                fontWeight: open ? 600 : 400,
              }}
            />
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </>
        )}
      </ListItemButton>

      <Collapse in={open && !isCollapsed} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items.map((item) => (
            <SidebarItem
              key={item.path}
              title={item.title}
              path={item.path}
              icon={item.icon}
              depth={depth + 1}
              isCollapsed={isCollapsed}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default SidebarGroup;
