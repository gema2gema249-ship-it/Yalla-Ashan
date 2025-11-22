import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface Product {
  id: string;
  name: string;
  icon: string;
  price: number;
  description: string;
}

interface ProductGridProps {
  category?: string;
  columns?: 3 | 2 | 1;
}

export default function ProductGrid({ category, columns = 3 }: ProductGridProps) {
  const [, setLocation] = useLocation();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        let allProducts = await res.json();
        
        // Filter by category if provided
        if (category) {
          allProducts = allProducts.filter((p: any) => p.category === category);
        }
        
        setProducts(allProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, [category]);

  const handleClick = (productId: string) => {
    const currentUser = localStorage.getItem('currentUser');
    
    // إذا لم يكن المستخدم مسجل، يتم توجيهه للتسجيل
    if (!currentUser) {
      setLocation('/register');
      return;
    }
    
    localStorage.setItem('selectedProductId', productId);
    setLocation('/product');
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '14px',
        marginTop: '12px',
      }}
    >
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => handleClick(product.id)}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 30px rgba(0,0,0,0.5)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'none';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
          style={{
            borderRadius: '16px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(8px)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            transition: 'transform .28s cubic-bezier(.2,.9,.3,1), box-shadow .28s',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '160px',
            backgroundImage: (product as any).image ? `url(${(product as any).image})` : undefined,
            backgroundSize: (product as any).image ? 'cover' : undefined,
            backgroundPosition: (product as any).image ? 'center' : undefined,
          }}
        >
          {!(product as any).image && (
            <>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>{product.icon}</div>
              <h3 style={{ margin: '0 0 8px 0', color: '#ffd166', textAlign: 'center', fontSize: '14px' }}>
                {product.name}
              </h3>
              <p style={{ margin: 0, color: 'rgba(255,209,102,0.8)', fontSize: '12px', textAlign: 'center', fontWeight: 600 }}>
                Yalla Ashan
              </p>
            </>
          )}
          {(product as any).image && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(2px)',
              }}
            >
              <h3 style={{ margin: '0 0 8px 0', color: '#ffd166', textAlign: 'center', fontSize: '14px' }}>
                {product.name}
              </h3>
              <p style={{ margin: 0, color: 'rgba(255,209,102,0.8)', fontSize: '12px', textAlign: 'center', fontWeight: 600 }}>
                Yalla Ashan
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
