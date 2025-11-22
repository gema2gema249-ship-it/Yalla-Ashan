import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'products' | 'orders' | 'payments' | 'content' | 'admin-settings'>('orders');

  useEffect(() => {
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      setLocation('/admin');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/products'),
        fetch('/api/orders'),
      ]);
      setUsers(await usersRes.json());
      setProducts(await productsRes.json());
      setOrders(await ordersRes.json());
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    setLocation('/admin');
  };

  return (
    <div
      style={{
        direction: 'rtl',
        minHeight: '100vh',
        background: 'radial-gradient(800px 400px at 10% 10%, rgba(124,58,237,0.06), transparent 5%), linear-gradient(180deg, #041022, #0d1f35)',
        color: '#eaf0ff',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          background: 'linear-gradient(180deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))',
          borderBottom: '2px solid rgba(255,209,102,0.2)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
      >
        <div>
          <div style={{ fontWeight: 800, color: '#ffd166', fontSize: '24px', letterSpacing: '1px' }}>
            ⚙️ لوحة التحكم
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(230,240,255,0.6)', marginTop: '4px' }}>
            يلا اشحن - نظام إدارة المتجر
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'linear-gradient(135deg, #ff5f6d, #ffc371)',
            border: 'none',
            color: '#fff',
            padding: '12px 28px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(255,95,109,0.3)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(255,95,109,0.4)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(255,95,109,0.3)';
          }}
        >
          🚪 تسجيل الخروج
        </button>
      </header>

      <main style={{ maxWidth: '1400px', margin: '24px auto', padding: '16px' }}>
        {/* Statistics Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '30px',
          }}
        >
          {[
            { label: 'إجمالي الطلبات', value: orders.length, icon: '📋', color: '#7c3aed' },
            { label: 'عدد المستخدمين', value: users.length, icon: '👥', color: '#06b6d4' },
            { label: 'المنتجات المتاحة', value: products.length, icon: '🎮', color: '#ffd166' },
            { label: 'الطلبات المعلقة', value: orders.filter((o: any) => o.status === 'pending').length, icon: '⏳', color: '#ff6b6b' },
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                background: `linear-gradient(135deg, rgba(${stat.color === '#7c3aed' ? '124,58,237' : stat.color === '#06b6d4' ? '6,182,212' : stat.color === '#ffd166' ? '255,209,102' : '255,107,107'},0.15), rgba(255,255,255,0.02))`,
                border: `2px solid rgba(255,255,255,0.08)`,
                borderRadius: '16px',
                padding: '24px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'rgba(230,240,255,0.6)', marginBottom: '8px' }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#ffd166' }}>
                    {stat.value}
                  </div>
                </div>
                <div style={{ fontSize: '40px' }}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              background: activeTab === 'orders' ? 'linear-gradient(90deg, #7c3aed, #06b6d4)' : 'rgba(255,255,255,0.1)',
              color: activeTab === 'orders' ? '#001' : '#fff',
              transition: '0.3s',
            }}
          >
            📋 إدارة الطلبات ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              background: activeTab === 'users' ? 'linear-gradient(90deg, #7c3aed, #06b6d4)' : 'rgba(255,255,255,0.1)',
              color: activeTab === 'users' ? '#001' : '#fff',
              transition: '0.3s',
            }}
          >
            👥 إدارة المستخدمين ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              background: activeTab === 'products' ? 'linear-gradient(90deg, #7c3aed, #06b6d4)' : 'rgba(255,255,255,0.1)',
              color: activeTab === 'products' ? '#001' : '#fff',
              transition: '0.3s',
            }}
          >
            🛍️ إدارة المنتجات ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              background: activeTab === 'payments' ? 'linear-gradient(90deg, #7c3aed, #06b6d4)' : 'rgba(255,255,255,0.1)',
              color: activeTab === 'payments' ? '#001' : '#fff',
              transition: '0.3s',
            }}
          >
            💳 إدارة طرق الدفع
          </button>
          <button
            onClick={() => setActiveTab('content')}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              background: activeTab === 'content' ? 'linear-gradient(90deg, #7c3aed, #06b6d4)' : 'rgba(255,255,255,0.1)',
              color: activeTab === 'content' ? '#001' : '#fff',
              transition: '0.3s',
            }}
          >
            🔧 محتوى الصفحات
          </button>
          <button
            onClick={() => setActiveTab('admin-settings')}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              background: activeTab === 'admin-settings' ? 'linear-gradient(90deg, #7c3aed, #06b6d4)' : 'rgba(255,255,255,0.1)',
              color: activeTab === 'admin-settings' ? '#001' : '#fff',
              transition: '0.3s',
            }}
          >
            ⚙️ إعدادات المسؤول
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <OrdersManager orders={orders} onUpdate={fetchData} />
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <UsersManager users={users} onUpdate={fetchData} />
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <ProductsManager products={products} onUpdate={fetchData} />
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div>
            <PaymentsManager />
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div>
            <ContentManager />
          </div>
        )}

        {/* Admin Settings Tab */}
        {activeTab === 'admin-settings' && (
          <div>
            <AdminSettings />
          </div>
        )}
      </main>
    </div>
  );
}

function OrdersManager({ orders, onUpdate }: any) {
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      onUpdate();
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: any = {
      completed: { label: '✅ مكتمل', bg: 'rgba(0, 255, 127, 0.15)', color: '#00ff7f', border: '1px solid rgba(0, 255, 127, 0.3)' },
      pending: { label: '⏳ منتظر الموافقة', bg: 'rgba(255, 202, 40, 0.15)', color: '#ffca28', border: '1px solid rgba(255, 202, 40, 0.3)' },
      cancelled: { label: '❌ ملغى', bg: 'rgba(255, 77, 77, 0.15)', color: '#ff4d4d', border: '1px solid rgba(255, 77, 77, 0.3)' },
    };
    return statusMap[status] || statusMap.pending;
  };

  const getPaymentMethodLabel = (method: string) => {
    const methodMap: any = {
      bank_khartoum: '🏦 بنك الخرطوم',
      fawry: '💳 فوري',
      kashi: '📱 كاشي',
      zaincash: '💰 زين كاش',
    };
    return methodMap[method] || method;
  };

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
        padding: '24px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: '24px', color: '#ffd166', fontSize: '20px', fontWeight: 800 }}>
        📋 قائمة الطلبات الكاملة
      </h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ fontSize: '16px', color: 'rgba(230,240,255,0.75)' }}>لا توجد طلبات حتى الآن</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {orders.map((order: any) => {
            const statusInfo = getStatusBadge(order.status);
            const orderDate = new Date(order.createdAt);
            const formattedDate = orderDate.toLocaleDateString('ar-EG');
            const formattedTime = orderDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={order.id}
                style={{
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.08))',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255, 209, 102, 0.4)';
                  (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.12))';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(124,58,237,0.15)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.12)';
                  (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.08))';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                {/* Status Badge */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      background: statusInfo.bg,
                      border: statusInfo.border,
                      color: statusInfo.color,
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {statusInfo.label}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(230,240,255,0.6)' }}>
                    ID: {order.id.substring(0, 8)}...
                  </div>
                </div>

                {/* Product Info */}
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                  <p style={{ margin: '0 0 6px 0', color: '#ffd166', fontWeight: 700, fontSize: '16px' }}>
                    {order.productName}
                  </p>
                  <p style={{ margin: 0, color: 'rgba(230,240,255,0.7)', fontSize: '13px' }}>
                    السعر: <span style={{ color: '#00c4ff', fontWeight: 600 }}>{order.price} ج.س</span>
                  </p>
                </div>

                {/* Customer Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>
                      🎮 الآيدي
                    </p>
                    <p style={{ margin: 0, fontSize: '14px', color: '#00c4ff', fontWeight: 700 }}>
                      {order.userGameId}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>
                      📱 الواتساب
                    </p>
                    <p style={{ margin: 0, fontSize: '14px', color: '#06b6d4', fontWeight: 700 }}>
                      {order.userPhone}
                    </p>
                  </div>
                </div>

                {/* Package & Payment */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>
                      📦 الحزمة
                    </p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#fff', fontWeight: 600 }}>
                      {order.selectedPackage}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>
                      💳 طريقة الدفع
                    </p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#ffd166', fontWeight: 600 }}>
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </p>
                  </div>
                </div>

                {/* Date & Time */}
                <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <p style={{ margin: 0, fontSize: '11px', color: 'rgba(230,240,255,0.5)' }}>
                    📅 {formattedDate} | {formattedTime}
                  </p>
                </div>

                {/* Payment Proof Image */}
                {order.paymentProofImage && (
                  <div style={{ paddingTop: '8px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>
                      📸 صورة تأكيد الدفع:
                    </p>
                    <img
                      src={order.paymentProofImage}
                      alt="Payment Proof"
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(124,58,237,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                {order.status === 'pending' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '8px' }}>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      style={{
                        background: 'linear-gradient(135deg, #00ff7f, #00cc66)',
                        border: 'none',
                        color: '#000',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(0, 255, 127, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                      }}
                    >
                      ✅ تأكيد الطلب
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      style={{
                        background: 'linear-gradient(135deg, #ff4d4d, #ff1a1a)',
                        border: 'none',
                        color: '#fff',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(255, 77, 77, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                      }}
                    >
                      ❌ إلغاء الطلب
                    </button>
                  </div>
                )}

                {order.status !== 'pending' && (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: 'rgba(230,240,255,0.6)',
                      fontWeight: 600,
                    }}
                  >
                    {order.status === 'completed' ? '✅ تم تأكيد الطلب' : '❌ تم إلغاء الطلب'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function UsersManager({ users, onUpdate }: any) {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [balanceChange, setBalanceChange] = useState('');

  const handleBalanceChange = async () => {
    if (!selectedUser || !balanceChange) return;
    try {
      await fetch(`/api/users/${selectedUser.id}/balance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseInt(balanceChange) }),
      });
      setBalanceChange('');
      setSelectedUser(null);
      onUpdate();
    } catch (err) {
      console.error('Error updating balance:', err);
    }
  };

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
        padding: '20px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <h2 style={{ marginTop: 0, color: '#ffd166', fontSize: '18px' }}>قائمة المستخدمين</h2>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '12px', textAlign: 'right', color: '#ffd166' }}>الاسم</th>
              <th style={{ padding: '12px', textAlign: 'right', color: '#ffd166' }}>البريد</th>
              <th style={{ padding: '12px', textAlign: 'right', color: '#ffd166' }}>الرصيد</th>
              <th style={{ padding: '12px', textAlign: 'right', color: '#ffd166' }}>الدور</th>
              <th style={{ padding: '12px', textAlign: 'right', color: '#ffd166' }}>الإجراء</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px' }}>{user.fullName || 'بدون اسم'}</td>
                <td style={{ padding: '12px', color: 'rgba(230,240,255,0.75)' }}>{user.email}</td>
                <td style={{ padding: '12px', color: '#00c4ff', fontWeight: 600 }}>{user.balance} ج.س</td>
                <td style={{ padding: '12px' }}>
                  <span
                    style={{
                      background: user.role === 'admin' ? 'rgba(255, 165, 0, 0.2)' : 'rgba(100, 200, 100, 0.2)',
                      color: user.role === 'admin' ? '#ffa500' : '#64c864',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  >
                    {user.role === 'admin' ? 'مسؤول' : 'مستخدم'}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => setSelectedUser(user)}
                    style={{
                      background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                      border: 'none',
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    تعديل الرصيد
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <h3 style={{ marginTop: 0 }}>تعديل رصيد: {selectedUser.fullName}</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="number"
              placeholder="أدخل المبلغ (موجب أو سالب)"
              value={balanceChange}
              onChange={(e) => setBalanceChange(e.target.value)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                outline: 'none',
              }}
            />
            <button
              onClick={handleBalanceChange}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(90deg, #06b6d4, #7c3aed)',
                border: 'none',
                color: '#fff',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              حفظ
            </button>
            <button
              onClick={() => setSelectedUser(null)}
              style={{
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductsManager({ products, onUpdate }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'games',
    description: '',
    icon: '🎮',
    image: '',
    packages: [] as Array<{ name: string; price: string }>,
  });
  const [newPackage, setNewPackage] = useState({ name: '', price: '' });

  const handleAddPackage = () => {
    if (newPackage.name && newPackage.price) {
      setFormData({
        ...formData,
        packages: [...formData.packages, { ...newPackage }],
      });
      setNewPackage({ name: '', price: '' });
    }
  };

  const handleRemovePackage = (index: number) => {
    setFormData({
      ...formData,
      packages: formData.packages.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || formData.packages.length === 0) {
      alert('يرجى ملء جميع الحقول المطلوبة وإضافة حزمة واحدة على الأقل');
      return;
    }

    try {
      const payload = {
        ...formData,
        price: parseInt(formData.price),
        packages: JSON.stringify(formData.packages),
      };

      if (editingId) {
        await fetch(`/api/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setFormData({ name: '', price: '', category: 'games', description: '', icon: '🎮', image: '', packages: [] });
      setNewPackage({ name: '', price: '' });
      setEditingId(null);
      setShowForm(false);
      onUpdate();
      alert('تم حفظ المنتج بنجاح ✅');
    } catch (err) {
      console.error('Error saving product:', err);
      alert('حدث خطأ في حفظ المنتج');
    }
  };

  const handleEdit = (product: any) => {
    const packages = JSON.parse(product.packages || '[]');
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description || '',
      icon: product.icon,
      image: product.image || '',
      packages: Array.isArray(packages) ? packages : [],
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        onUpdate();
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '24px', backdropFilter: 'blur(8px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ marginTop: 0, color: '#ffd166', fontSize: '20px', fontWeight: 800 }}>🎮 إدارة المنتجات</h2>
          <p style={{ margin: '6px 0 0 0', color: 'rgba(230,240,255,0.6)', fontSize: '13px' }}>أضف منتجات جديدة أو عدّل المنتجات الموجودة</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '', price: '', category: 'games', description: '', icon: '🎮', image: '', packages: [] }); setNewPackage({ name: '', price: '' }); }} style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', border: 'none', color: '#fff', padding: '12px 28px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '14px', boxShadow: '0 4px 12px rgba(124,58,237,0.3)', transition: 'all 0.3s' }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(124,58,237,0.4)'; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(124,58,237,0.3)'; }}>➕ منتج جديد</button>
      </div>

      {showForm && (
        <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.08))', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', marginBottom: '24px', backdropFilter: 'blur(6px)' }}>
          <h3 style={{ marginTop: 0, color: '#ffd166', fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>{editingId ? '✏️ تعديل المنتج' : '✨ إضافة منتج جديد'}</h3>
          
          {/* Basic Info Section */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ marginTop: 0, color: '#06b6d4', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>📝 معلومات أساسية</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 0.8fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: '#ffd166', fontWeight: 700, textTransform: 'uppercase' }}>اسم المنتج *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="مثال: فيفا 25" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)', color: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'Cairo, sans-serif' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: '#ffd166', fontWeight: 700, textTransform: 'uppercase' }}>السعر الأساسي *</label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)', color: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'Cairo, sans-serif' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: '#ffd166', fontWeight: 700, textTransform: 'uppercase' }}>الفئة *</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)', color: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'Cairo, sans-serif' }}>
                  <option value="games">🎮 ألعاب</option>
                  <option value="cards">🎫 بطاقات</option>
                  <option value="special">⭐ مميزة</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: '#ffd166', fontWeight: 700, textTransform: 'uppercase' }}>الأيقونة</label>
                <input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} maxLength={2} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)', color: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'Cairo, sans-serif', fontSize: '18px', textAlign: 'center' }} />
              </div>
            </div>
          </div>

          {/* Description & Image */}
          <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: '#ffd166', fontWeight: 700, textTransform: 'uppercase' }}>الوصف</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="وصف المنتج والمميزات..." style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)', color: '#fff', outline: 'none', boxSizing: 'border-box', minHeight: '80px', fontFamily: 'Cairo, sans-serif' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: '#ffd166', fontWeight: 700, textTransform: 'uppercase' }}>رابط الصورة</label>
              <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="رابط الصورة الخارجي" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)', color: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'Cairo, sans-serif' }} />
            </div>
          </div>

          {/* Packages Section */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ marginTop: 0, color: '#06b6d4', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>💰 الحزم والأسعار *</h4>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: 'rgba(230,240,255,0.7)', fontWeight: 600 }}>اسم الحزمة (مثال: 100 دجهة)</label>
                  <input type="text" value={newPackage.name} onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })} placeholder="100 دجهة" style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(255,209,102,0.2)', background: 'rgba(255,209,102,0.05)', color: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'Cairo, sans-serif' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: 'rgba(230,240,255,0.7)', fontWeight: 600 }}>السعر (ج.س)</label>
                  <input type="number" value={newPackage.price} onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })} placeholder="0" style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(255,209,102,0.2)', background: 'rgba(255,209,102,0.05)', color: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'Cairo, sans-serif' }} />
                </div>
                <button onClick={handleAddPackage} style={{ background: 'linear-gradient(135deg, #ffd166, #ffb700)', border: 'none', color: '#000', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '12px', marginTop: '20px', transition: 'all 0.3s' }} onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'} onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}>➕ إضافة</button>
              </div>
            </div>

            {/* Packages Preview */}
            {formData.packages.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontSize: '12px', color: '#06b6d4', fontWeight: 700, marginBottom: '10px' }}>📦 الحزم المضافة ({formData.packages.length})</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                  {formData.packages.map((pkg, idx) => (
                    <div key={idx} style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(124,58,237,0.1))', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '8px', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffd166' }}>{pkg.name}</div>
                        <div style={{ fontSize: '12px', color: '#06b6d4', fontWeight: 600 }}>{pkg.price} ج.س</div>
                      </div>
                      <button onClick={() => handleRemovePackage(idx)} style={{ background: 'rgba(255, 100, 100, 0.2)', border: 'none', color: '#ff6464', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={() => { setShowForm(false); setNewPackage({ name: '', price: '' }); }} style={{ padding: '10px 24px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s' }} onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'} onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'}>إلغاء</button>
            <button onClick={handleSubmit} style={{ padding: '10px 28px', background: 'linear-gradient(135deg, #00ff7f, #00cc66)', border: 'none', color: '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '14px', boxShadow: '0 4px 12px rgba(0,255,127,0.3)', transition: 'all 0.3s' }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,255,127,0.4)'; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,255,127,0.3)'; }}>✅ حفظ المنتج</button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {products.map((product: any) => {
          const packages = JSON.parse(product.packages || '[]');
          return (
            <div key={product.id} style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.05))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ fontSize: '40px' }}>{product.icon}</div>
                <span style={{ background: 'rgba(255,209,102,0.15)', color: '#ffd166', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>{product.category === 'games' ? '🎮' : product.category === 'cards' ? '🎫' : '⭐'} {product.category}</span>
              </div>
              <h4 style={{ margin: '8px 0 4px 0', color: '#ffd166', fontSize: '16px', fontWeight: 700 }}>{product.name}</h4>
              {product.description && <p style={{ margin: '0 0 12px 0', color: 'rgba(230,240,255,0.6)', fontSize: '12px', lineHeight: 1.4 }}>{product.description}</p>}
              
              {packages.length > 0 && (
                <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '11px', color: '#06b6d4', fontWeight: 700, marginBottom: '8px' }}>💰 الحزم ({packages.length}):</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                    {packages.slice(0, 4).map((pkg: any, idx: number) => (
                      <div key={idx} style={{ background: 'rgba(255,209,102,0.1)', border: '1px solid rgba(255,209,102,0.2)', borderRadius: '6px', padding: '6px 8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffd166' }}>{pkg.name}</div>
                      </div>
                    ))}
                  </div>
                  {packages.length > 4 && <div style={{ fontSize: '10px', color: 'rgba(230,240,255,0.5)', marginTop: '6px' }}>و {packages.length - 4} حزم أخرى...</div>}
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleEdit(product)} style={{ flex: 1, padding: '8px', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, transition: 'all 0.3s' }} onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'} onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}>✏️ تعديل</button>
                <button onClick={() => handleDelete(product.id)} style={{ flex: 1, padding: '8px', background: 'rgba(255, 100, 100, 0.15)', border: '1px solid rgba(255, 100, 100, 0.3)', color: '#ff6464', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, transition: 'all 0.3s' }} onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255, 100, 100, 0.25)'} onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255, 100, 100, 0.15)'}>🗑️ حذف</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PaymentsManager() {
  const [payments, setPayments] = useState<any>({
    bank_khartoum: {
      name: 'بنك الخرطوم',
      icon: '🏦',
      account: '(4063552)',
      accountName: 'المنذر عبد المنعم',
      info: 'رقم الحساب: (4063552) | الاسم: المنذر عبد المنعم',
    },
    fawry: {
      name: 'فوري',
      icon: '💳',
      info: 'اختر مزود فوري وأرسل رقم طلب الايداع إلى الدعم',
    },
    kashi: {
      name: 'كاشي',
      icon: '📱',
      info: 'استخدم محفظة كاشي لتحويل المبلغ إلى الحساب الخاص بنا',
    },
    zaincash: {
      name: 'زين كاش',
      icon: '💰',
      wallet: '099XXXXXXX',
      walletName: 'YallaAshan',
      info: 'رقم المحفظة: 099XXXXXXX | الاسم: YallaAshan',
    },
  });

  const [editingMethod, setEditingMethod] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>({});

  const startEdit = (method: string) => {
    setEditingMethod(method);
    setEditingData({ ...payments[method] });
  };

  const saveChanges = () => {
    if (editingMethod) {
      setPayments({
        ...payments,
        [editingMethod]: editingData,
      });
      localStorage.setItem(`payment_${editingMethod}`, JSON.stringify(editingData));
      setEditingMethod(null);
      alert('تم حفظ التغييرات بنجاح! ✅');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditingData({
      ...editingData,
      [field]: value,
    });
  };

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
        padding: '24px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '6px', color: '#ffd166', fontSize: '20px', fontWeight: 800 }}>💳 إدارة طرق الدفع</h2>
        <p style={{ margin: 0, color: 'rgba(230,240,255,0.6)', fontSize: '13px' }}>قم بإدارة وتحديث طرق الدفع المتاحة للعملاء</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {Object.entries(payments).map(([key, method]: any) => (
          <div
            key={key}
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.08))',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255, 209, 102, 0.4)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(124,58,237,0.15)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.12)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <div style={{ fontSize: '32px' }}>{method.icon}</div>
              <div>
                <h3 style={{ margin: '0 0 4px 0', color: '#ffd166', fontSize: '16px', fontWeight: 700 }}>
                  {method.name}
                </h3>
              </div>
            </div>

            {/* Content */}
            {editingMethod === key ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Bank Khartoum */}
                {key === 'bank_khartoum' && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>
                        رقم الحساب
                      </label>
                      <input
                        type="text"
                        value={editingData.account || ''}
                        onChange={(e) => handleInputChange('account', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          background: 'rgba(255,255,255,0.05)',
                          color: '#fff',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>
                        اسم صاحب الحساب
                      </label>
                      <input
                        type="text"
                        value={editingData.accountName || ''}
                        onChange={(e) => handleInputChange('accountName', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          background: 'rgba(255,255,255,0.05)',
                          color: '#fff',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </>
                )}

                {/* Fawry */}
                {key === 'fawry' && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>
                      معلومات فوري
                    </label>
                    <textarea
                      value={editingData.info || ''}
                      onChange={(e) => handleInputChange('info', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.05)',
                        color: '#fff',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        minHeight: '80px',
                        fontFamily: 'Cairo, sans-serif',
                      }}
                    />
                  </div>
                )}

                {/* Kashi */}
                {key === 'kashi' && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>
                      معلومات كاشي
                    </label>
                    <textarea
                      value={editingData.info || ''}
                      onChange={(e) => handleInputChange('info', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.05)',
                        color: '#fff',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        minHeight: '80px',
                        fontFamily: 'Cairo, sans-serif',
                      }}
                    />
                  </div>
                )}

                {/* Zaincash */}
                {key === 'zaincash' && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>
                        رقم المحفظة
                      </label>
                      <input
                        type="text"
                        value={editingData.wallet || ''}
                        onChange={(e) => handleInputChange('wallet', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          background: 'rgba(255,255,255,0.05)',
                          color: '#fff',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>
                        اسم المحفظة
                      </label>
                      <input
                        type="text"
                        value={editingData.walletName || ''}
                        onChange={(e) => handleInputChange('walletName', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          background: 'rgba(255,255,255,0.05)',
                          color: '#fff',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </>
                )}

                {/* Save/Cancel Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '12px' }}>
                  <button
                    onClick={saveChanges}
                    style={{
                      background: 'linear-gradient(135deg, #00ff7f, #00cc66)',
                      border: 'none',
                      color: '#000',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(0, 255, 127, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                  >
                    ✅ حفظ
                  </button>
                  <button
                    onClick={() => setEditingMethod(null)}
                    style={{
                      background: 'rgba(255, 100, 100, 0.2)',
                      border: '1px solid rgba(255, 100, 100, 0.3)',
                      color: '#ff6464',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    }}
                  >
                    ❌ إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: '13px', color: 'rgba(230,240,255,0.75)', lineHeight: 1.6 }}>
                  {method.info}
                </div>
                <button
                  onClick={() => startEdit(key)}
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                    border: 'none',
                    color: '#fff',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(124,58,237,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  ✏️ تعديل
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentManager() {
  const [content, setContent] = useState<any>({
    contact: {
      email: 'mohastore249@gmail.com',
      whatsapp: '+249912550719',
    },
    agents: {
      description: 'نحن نعمل مع شبكة من الوكلاء المعتمدين لتقديم خدمات الشحن والبطاقات الرقمية بسرعة، أمان وموثوقية.',
      faqs: [
        { id: 1, question: 'ما هي شروط الانضمام؟', answer: 'الشروط الأساسية تشمل وجود وسيلة اتصال موثوقة، رقم حساب صالح، والالتزام بشروط الاستخدام.' },
        { id: 2, question: 'هل هناك رسوم للانضمام؟', answer: 'الانضمام مبدئياً بدون رسوم؛ قد تختلف بعض الشروط للخدمات المميزة أو المناطق الخاصة.' },
        { id: 3, question: 'كيف يتم صرف الأرباح؟', answer: 'الأرباح تظهر في لوحة الوكلاء ويمكن سحبها عبر طرق الدفع المتاحة بعد إجراءات التحقق.' },
      ],
    },
  });

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>({});

  const startEdit = (section: string) => {
    setEditingSection(section);
    setEditingData(JSON.parse(JSON.stringify(content[section])));
  };

  const saveChanges = () => {
    if (editingSection) {
      setContent({
        ...content,
        [editingSection]: editingData,
      });
      localStorage.setItem(`content_${editingSection}`, JSON.stringify(editingData));
      setEditingSection(null);
      alert('تم حفظ التغييرات بنجاح! ✅');
    }
  };

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
        padding: '24px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '6px', color: '#ffd166', fontSize: '20px', fontWeight: 800 }}>🔧 محتوى الصفحات</h2>
        <p style={{ margin: 0, color: 'rgba(230,240,255,0.6)', fontSize: '13px' }}>عدّل معلومات الاتصال والوكلاء والأسئلة الشائعة</p>
      </div>

      <div style={{ display: 'grid', gap: '24px' }}>
        {/* Contact Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.08))',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', color: '#ffd166', fontSize: '16px', fontWeight: 700 }}>
            📧 قسم اتصل بنا
          </h3>

          {editingSection === 'contact' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={editingData.email || ''}
                  onChange={(e) => setEditingData({ ...editingData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    fontFamily: 'Cairo, sans-serif',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>
                  رقم الواتساب
                </label>
                <input
                  type="tel"
                  value={editingData.whatsapp || ''}
                  onChange={(e) => setEditingData({ ...editingData, whatsapp: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    fontFamily: 'Cairo, sans-serif',
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '12px' }}>
                <button
                  onClick={saveChanges}
                  style={{
                    background: 'linear-gradient(135deg, #00ff7f, #00cc66)',
                    border: 'none',
                    color: '#000',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  ✅ حفظ
                </button>
                <button
                  onClick={() => setEditingSection(null)}
                  style={{
                    background: 'rgba(255, 100, 100, 0.2)',
                    border: '1px solid rgba(255, 100, 100, 0.3)',
                    color: '#ff6464',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  ❌ إلغاء
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: 'rgba(230,240,255,0.6)' }}>البريد</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#fff' }}>{content.contact.email}</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: 'rgba(230,240,255,0.6)' }}>الواتساب</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#fff' }}>{content.contact.whatsapp}</p>
                </div>
              </div>
              <button
                onClick={() => startEdit('contact')}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  border: 'none',
                  color: '#fff',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                ✏️ تعديل
              </button>
            </>
          )}
        </div>

        {/* Agents Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.08))',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', color: '#ffd166', fontSize: '16px', fontWeight: 700 }}>
            👥 قسم وكلاء يلا اشحن
          </h3>

          {editingSection === 'agents' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>
                  وصف القسم
                </label>
                <textarea
                  value={editingData.description || ''}
                  onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    minHeight: '80px',
                    fontFamily: 'Cairo, sans-serif',
                  }}
                />
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#ffd166', fontSize: '13px' }}>الأسئلة الشائعة</h4>
                {editingData.faqs?.map((faq: any, idx: number) => (
                  <div key={idx} style={{ marginBottom: '12px', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                    <input
                      type="text"
                      placeholder="السؤال"
                      value={faq.question}
                      onChange={(e) => {
                        const newFaqs = [...editingData.faqs];
                        newFaqs[idx].question = e.target.value;
                        setEditingData({ ...editingData, faqs: newFaqs });
                      }}
                      style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '8px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.05)',
                        color: '#fff',
                        fontSize: '12px',
                        boxSizing: 'border-box',
                        fontFamily: 'Cairo, sans-serif',
                      }}
                    />
                    <textarea
                      placeholder="الإجابة"
                      value={faq.answer}
                      onChange={(e) => {
                        const newFaqs = [...editingData.faqs];
                        newFaqs[idx].answer = e.target.value;
                        setEditingData({ ...editingData, faqs: newFaqs });
                      }}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.05)',
                        color: '#fff',
                        fontSize: '12px',
                        boxSizing: 'border-box',
                        minHeight: '60px',
                        fontFamily: 'Cairo, sans-serif',
                      }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '12px' }}>
                <button
                  onClick={saveChanges}
                  style={{
                    background: 'linear-gradient(135deg, #00ff7f, #00cc66)',
                    border: 'none',
                    color: '#000',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  ✅ حفظ
                </button>
                <button
                  onClick={() => setEditingSection(null)}
                  style={{
                    background: 'rgba(255, 100, 100, 0.2)',
                    border: '1px solid rgba(255, 100, 100, 0.3)',
                    color: '#ff6464',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  ❌ إلغاء
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: 'rgba(230,240,255,0.6)' }}>الوصف</p>
                <p style={{ margin: 0, fontSize: '13px', color: 'rgba(230,240,255,0.8)', lineHeight: 1.5 }}>{content.agents.description}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>الأسئلة الشائعة ({content.agents.faqs?.length || 0})</p>
                {content.agents.faqs?.map((faq: any, idx: number) => (
                  <div key={idx} style={{ fontSize: '12px', marginBottom: '8px', paddingBottom: '8px', borderBottom: idx < content.agents.faqs.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                    <p style={{ margin: '0 0 4px 0', color: '#ffd166', fontWeight: 600 }}>السؤال {idx + 1}: {faq.question}</p>
                    <p style={{ margin: 0, color: 'rgba(230,240,255,0.7)' }}>الإجابة: {faq.answer.substring(0, 50)}...</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => startEdit('agents')}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  border: 'none',
                  color: '#fff',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                ✏️ تعديل
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminSettings() {
  const [adminEmail, setAdminEmail] = useState(() => localStorage.getItem('adminEmail') || 'admin@yallaashan.com');
  const [adminPassword, setAdminPassword] = useState(() => localStorage.getItem('adminPassword') || 'admin123');
  const [editMode, setEditMode] = useState(false);
  const [tempEmail, setTempEmail] = useState(adminEmail);
  const [tempPassword, setTempPassword] = useState(adminPassword);

  const handleSave = () => {
    if (!tempEmail || !tempPassword) {
      alert('⚠️ البريد الإلكتروني وكلمة المرور مطلوبان');
      return;
    }
    localStorage.setItem('adminEmail', tempEmail);
    localStorage.setItem('adminPassword', tempPassword);
    setAdminEmail(tempEmail);
    setAdminPassword(tempPassword);
    setEditMode(false);
    alert('✅ تم حفظ التغييرات بنجاح!');
  };

  const handleCancel = () => {
    setTempEmail(adminEmail);
    setTempPassword(adminPassword);
    setEditMode(false);
  };

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
        padding: '24px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '6px', color: '#ffd166', fontSize: '20px', fontWeight: 800 }}>⚙️ إعدادات حساب المسؤول</h2>
        <p style={{ margin: 0, color: 'rgba(230,240,255,0.6)', fontSize: '13px' }}>قم بتحديث بيانات الدخول إلى لوحة التحكم</p>
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.08))',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '12px',
          padding: '20px',
        }}
      >
        {editMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
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
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>
                كلمة المرور
              </label>
              <input
                type="password"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
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
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '12px' }}>
              <button
                onClick={handleSave}
                style={{
                  background: 'linear-gradient(135deg, #00ff7f, #00cc66)',
                  border: 'none',
                  color: '#000',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                ✅ حفظ التغييرات
              </button>
              <button
                onClick={handleCancel}
                style={{
                  background: 'rgba(255, 100, 100, 0.2)',
                  border: '1px solid rgba(255, 100, 100, 0.3)',
                  color: '#ff6464',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                ❌ إلغاء
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '14px', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>البريد الإلكتروني</p>
                <p style={{ margin: 0, fontSize: '14px', color: '#fff', wordBreak: 'break-all' }}>{adminEmail}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '14px', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: 'rgba(230,240,255,0.6)', fontWeight: 600 }}>كلمة المرور</p>
                <p style={{ margin: 0, fontSize: '14px', color: '#fff' }}>••••••••</p>
              </div>
            </div>
            <button
              onClick={() => setEditMode(true)}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                border: 'none',
                color: '#fff',
                padding: '12px 16px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              ✏️ تعديل بيانات الدخول
            </button>
          </>
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(255,209,102,0.1)', borderRadius: '8px', border: '1px solid rgba(255,209,102,0.2)' }}>
        <p style={{ margin: 0, fontSize: '12px', color: 'rgba(230,240,255,0.8)', lineHeight: 1.6 }}>
          <strong>⚠️ ملاحظة مهمة:</strong> تأكد من حفظ بيانات الدخول الجديدة في مكان آمن. ستحتاج إلى هذه البيانات لتسجيل الدخول إلى لوحة التحكم مجدداً.
        </p>
      </div>
    </div>
  );
}
