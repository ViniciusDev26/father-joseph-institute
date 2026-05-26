import type { ReactNode } from 'react';
import './admin.css';

export const metadata = {
  title: 'Admin — Instituto Padre José',
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="admin-root">{children}</div>;
}
