import { useState } from 'react';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import ProductGrid from '../components/ProductGrid';

export default function Special() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ direction: 'rtl', minHeight: '100vh' }}>
      <TopBar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main style={{ maxWidth: '1100px', margin: '18px auto', padding: '8px' }}>
        <section
          style={{
            padding: '18px',
            borderRadius: '14px',
            marginBottom: '18px',
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '24px' }}>🌟 منتجات مميزة</h1>
          <p style={{ color: 'rgba(230,240,255,0.75)', marginTop: '8px' }}>استكشف أفضل المنتجات والعروض الخاصة</p>
        </section>

        <section style={{ margin: '26px 0' }}>
          <ProductGrid columns={3} />
        </section>
      </main>
    </div>
  );
}
