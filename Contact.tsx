import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';

interface ContactInfo {
  email: string;
  whatsapp: string;
}

export default function Contact() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: 'mohastore249@gmail.com',
    whatsapp: '+249912550719',
  });

  useEffect(() => {
    // Load contact info from localStorage (saved by admin)
    const savedContact = localStorage.getItem('content_contact');
    if (savedContact) {
      try {
        const parsed = JSON.parse(savedContact);
        setContactInfo(parsed);
      } catch (e) {
        console.error('Error parsing contact info:', e);
      }
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم النسخ: ' + text);
  };

  return (
    <div style={{ direction: 'rtl', minHeight: '100vh' }}>
      <TopBar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main style={{ maxWidth: '800px', margin: '20px auto', padding: '16px' }}>
        <section
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px',
            padding: '20px',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#ffd166', marginBottom: '12px' }}>اتصل بنا</h2>

          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '14px 16px',
              borderRadius: '12px',
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>البريد الإلكتروني</div>
              <div style={{ color: 'rgba(230,240,255,0.75)', fontSize: '13px', direction: 'ltr' }}>{contactInfo.email}</div>
            </div>
            <button
              onClick={() => copyToClipboard(contactInfo.email)}
              style={{
                background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                border: 'none',
                color: '#fff',
                borderRadius: '8px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              نسخ
            </button>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '14px 16px',
              borderRadius: '12px',
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>واتساب</div>
              <div style={{ color: 'rgba(230,240,255,0.75)', fontSize: '13px', direction: 'ltr' }}>{contactInfo.whatsapp}</div>
            </div>
            <button
              onClick={() => copyToClipboard(contactInfo.whatsapp)}
              style={{
                background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                border: 'none',
                color: '#fff',
                borderRadius: '8px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              نسخ
            </button>
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#ffd166', marginTop: '25px', marginBottom: '12px' }}>تابعنا</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '16px' }}>
            {['facebook-f', 'instagram', 'x-twitter', 'telegram', 'youtube'].map((social) => (
              <a
                key={social}
                href="#"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  color: '#fff',
                  fontSize: '20px',
                  transition: '0.3s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                }}
                title={social}
              >
                {social === 'facebook-f' && '👍'}
                {social === 'instagram' && '📷'}
                {social === 'x-twitter' && '𝕏'}
                {social === 'telegram' && '✈️'}
                {social === 'youtube' && '▶️'}
              </a>
            ))}
          </div>

          <div
            style={{
              marginTop: '12px',
              fontSize: '15px',
              color: '#ffd166',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.05)',
              padding: '10px',
              borderRadius: '10px',
            }}
          >
            <strong>يلا اشحن | Yalla Ashan</strong>
          </div>

          <p style={{ marginTop: '22px', fontSize: '14px', color: 'rgba(230,240,255,0.75)', textAlign: 'center' }}>
            نحن دائمًا بانتظار رسائلك 💜
          </p>
        </section>
      </main>
    </div>
  );
}
