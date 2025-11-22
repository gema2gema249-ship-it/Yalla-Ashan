import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { auth } from '../lib/auth';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';

export default function Account() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const user = auth.getUser();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gameId: user?.gameId || '',
  });

  useEffect(() => {
    if (!user) {
      setLocation('/login');
    }
  }, [user, setLocation]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم نسخ: ' + text);
  };

  const handleLogout = () => {
    auth.logout();
    setLocation('/login');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      alert('⚠️ يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setSaving(true);
    try {
      // تحديث بيانات المستخدم في localStorage والواجهة
      const updatedUser = {
        ...user,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gameId: formData.gameId,
      };

      auth.setUser(updatedUser);

      // محاولة إرسال التحديث للخادم
      await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          gameId: formData.gameId,
        }),
      }).catch(() => {
        // إذا فشل الاتصال بالخادم، سيتم الاعتماد على localStorage
      });

      setEditMode(false);
      setSuccessMessage('✅ تم حفظ التغييرات بنجاح!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving account:', error);
      alert('❌ حدث خطأ أثناء حفظ البيانات');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      gameId: user?.gameId || '',
    });
    setEditMode(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{ direction: 'rtl', minHeight: '100vh', background: 'linear-gradient(180deg, #041022, #0d1f35)' }}>
      <TopBar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main style={{ maxWidth: '700px', margin: '24px auto', padding: '12px' }}>
        {/* Success Message */}
        {successMessage && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,255,127,0.2), rgba(0,204,102,0.2))',
            border: '1px solid rgba(0,255,127,0.4)',
            borderRadius: '12px',
            padding: '14px',
            marginBottom: '20px',
            color: '#00ff7f',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: '14px'
          }}>
            {successMessage}
          </div>
        )}

        <section
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px',
            padding: '24px',
            marginBottom: '18px',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 10px 30px rgba(2,6,23,0.6)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, color: '#ffd166', fontSize: '24px', fontWeight: 800 }}>👤 معلومات الحساب</h2>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  border: 'none',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                ✏️ تعديل البيانات
              </button>
            )}
          </div>

          {editMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Full Name */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'Cairo, sans-serif',
                  }}
                  placeholder="أدخل اسمك"
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'Cairo, sans-serif',
                  }}
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>

              {/* Phone */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'Cairo, sans-serif',
                  }}
                  placeholder="أدخل رقم هاتفك"
                />
              </div>

              {/* Game ID */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>
                  معرف حسابك في الألعاب (اختياري)
                </label>
                <input
                  type="text"
                  name="gameId"
                  value={formData.gameId}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'Cairo, sans-serif',
                  }}
                  placeholder="معرف اللعبة أو رقم الحساب"
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '12px' }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    background: 'linear-gradient(135deg, #00ff7f, #00cc66)',
                    border: 'none',
                    color: '#000',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? '⏳ جاري الحفظ...' : '✅ حفظ التغييرات'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  style={{
                    background: 'rgba(255, 100, 100, 0.2)',
                    border: '1px solid rgba(255, 100, 100, 0.3)',
                    color: '#ff6464',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  ❌ إلغاء
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {/* Display Mode */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: 'rgba(230,240,255,0.6)', fontSize: '13px', fontWeight: 600 }}>اسم المستخدم</div>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '15px' }}>{formData.fullName || 'غير محدد'}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: 'rgba(230,240,255,0.6)', fontSize: '13px', fontWeight: 600 }}>رقم المستخدم</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: '#fff', fontSize: '14px', direction: 'ltr' }}>{user.id}</span>
                  <button
                    onClick={() => copyToClipboard(user.id)}
                    style={{
                      background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                      border: 'none',
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    📋 نسخ
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: 'rgba(230,240,255,0.6)', fontSize: '13px', fontWeight: 600 }}>البريد الإلكتروني</div>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '15px', direction: 'ltr' }}>{formData.email}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: 'rgba(230,240,255,0.6)', fontSize: '13px', fontWeight: 600 }}>رقم الهاتف</div>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '15px', direction: 'ltr' }}>{formData.phone || 'غير محدد'}</div>
              </div>

              {formData.gameId && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: 'rgba(230,240,255,0.6)', fontSize: '13px', fontWeight: 600 }}>معرف اللعبة</div>
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: '15px' }}>{formData.gameId}</div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Logout Button */}
        <section style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleLogout}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid rgba(255,95,109,0.4)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '15px',
              background: 'linear-gradient(135deg, rgba(255,95,109,0.3), rgba(255,107,107,0.3))',
              color: '#ff6464',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(255,95,109,0.5), rgba(255,107,107,0.5))';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(255,95,109,0.3), rgba(255,107,107,0.3))';
            }}
          >
            🚪 تسجيل الخروج
          </button>
        </section>

        {/* Info Box */}
        <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,209,102,0.1)', borderRadius: '8px', border: '1px solid rgba(255,209,102,0.2)' }}>
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(230,240,255,0.8)', lineHeight: 1.6 }}>
            <strong>💡 نصيحة:</strong> قم بتحديث معلومات حسابك بانتظام للتأكد من سهولة التواصل معك عند استلام طلباتك.
          </p>
        </div>
      </main>
    </div>
  );
}
