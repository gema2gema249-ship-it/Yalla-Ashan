import { useState } from 'react';
import { useLocation } from 'wouter';

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('admin@yallaashan.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const user = await res.json();
      if (!res.ok || user.role !== 'admin') {
        setError('بيانات دخول غير صحيحة أو أنت لست مسؤولاً');
        return;
      }
      localStorage.setItem('adminUser', JSON.stringify(user));
      setLocation('/admin/dashboard');
    } catch (err) {
      setError('خطأ في الاتصال');
    }
  };

  return (
    <div
      style={{
        margin: 0,
        fontFamily: 'Cairo, sans-serif',
        background: 'linear-gradient(135deg, #041022, #0d1f35)',
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        direction: 'rtl',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.06)',
          padding: '40px',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 0 30px rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
        }}
      >
        <h1 style={{ marginBottom: '10px', fontSize: '32px', color: '#ffd166', letterSpacing: '1px' }}>
          لوحة التحكم
        </h1>
        <p style={{ color: 'rgba(230,240,255,0.75)', marginBottom: '30px' }}>يلا اشحن - إدارة النظام</p>

        {error && (
          <div
            style={{
              background: 'rgba(255, 100, 100, 0.2)',
              border: '1px solid rgba(255, 100, 100, 0.5)',
              color: '#ff6464',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: '20px', textAlign: 'right' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(230,240,255,0.75)', fontSize: '14px' }}>
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: 'none',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#fff',
              fontSize: '15px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '30px', textAlign: 'right' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(230,240,255,0.75)', fontSize: '14px' }}>
            كلمة المرور
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: 'none',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#fff',
              fontSize: '15px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleLogin();
            }}
          />
        </div>

        <button
          onClick={handleLogin}
          style={{
            background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
            color: '#fff',
            padding: '12px',
            width: '100%',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '16px',
            transition: '0.3s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          }}
        >
          دخول لوحة التحكم
        </button>

        <div style={{ fontSize: '12px', color: '#999', marginTop: '20px' }}>
          بيانات التجربة: admin@yallaashan.com / admin123
        </div>
      </div>
    </div>
  );
}
