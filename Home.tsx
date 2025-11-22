import { useState } from 'react';
import { useLocation } from 'wouter';
import { auth } from '../lib/auth';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import ProductGrid from '../components/ProductGrid';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setLocation] = useLocation();
  const user = auth.getUser();

  return (
    <div style={{ direction: 'rtl', minHeight: '100vh', background: 'linear-gradient(180deg, #041022, #0d1f35)' }}>
      <TopBar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main style={{ maxWidth: '100%', margin: 0, padding: 0 }}>
        {/* Hero Section - Enhanced */}
        <section
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.05) 100%), radial-gradient(800px 400px at 10% 10%, rgba(124,58,237,0.08), transparent 50%)',
            backdropFilter: 'blur(12px)',
            padding: '80px 20px',
            borderBottom: '1px solid rgba(255,209,102,0.15)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '80px', marginBottom: '20px', animation: 'pulse 2s infinite' }}>🎮</div>
            <h1 style={{ 
              margin: '0 0 20px 0', 
              fontSize: '56px', 
              fontWeight: 900, 
              color: '#ffd166',
              background: 'linear-gradient(90deg, #ffd166, #06b6d4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-1px'
            }}>
              يلا اشحن
            </h1>
            <p style={{ 
              margin: '0 0 30px 0', 
              fontSize: '22px', 
              color: 'rgba(230,240,255,0.9)',
              fontWeight: 500,
              lineHeight: 1.6
            }}>
              منصتك الموثوقة لشحن الألعاب والبطاقات الرقمية بأسرع وقت وأفضل الأسعار
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '30px' }}>
              <button
                onClick={() => document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  border: 'none',
                  color: '#fff',
                  padding: '16px 40px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(124,58,237,0.4)',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
              >
                ⚡ تصفح المنتجات الآن
              </button>
              {!user && (
                <button
                  onClick={() => setLocation('/register')}
                  style={{
                    background: 'rgba(255,209,102,0.15)',
                    border: '2px solid rgba(255,209,102,0.4)',
                    color: '#ffd166',
                    padding: '14px 40px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,209,102,0.25)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,209,102,0.6)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,209,102,0.15)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,209,102,0.4)';
                  }}
                >
                  👤 إنشاء حساب
                </button>
              )}
            </div>

            {/* Trust Badges */}
            <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '40px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>⚡</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'rgba(230,240,255,0.75)', fontWeight: 600 }}>سرعة فائقة</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'rgba(230,240,255,0.5)' }}>تنفيذ فوري</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔒</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'rgba(230,240,255,0.75)', fontWeight: 600 }}>آمن 100%</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'rgba(230,240,255,0.5)' }}>حماية كاملة</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>💳</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'rgba(230,240,255,0.75)', fontWeight: 600 }}>طرق متعددة</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'rgba(230,240,255,0.5)' }}>دفع سهل</p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Sections - Only 3 sections */}
        <section style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }} id="games">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <h2 style={{ margin: 0, color: '#ffd166', fontSize: '32px', fontWeight: 800 }}>🎮 شحن الألعاب</h2>
            <div style={{ height: '3px', flex: 1, background: 'linear-gradient(90deg, #7c3aed, transparent)', borderRadius: '2px' }} />
          </div>
          <p style={{ margin: '0 0 24px 0', color: 'rgba(230,240,255,0.75)', fontSize: '15px' }}>أشهر الألعاب والعناوين الأكثر طلباً مع أفضل الأسعار</p>
          <ProductGrid category="games" columns={3} />
        </section>

        <section style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <h2 style={{ margin: 0, color: '#ffd166', fontSize: '32px', fontWeight: 800 }}>💳 بطاقات الألعاب</h2>
            <div style={{ height: '3px', flex: 1, background: 'linear-gradient(90deg, #06b6d4, transparent)', borderRadius: '2px' }} />
          </div>
          <p style={{ margin: '0 0 24px 0', color: 'rgba(230,240,255,0.75)', fontSize: '15px' }}>بطاقات هدايا وعملات لشراء المحتوى والألعاب الجديدة</p>
          <ProductGrid category="cards" columns={3} />
        </section>

        <section style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <h2 style={{ margin: 0, color: '#ffd166', fontSize: '32px', fontWeight: 800 }}>🌟 منتجات مميزة</h2>
            <div style={{ height: '3px', flex: 1, background: 'linear-gradient(90deg, #ffd166, transparent)', borderRadius: '2px' }} />
          </div>
          <p style={{ margin: '0 0 24px 0', color: 'rgba(230,240,255,0.75)', fontSize: '15px' }}>عروض حصرية وحزم خاصة لا تجدها في أي مكان آخر</p>
          <ProductGrid category="special" columns={3} />
        </section>

        {/* Footer */}
        <footer
          style={{
            background: 'rgba(4, 16, 34, 0.8)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            padding: '40px 20px',
            textAlign: 'center',
            color: 'rgba(230,240,255,0.6)',
            fontSize: '14px',
            marginTop: '60px'
          }}
        >
          <p style={{ margin: '0 0 10px 0', fontWeight: 600, color: '#ffd166' }}>يلا اشحن | Yalla Ashan</p>
          <p style={{ margin: 0 }}>© 2024 جميع الحقوق محفوظة. نحن هنا لخدمتك 24/7</p>
        </footer>
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
