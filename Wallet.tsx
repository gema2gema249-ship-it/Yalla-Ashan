import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { auth } from '../lib/auth';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';

const paymentInstructions: Record<string, { title: string; body: string }> = {
  bank_khartoum: {
    title: 'تعليمات الدفع - بنك الخرطوم',
    body: 'رقم الحساب: (4063552) | الاسم: المنذر عبد المنعم',
  },
  fawry: {
    title: 'تعليمات الدفع - فوري',
    body: 'اختر مزود فوري وأرسل رقم طلب الايداع إلى الدعم',
  },
  kashi: {
    title: 'تعليمات الدفع - كاشي',
    body: 'استخدم محفظة كاشي لتحويل المبلغ إلى الحساب الخاص بنا',
  },
  zaincash: {
    title: 'تعليمات الدفع - زين كاش',
    body: 'رقم المحفظة: 099XXXXXXX | الاسم: YallaAshan',
  },
};

export default function Wallet() {
  const [, setLocation] = useLocation();
  const user = auth.getUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (!user) {
      setLocation('/login');
    }
  }, [user, setLocation]);

  if (!user) {
    return null;
  }

  // Fetch user balance from API
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setBalance(user.balance || 0);
    }
  }, []);

  const handleConfirmAdd = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('أدخل مبلغ صالح');
      return;
    }
    if (!paymentMethod) {
      alert('اختر طريقة الدفع');
      return;
    }

    setBalance(balance + parseFloat(amount));
    setModalOpen(false);
    setAmount('');
    setPaymentMethod('');
    setPhoneNumber('');
    alert('تم إرسال طلب إضافة الرصيد بنجاح');
  };

  return (
    <div style={{ direction: 'rtl', minHeight: '100vh' }}>
      <TopBar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main style={{ maxWidth: '1000px', margin: '18px auto', padding: '12px' }}>
        <section
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '18px',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 10px 30px rgba(2,6,23,0.6)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <div style={{ color: 'rgba(230,240,255,0.75)', fontSize: '15px' }}>رصيد يلا اشحن</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#00c4ff' }}>{balance.toFixed(2)} ج.س</div>
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <button
              onClick={() => setModalOpen(true)}
              style={{
                padding: '12px 18px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                background: 'linear-gradient(90deg, #2b80ff, #06b6d4)',
                color: '#001',
                boxShadow: '0 10px 30px rgba(6,182,212,0.08)',
              }}
            >
              إضافة رصيد
            </button>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginTop: '12px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.01), rgba(255,255,255,0.02))',
              borderRadius: '12px',
              padding: '14px',
              border: '1px solid rgba(255,255,255,0.03)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ color: 'rgba(230,240,255,0.75)' }}>إجمالي المشتريات</div>
            <div style={{ color: '#31f0a1', fontWeight: 700 }}>0 ج.س</div>
          </div>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.01), rgba(255,255,255,0.02))',
              borderRadius: '12px',
              padding: '14px',
              border: '1px solid rgba(255,255,255,0.03)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ color: 'rgba(230,240,255,0.75)' }}>الرصيد الحالي</div>
            <div style={{ color: '#31f0a1', fontWeight: 700 }}>{balance.toFixed(2)} ج.س</div>
          </div>
        </div>
      </main>

      {modalOpen && (
        <div
          style={{
            display: 'flex',
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.7))',
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '92%',
              maxWidth: '520px',
              borderRadius: '16px',
              padding: '18px',
              background: 'linear-gradient(180deg, rgba(14,10,24,0.95), rgba(24,14,40,0.94))',
              border: '1px solid rgba(255,255,255,0.03)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: 'absolute',
                left: '14px',
                top: '14px',
                background: 'none',
                border: 'none',
                color: 'rgba(230,240,255,0.75)',
                fontSize: '20px',
                cursor: 'pointer',
              }}
            >
              ×
            </button>

            <h2 style={{ margin: '0 0 12px 0', color: '#ff9ff3', textAlign: 'center', fontSize: '22px' }}>إضافة رصيد</h2>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: 'rgba(230,240,255,0.75)' }}>المبلغ</label>
              <input
                type="number"
                min="1"
                placeholder="أدخل المبلغ (ج.س)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.02)',
                  color: '#eaf0ff',
                  fontSize: '15px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: 'rgba(230,240,255,0.75)' }}>رقم الهاتف</label>
              <input
                type="tel"
                placeholder="أدخل رقم الهاتف"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.02)',
                  color: '#eaf0ff',
                  fontSize: '15px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: 'rgba(230,240,255,0.75)' }}>طريقة الدفع</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.02)',
                  color: '#eaf0ff',
                  fontSize: '15px',
                  outline: 'none',
                }}
              >
                <option value="">اختر طريقة الدفع</option>
                <option value="bank_khartoum">بنك الخرطوم</option>
                <option value="fawry">فوري</option>
                <option value="kashi">كاشي</option>
                <option value="zaincash">زين كاش</option>
              </select>
            </div>

            {paymentMethod && paymentInstructions[paymentMethod] && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(180deg, rgba(124,58,237,0.06), rgba(0,0,0,0.03))',
                  border: '1px solid rgba(124,58,237,0.16)',
                  color: '#dcd3ff',
                  fontSize: '14px',
                }}
              >
                <strong style={{ color: '#ffd1ff' }}>{paymentInstructions[paymentMethod].title}</strong>
                <div style={{ marginTop: '8px', color: '#e6e6ff' }}>{paymentInstructions[paymentMethod].body}</div>
              </div>
            )}

            <button
              onClick={handleConfirmAdd}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                marginTop: '12px',
                background: 'linear-gradient(90deg, #ff8ec6, #7c3aed)',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              تأكيد الطلب
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
