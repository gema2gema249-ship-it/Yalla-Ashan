import { useState } from 'react';
import { useLocation } from 'wouter';
import { auth } from '../lib/auth';

export default function Register() {
  const [, setLocation] = useLocation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !phone) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: email.split('@')[0],
          email,
          password,
          fullName,
          phone,
          balance: 0,
          role: 'user',
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'فشل التسجيل');
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
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
        }}
      >
        <h1 style={{ marginTop: 0, fontSize: '28px', fontWeight: 800, color: '#ffd166', textAlign: 'center' }}>
          إنشاء حساب جديد
        </h1>
        <p style={{ textAlign: 'center', color: 'rgba(230,240,255,0.75)', marginBottom: '30px' }}>
          انضم إلينا واشحن ألعابك الآن
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

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'rgba(230,240,255,0.75)' }}>
              الاسم الكامل *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="أدخل اسمك الكامل"
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

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'rgba(230,240,255,0.75)' }}>
              رقم الهاتف *
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="أدخل رقم هاتفك"
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

          <div style={{ marginBottom: '16px' }}>
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

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'rgba(230,240,255,0.75)' }}>
              تأكيد كلمة المرور *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="أدخل كلمة المرور مرة أخرى"
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
            {loading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <span style={{ color: 'rgba(230,240,255,0.75)', fontSize: '14px' }}>
            لديك حساب بالفعل؟{' '}
            <span
              onClick={() => setLocation('/login')}
              style={{
                color: '#ffd166',
                cursor: 'pointer',
                fontWeight: 'bold',
                textDecoration: 'underline',
              }}
            >
              تسجيل الدخول
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
