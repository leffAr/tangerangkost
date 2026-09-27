import DashboardLayout from '@/components/dashboard-layout';

export const metadata = {
  title: 'User Panel | TangerangKost',
};

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout role="USER">{children}</DashboardLayout>;
}
