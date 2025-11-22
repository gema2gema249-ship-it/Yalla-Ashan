import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { auth } from '../lib/auth';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';

interface Order {
  id: string;
  userId: string;
  productName: string;
  price: number;
  paymentMethod: string;
  userPhone: string;
  userGameId: string;
  status: 'completed' | 'pending' | 'cancelled';
  createdAt: string;
}

export default function Orders() {
  const [, setLocation] = useLocation();
  const user = auth.getUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'cancelled'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLocation('/login');
    }
  }, [user, setLocation]);

  if (!user) {
    return null;
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const userId = JSON.parse(currentUser).id;
      const res = await fetch(`/api/orders/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => filter === 'all' || order.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { bg: 'rgba(0,255,100,0.3)', color: '#00ff7f' };
      case 'pending':
        return { bg: 'rgba(255,200,0,0.3)', color: '#ffca28' };
      case 'cancelled':
        return { bg: 'rgba(255,50,50,0.3)', color: '#ff4d4d' };
      default:
        return { bg: 'rgba(0,0,0,0.3)', color: '#fff' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل ✅';
      case 'pending':
        return 'منتظر ⏳';
      case 'cancelled':
        return 'ملغي ❌';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div style={{ direction: 'rtl', minHeight: '100vh' }}>
      <TopBar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main style={{ padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
        <h1 style={{ textAlign: 'center' }}>📦 طلباتي</h1>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {(['all', 'completed', 'pending', 'cancelled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(10px)',
                color: filter === f ? '#000' : '#fff',
                padding: '10px 20px',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: '0.3s',
                fontWeight: filter === f ? 'bold' : 'normal',
              }}
            >
              {f === 'all' ? 'الكل' : f === 'completed' ? 'المكتملة' : f === 'pending' ? 'المنتظرة' : 'الملغاة'}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#fff' }}>جاري التحميل...</div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(230,240,255,0.75)' }}>
            {filter === 'all' ? 'لا توجد طلبات بعد' : `لا توجد طلبات ${filter === 'completed' ? 'مكتملة' : filter === 'pending' ? 'منتظرة' : 'ملغاة'}`}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {filteredOrders.map((order) => {
              const statusColor = getStatusColor(order.status);
              return (
                <div
                  key={order.id}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '15px',
                    padding: '15px',
                    color: 'white',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '15px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{order.productName}</h3>
                      <p style={{ margin: '5px 0', color: 'rgba(230,240,255,0.75)', fontSize: '12px' }}>
                        <strong>الآيدي:</strong> {order.userGameId}
                      </p>
                      <p style={{ margin: '5px 0', color: 'rgba(230,240,255,0.75)', fontSize: '12px' }}>
                        <strong>الهاتف:</strong> {order.userPhone}
                      </p>
                      <p style={{ margin: '5px 0', color: 'rgba(230,240,255,0.75)', fontSize: '12px' }}>
                        <strong>طريقة الدفع:</strong> {order.paymentMethod}
                      </p>
                      <p style={{ margin: '5px 0', color: 'rgba(230,240,255,0.75)', fontSize: '12px' }}>
                        <strong>التاريخ:</strong> {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div style={{ textAlign: 'center', minWidth: '150px' }}>
                      <p style={{ margin: '0 0 10px 0', color: '#ffd166', fontSize: '20px', fontWeight: 'bold' }}>
                        {order.price} ج.س
                      </p>
                      <div
                        style={{
                          background: statusColor.bg,
                          color: statusColor.color,
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          fontSize: '14px',
                        }}
                      >
                        {getStatusLabel(order.status)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
