import AdminSidebar from './AdminSidebar';
import StudentSidebar from './StudentSidebar';
import { useEffect } from 'react';

const Sidebar = () => {
  // Access flag from Redux state; fallback to 'flag' in localStorage if undefined
  const flag = localStorage.getItem("flag");
  // const accountType = flag || localStorage.getItem('flag');

  useEffect(() => {
    console.log('Logging all localStorage values:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      console.log(`${key}: ${value}`);
    }
  }, []);

  return (
    <div className="sidebar">
      {flag === 'Admin' ? <AdminSidebar /> : <StudentSidebar />}
    </div>
  );
};

export default Sidebar;
