import { useLocation } from 'wouter';
import { auth } from '../lib/auth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: '🏠 الرئيسية', href: '/' },
  { label: '👤 حسابي', href: '/account' },
  { label: '📦 طلباتي', href: '/orders' },
  { label: '⚡ شحن ألعاب', href: '/games' },
  { label: '💳 بطاقات ألعاب', href: '/cards' },
  { label: '🌟 منتجات مميزة', href: '/special' },
  { label: '🤝 وكلاء يلا اشحن', href: '/agents' },
  { label: '📞 اتصل بنا', href: '/contact' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [, setLocation] = useLocation();
  const user = auth.getUser();

  const handleNavigation = (href: string) => {
    setLocation(href);
    onClose();
  };

  const handleLogout = () => {
    auth.logout();
    setLocation('/login');
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 199,
            background: 'transparent',
          }}
        />
      )}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: isOpen ? 0 : -320,
          width: 320,
          height: '100%',
          zIndex: 200,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
          borderLeft: '1px solid rgba(255,255,255,0.03)',
          padding: '18px',
          transition: 'right .28s cubic-bezier(.2,.9,.3,1)',
          backdropFilter: 'blur(12px)',
          borderRadius: '12px 0 0 12px',
          boxShadow: '0 20px 60px rgba(2,6,23,0.6)',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ fontWeight: 700, color: '#ffd166', fontSize: '18px' }}>يلا اشحن</div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(230,240,255,0.75)',
              fontSize: '20px',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            ×
          </button>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map((item) => (
            <li key={item.href} style={{ margin: '10px 0' }}>
              <button
                onClick={() => handleNavigation(item.href)}
                style={{
                  display: 'block',
                  padding: '10px',
                  borderRadius: '10px',
                  color: 'rgba(230,240,255,0.75)',
                  background: 'rgba(255,255,255,0.02)',
                  textDecoration: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'right',
                  fontSize: '15px',
                  transition: '0.3s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLElement).style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(230,240,255,0.75)';
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {user && (
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ marginBottom: '12px', fontSize: '12px', color: 'rgba(230,240,255,0.5)' }}>
              الحساب: {user.email}
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: 'block',
                padding: '10px',
                borderRadius: '10px',
                color: '#ff5f6d',
                background: 'rgba(255,95,109,0.1)',
                border: '1px solid rgba(255,95,109,0.3)',
                textDecoration: 'none',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'right',
                fontSize: '14px',
                fontWeight: '600',
                transition: '0.3s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,95,109,0.2)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,95,109,0.1)';
              }}
            >
              🚪 تسجيل الخروج
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
