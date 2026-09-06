import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarLayout from './sidebar-layout';
import { useAuthStore } from '@/stores/authStore';
import type { INavLink } from '@/@types/nav-link';
import {
  LayoutDashboard,
  ListOrdered,
  UserRound,
  SquareUserRound,
  BriefcaseBusiness,
  House,
  Tickets,
  Home,
} from 'lucide-react';

export const DashboardLayout = () => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  const links = useMemo<INavLink[]>(() => {
    const pathname = location.pathname;

    if (user?.role === 'admin') {
      return [
        {
          title: 'Dashboard',
          url: '/admin',
          icon: LayoutDashboard,
          isActive: pathname === '/admin',
        },
        {
          title: 'IT Service Tickets',
          url: '/admin/it-service-tickets',
          icon: ListOrdered,
          isActive: pathname.startsWith('/admin/it-service-tickets'),
        },
        {
          title: 'Users',
          url: '/admin/users',
          icon: UserRound,
          isActive: pathname.startsWith('/admin/users'),
        },
        {
          title: 'Clients',
          url: '/admin/clients',
          icon: SquareUserRound,
          isActive: pathname.startsWith('/admin/clients'),
        },
        {
          title: 'Designations',
          url: '/admin/designations',
          icon: BriefcaseBusiness,
          isActive: pathname.startsWith('/admin/designations'),
        },
        {
          title: 'Offices',
          url: '/admin/offices',
          icon: House,
          isActive: pathname.startsWith('/admin/offices'),
        },
      ];
    }

    if (user?.role === 'staff') {
      return [
        {
          title: 'Active Tickets',
          url: '/service-engineer',
          icon: Tickets,
          isActive: pathname.startsWith('/service-engineer'),
        },
      ];
    }

    // Default / client user
    return [
      {
        title: 'Home',
        url: '/client',
        icon: Home,
        isActive: pathname === '/client',
      },
    ];
  }, [user?.role, location.pathname]);

  return <SidebarLayout links={links} setLinks={() => {}} />;
};

export default DashboardLayout;
