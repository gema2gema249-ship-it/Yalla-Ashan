import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';

interface Product {
  id: string;
  name: string;
  icon: string;
  image: string;
  price: number;
  description: string;
  packages?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  info: string;
}

const defaultPaymentMethods: PaymentMethod[] = [
  { id: 'bank_khartoum', name: 'بنك الخرطوم', info: 'رقم الحساب: (4063552) | الاسم: المنذر عبد المنعم' },
  { id: 'fawry', name: 'فوري', info: 'اختر مزود فوري وأرسل رقم طلب الايداع إلى الدعم' },
  { id: 'kashi', name: 'كاشي', info: 'استخدم محفظة كاشي لتحويل المبلغ إلى الحساب الخاص بنا' },
  { id: 'zaincash', name: 'زين كاش', info: 'رقم المحفظة: 099XXXXXXX | الاسم: YallaAshan' },
];

export default function ProductDetail() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [product, setProduct] = useState<Product | null>(null);
  const [packages, setPackages] = useState<string[]>([]);
  const [userId, setUserId] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [paymentImage, setPaymentImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(defaultPaymentMethods);

  useEffect(() => {
    const productId = localStorage.getItem('selectedProductId');
    if (!productId) {
      setLocation('/');
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) {
          setLocation('/');
          return;
        }
        const data = await res.json();
        setProduct(data);
        
        try {
          const parsedPackages = JSON.parse(data.packages || '[]');
          setPackages(parsedPackages);
        } catch {
          setPackages([]);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setLocation('/');
      }
    };

    // Load payment methods from localStorage (if admin has updated them)
    const loadPaymentMethods = () => {
      const methods: PaymentMethod[] = [];
      const paymentIds = ['bank_khartoum', 'fawry', 'kashi', 'zaincash'];
      
      paymentIds.forEach(id => {
        const stored = localStorage.getItem(`payment_${id}`);
        if (stored) {
          try {
            methods.push(JSON.parse(stored));
          } catch (e) {
            // Fall back to default if parsing fails
            const defaultMethod = defaultPaymentMethods.find(m => m.id === id);
            if (defaultMethod) methods.push(defaultMethod);
          }
        } else {
          // Use default if not in localStorage
          const defaultMethod = defaultPaymentMethods.find(m => m.id === id);
          if (defaultMethod) methods.push(defaultMethod);
        }
      });

      setPaymentMethods(methods.length > 0 ? methods : defaultPaymentMethods);
    };

    fetchProduct();
    loadPaymentMethods();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmOrder = () => {
    if (!userId || !whatsapp) {
      alert('يرجى ملء البيانات المطلوبة');
      return;
    }
    setShowPaymentModal(true);
  };

  const submitPayment = async () => {
    if (!selectedPayment) {
      alert('يرجى اختيار طريقة الدفع');
      return;
    }
    if (!paymentImage) {
      alert('يرجى إرفاق صورة تأكيد الدفع');
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const imageData = reader.result as string;
        const currentUser = localStorage.getItem('currentUser');
        const userId_val = currentUser ? JSON.parse(currentUser).id : 'guest';

        const orderData = {
          userId: userId_val,
          productId: product!.id,
          productName: product!.name,
          price: product!.price,
          selectedPackage: selectedPackage || 'default',
          paymentMethod: selectedPayment,
          paymentProofImage: imageData,
          userPhone: whatsapp,
          userGameId: userId,
          status: 'pending',
        };

        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });

        if (res.ok) {
          alert('✅ تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً على الواتساب');
          setUserId('');
          setWhatsapp('');
          setSelectedPackage('');
          setShowPaymentModal(false);
          setSelectedPayment('');
          setPaymentImage(null);
          setImagePreview('');
          setTimeout(() => setLocation('/'), 1000);
        } else {
          const error = await res.text();
          alert('❌ حدث خطأ في إرسال الطلب: ' + error);
        }
      };
      reader.readAsDataURL(paymentImage);
    } catch (err) {
      console.error('Error submitting order:', err);
      alert('❌ حدث خطأ في إرسال الطلب');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div style={{ direction: 'rtl', minHeight: '100vh' }}>
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main style={{ maxWidth: '900px', margin: '30px auto', padding: '20px', textAlign: 'center' }}>
          <p>جاري التحميل...</p>
        </main>
      </div>
    );
  }

  return (
    <div style={{ direction: 'rtl', minHeight: '100vh' }}>
      <TopBar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main style={{ maxWidth: '900px', margin: '30px auto', padding: '20px' }}>
        <section
          style={{
            background: '#223450',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 0 10px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div
              style={{
                width: '160px',
                height: '160px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '60px',
                backgroundImage: product.image ? `url(${product.image})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {!product.image && product.icon}
            </div>

            <div style={{ flex: 1, minWidth: '250px' }}>
              <h2 style={{ marginBottom: '10px', color: '#fff' }}>{product.name}</h2>
              <p style={{ color: '#d0d0d0', lineHeight: 1.6 }}>{product.description}</p>
              <p style={{ marginTop: '10px', color: '#ffd166', fontWeight: 'bold', fontSize: '18px' }}>
                Yalla Ashan
              </p>
            </div>
          </div>

          <div style={{ marginTop: '25px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', color: '#ddd' }}>
              اختر الحزمة:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
              {packages.length > 0 ? (
                packages.map((pkg: any, idx: number) => {
                  const pkgName = typeof pkg === 'string' ? pkg : pkg.name || '';
                  const pkgPrice = typeof pkg === 'object' ? pkg.price : product.price;
                  const pkgKey = typeof pkg === 'string' ? pkg : pkgName;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedPackage(pkgKey)}
                      style={{
                        background: selectedPackage === pkgKey ? '#7c3aed' : '#2c3f5c',
                        padding: '10px 18px',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        flex: '1 0 auto',
                        minWidth: '140px',
                        textAlign: 'center',
                        border: selectedPackage === pkgKey ? '2px solid #ffd166' : 'none',
                        cursor: 'pointer',
                        transition: '0.3s',
                        color: '#fff',
                        fontSize: '13px',
                      }}
                    >
                      {pkgName}
                    </button>
                  );
                })
              ) : (
                <div style={{ color: 'rgba(230,240,255,0.75)' }}>لا توجد حزم متاحة</div>
              )}
            </div>

            {selectedPackage && (
              <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(255, 209, 102, 0.15)', border: '1px solid rgba(255, 209, 102, 0.3)', borderRadius: '10px', textAlign: 'center' }}>
                <p style={{ margin: 0, color: '#ffd166', fontWeight: 'bold', fontSize: '16px' }}>
                  السعر: {
                    (() => {
                      let displayPrice = product.price;
                      for (let i = 0; i < packages.length; i++) {
                        const pkg = packages[i];
                        const pkgKey = typeof pkg === 'string' ? pkg : (pkg as any)?.name || '';
                        if (pkgKey === selectedPackage && (pkg as any)?.price) {
                          displayPrice = (pkg as any).price;
                          break;
                        }
                      }
                      return displayPrice;
                    })()
                  } ج.س
                </p>
              </div>
            )}
          </div>

          <div style={{ marginTop: '30px' }}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#ddd' }}>الآيدي الخاص بك *</label>
              <input
                type="text"
                placeholder="اكتب رقم الآيدي هنا"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '15px',
                  border: 'none',
                  borderRadius: '10px',
                  background: '#0e1b2d',
                  color: 'white',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#ddd' }}>رقم الواتساب للتواصل *</label>
              <input
                type="text"
                placeholder="اكتب رقمك هنا"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '15px',
                  border: 'none',
                  borderRadius: '10px',
                  background: '#0e1b2d',
                  color: 'white',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={confirmOrder}
                disabled={loading}
                style={{
                  background: loading ? '#555' : 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                  color: 'white',
                  padding: '14px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: '0.3s',
                }}
                onMouseEnter={(e) => !loading && ((e.currentTarget as HTMLElement).style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => !loading && ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
              >
                {loading ? 'جاري الإرسال...' : 'تأكيد الطلب 🚀'}
              </button>
              <button
                onClick={() => {
                  setUserId('');
                  setWhatsapp('');
                  setSelectedPackage('');
                  alert('تم إلغاء الطلب');
                  setTimeout(() => setLocation('/'), 500);
                }}
                disabled={loading}
                style={{
                  background: loading ? '#555' : 'linear-gradient(90deg, #ff6b6b, #ff4444)',
                  color: 'white',
                  padding: '14px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: '0.3s',
                }}
                onMouseEnter={(e) => !loading && ((e.currentTarget as HTMLElement).style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => !loading && ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
              >
                إلغاء الطلب ❌
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 300,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#223450',
              borderRadius: '16px',
              padding: '30px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
              direction: 'rtl',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <h2 style={{ marginTop: 0, color: '#ffd166', marginBottom: '20px' }}>طريقة الدفع</h2>

            {/* Payment Method Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', color: '#ddd' }}>
                اختر طريقة الدفع:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: selectedPayment === method.id ? '2px solid #ffd166' : '2px solid rgba(255,255,255,0.1)',
                      background: selectedPayment === method.id ? 'rgba(255, 209, 102, 0.1)' : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      transition: '0.3s',
                    }}
                  >
                    <div style={{ fontWeight: 'bold', color: selectedPayment === method.id ? '#ffd166' : '#fff' }}>
                      {method.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(230,240,255,0.75)', marginTop: '4px' }}>
                      {method.info}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', color: '#ddd' }}>
                إرفاق صورة تأكيد الدفع *
              </label>
              <div
                style={{
                  border: '2px dashed rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: '0.3s',
                  background: imagePreview ? 'rgba(255,209,102,0.05)' : 'transparent',
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                  id="paymentImage"
                />
                <label htmlFor="paymentImage" style={{ cursor: 'pointer', display: 'block' }}>
                  {imagePreview ? (
                    <div>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '150px',
                          borderRadius: '8px',
                          marginBottom: '10px',
                        }}
                      />
                      <div style={{ color: '#ffd166', fontSize: '12px' }}>انقر لتغيير الصورة</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>📸</div>
                      <div style={{ color: 'rgba(230,240,255,0.75)' }}>انقر لاختيار صورة</div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={submitPayment}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: loading ? '#555' : 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
              </button>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedPayment('');
                  setPaymentImage(null);
                  setImagePreview('');
                }}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
