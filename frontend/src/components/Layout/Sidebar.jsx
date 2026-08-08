import { NavLink } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BadgeIcon from '@mui/icons-material/Badge';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Vendor', path: '/vendors', icon: <StorefrontIcon /> },
  { label: 'Salesman', path: '/salesmen', icon: <BadgeIcon /> },
  { label: 'Order', path: '/orders', icon: <ReceiptLongIcon /> },
];

export default function Sidebar({ onNavigate }) {
  return (
    <List component="nav" sx={{ width: '100%' }}>
      {navItems.map((item) => (
        <ListItemButton
          key={item.path}
          component={NavLink}
          to={item.path}
          onClick={onNavigate}
          sx={{
            '&.active': {
              backgroundColor: 'action.selected',
              borderRight: '3px solid',
              borderColor: 'primary.main',
            },
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
    </List>
  );
}
