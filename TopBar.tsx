import { useLocation } from 'wouter';
import { auth } from '../lib/auth';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const [, setLocation] = useLocation();
  const user = auth.getUser();

  const handleLogout = () => {
    auth.logout();
    setLocation('/login');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{ fontWeight: 700, color: '#ffd166', fontSize: '18px', cursor: 'pointer' }} onClick={() => setLocation('/')}>
        يلا اشحن
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onMenuClick}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: 'none',
            padding: '10px 14px',
            borderRadius: '12px',
            color: 'rgba(230,240,255,0.75)',
            cursor: 'pointer',
            fontSize: '18px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
          }}
        >
          ☰
        </button>
      </div>
    </header>
  );
}
