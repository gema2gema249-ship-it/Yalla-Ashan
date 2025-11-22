import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';

interface AgentContent {
  description: string;
  faqs: Array<{
    id: number;
    question: string;
    answer: string;
  }>;
}

const defaultFaqs = [
  {
    id: 1,
    question: 'ما هي شروط الانضمام؟',
    answer: 'الشروط الأساسية تشمل وجود وسيلة اتصال موثوقة، رقم حساب صالح، والالتزام بشروط الاستخدام.',
  },
  {
    id: 2,
    question: 'هل هناك رسوم للانضمام؟',
    answer: 'الانضمام مبدئياً بدون رسوم؛ قد تختلف بعض الشروط للخدمات المميزة أو المناطق الخاصة.',
  },
  {
    id: 3,
    question: 'كيف يتم صرف الأرباح؟',
    answer: 'الأرباح تظهر في لوحة الوكلاء ويمكن سحبها عبر طرق الدفع المتاحة بعد إجراءات التحقق.',
  },
];

export default function Agents() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [agentsContent, setAgentsContent] = useState<AgentContent>({
    description: 'نحن نعمل مع شبكة من الوكلاء المعتمدين لتقديم خدمات الشحن والبطاقات الرقمية بسرعة، أمان وموثوقية.',
    faqs: defaultFaqs,
  });

  useEffect(() => {
    // Load agents content from localStorage (saved by admin)
    const savedAgents = localStorage.getItem('content_agents');
    if (savedAgents) {
      try {
        const parsed = JSON.parse(savedAgents);
        setAgentsContent(parsed);
      } catch (e) {
        console.error('Error parsing agents content:', e);
      }
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم النسخ: ' + text);
  };

  return (
    <div style={{ direction: 'rtl', minHeight: '100vh' }}>
      <TopBar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main style={{ maxWidth: '1000px', margin: '26px auto', padding: '16px' }}>
        <section
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px',
            padding: '18px',
            marginBottom: '18px',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)', flex: 1, minWidth: '260px' }}>
              <div style={{ fontSize: '20px' }}>📧</div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 700 }}>البريد الإلكتروني</div>
                <div style={{ color: 'rgba(230,240,255,0.75)', fontSize: '13px', direction: 'ltr' }}>mohastore249@gmail.com</div>
              </div>
              <button
                onClick={() => copyToClipboard('mohastore249@gmail.com')}
                style={{
                  background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  color: '#001',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                نسخ
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)', flex: 1, minWidth: '260px' }}>
              <div style={{ fontSize: '20px' }}>💬</div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 700 }}>واتساب</div>
                <div style={{ color: 'rgba(230,240,255,0.75)', fontSize: '13px', direction: 'ltr' }}>+249912550719</div>
              </div>
              <button
                onClick={() => copyToClipboard('+249912550719')}
                style={{
                  background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  color: '#001',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                نسخ
              </button>
            </div>
          </div>
        </section>

        <section
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px',
            padding: '18px',
            marginBottom: '18px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <h1 style={{ margin: '6px 0 8px 0', color: '#ffd166', fontSize: '22px' }}>وكلاء يلا اشحن</h1>
          <p style={{ margin: 0, color: 'rgba(230,240,255,0.75)', lineHeight: 1.6 }}>
            {agentsContent.description}
          </p>
        </section>

        <section
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px',
            padding: '18px',
            marginBottom: '18px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <h2 style={{ marginTop: 0, color: '#ffd166' }}>مزايا الوكلاء</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '14px' }}>
            {[
              { icon: '🛡️', title: 'آمن وموثوق', desc: 'عمليات موثوقة وتدقيق إداري' },
              { icon: '⚡', title: 'شحن فوري', desc: 'تنفيذ الشحنات بسرعة' },
              { icon: '🕐', title: 'متاحون 24/7', desc: 'خدمة على مدار الساعة' },
              { icon: '💰', title: 'بدون عمولة مخفية', desc: 'نظام عمولات شفاف' },
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
                  borderRadius: '12px',
                  padding: '14px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.03)',
                  transition: 'transform .28s, box-shadow .28s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 40px rgba(0,0,0,0.5)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'none';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '26px', marginBottom: '8px', color: '#06b6d4' }}>{feature.icon}</div>
                <h3 style={{ margin: '6px 0', color: '#fff' }}>{feature.title}</h3>
                <p style={{ margin: 0, color: 'rgba(230,240,255,0.75)', fontSize: '14px' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px',
            padding: '18px',
            marginBottom: '18px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <h2 style={{ marginTop: 0, color: '#ffd166' }}>الأسئلة الشائعة</h2>
          <div style={{ marginTop: '12px' }}>
            {agentsContent.faqs.map((faq) => (
              <div
                key={faq.id}
                style={{
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.04)',
                  padding: '12px',
                  marginBottom: '10px',
                  border: '1px solid rgba(255,255,255,0.03)',
                }}
              >
                <div
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{faq.question}</div>
                  <div style={{ transition: 'transform .3s' }}>
                    {openFaq === faq.id ? '🔽' : '▶'}
                  </div>
                </div>
                {openFaq === faq.id && (
                  <div style={{ marginTop: '10px', color: 'rgba(230,240,255,0.75)', lineHeight: 1.6 }}>{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
