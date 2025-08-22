export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  active?: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'fas fa-desktop',
    route: '/'
  },
  {
    label: 'Oitiva',
    icon: 'fas fa-video',
    route: '/oitiva'
  },
  {
    label: 'Upload',
    icon: 'fas fa-upload',
    route: '/upload'
  },
  {
    label: 'Unidade Operacional',
    icon: 'fas fa-building',
    route: '/unidade-operacional'
  }
];