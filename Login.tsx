import { useState } from 'react';
import { useLocation } from 'wouter';
import { auth } from '../lib/auth';

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError('بريد إلكتروني أو كلمة مرور غير صحيحة');
        return;
      }

      const user = await res.json();
      auth.setUser(user);
      setLocation('/');
    } catch (err) {
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        direction: 'rtl',
        minHeight: '100vh',
        background: 'radial-gradient(800px 400px at 10% 10%, rgba(124,58,237,0.06), transparent 5%), linear-gradient(180deg, #041022, #0d1f35)',
        color: '#eaf0ff',
        fontFamily: 'Cairo, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '14px',
          padding: '40px',
          backdropFilter: 'blur(8px)',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
        }}
      >
        <h1 style={{ marginTop: 0, fontSize: '28px', fontWeight: 800, color: '#ffd166', textAlign: 'center' }}>
          تسجيل الدخول
        </h1>
        <p style={{ textAlign: 'center', color: 'rgba(230,240,255,0.75)', marginBottom: '30px' }}>
          اشحن ألعابك الآن بسرعة وسهولة
        </p>

        {error && (
          <div
            style={{
              background: 'rgba(255,77,77,0.1)',
              border: '1px solid rgba(255,77,77,0.3)',
              color: '#ff4d4d',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'rgba(230,240,255,0.75)' }}>
              البريد الإلكتروني *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="أدخل بريدك الإلكتروني"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'rgba(230,240,255,0.75)' }}>
              كلمة المرور *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة مرورك"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#555' : 'linear-gradient(90deg, #7c3aed, #06b6d4)',
              border: 'none',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '16px',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: '0.3s',
            }}
          >
            {loading ? 'جاري التسجيل...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <span style={{ color: 'rgba(230,240,255,0.75)', fontSize: '14px' }}>
            ليس لديك حساب؟{' '}
            <span
              onClick={() => setLocation('/register')}
              style={{
                color: '#ffd166',
                cursor: 'pointer',
                fontWeight: 'bold',
                textDecoration: 'underline',
              }}
            >
              إنشاء حساب جديد
            </span>
          </span>
        </div>

        <div style={{ marginTop: '20px', fontSize: '12px', color: 'rgba(230,240,255,0.5)', textAlign: 'center' }}>
          © جميع الحقوق محفوظة - يلا اشحن
        </div>
      </div>
    </div>
  );
}
