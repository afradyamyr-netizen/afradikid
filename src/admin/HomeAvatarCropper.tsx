import { useCallback, useEffect, useRef, useState } from 'react';

const VIEW = 280;
const OUT = 768;

type Props = {
  src: string;
  onCancel: () => void;
  onDone: (file: File) => void;
  T: any;
};

export default function HomeAvatarCropper({ src, onCancel, onDone, T }: Props) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [minScale, setMinScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [busy, setBusy] = useState(false);
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinch = useRef<{ dist: number; scale: number } | null>(null);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  useEffect(() => {
    const el = new Image();
    el.crossOrigin = 'anonymous';
    el.onload = () => {
      const cover = Math.max(VIEW / el.naturalWidth, VIEW / el.naturalHeight);
      setMinScale(cover);
      setScale(cover);
      setPos({ x: 0, y: 0 });
      setImg(el);
    };
    el.src = src;
  }, [src]);

  const clampScale = useCallback((s: number, min: number) => Math.min(Math.max(s, min), min * 4), []);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const pts = [...pointers.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinch.current = { dist: dist || 1, scale };
      drag.current = null;
    } else if (pointers.current.size === 1) {
      drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size >= 2 && pinch.current) {
      const pts = [...pointers.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (pinch.current.dist > 0) {
        setScale(clampScale(pinch.current.scale * (dist / pinch.current.dist), minScale));
      }
      return;
    }
    if (drag.current && pointers.current.size === 1) {
      setPos({
        x: drag.current.px + (e.clientX - drag.current.x),
        y: drag.current.py + (e.clientY - drag.current.y),
      });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) drag.current = null;
    if (pointers.current.size === 1) {
      const p = [...pointers.current.values()][0];
      drag.current = { x: p.x, y: p.y, px: pos.x, py: pos.y };
    }
  };

  const confirm = useCallback(async () => {
    if (!img) return;
    setBusy(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = OUT;
      canvas.height = OUT;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('canvas');
      const dw = img.naturalWidth * scale * (OUT / VIEW);
      const dh = img.naturalHeight * scale * (OUT / VIEW);
      const dx = OUT / 2 + pos.x * (OUT / VIEW) - dw / 2;
      const dy = OUT / 2 + pos.y * (OUT / VIEW) - dh / 2;
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, OUT, OUT);
      ctx.drawImage(img, dx, dy, dw, dh);
      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('export'))), 'image/webp', 0.9);
      });
      onDone(new File([blob], 'home-avatar.webp', { type: 'image/webp' }));
    } catch {
      alert('برش تصویر انجام نشد. دوباره تلاش کنید.');
    } finally {
      setBusy(false);
    }
  }, [img, scale, pos, onDone]);

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 8000, background: 'rgba(15,23,42,.62)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: 'min(420px,100%)', background: T.card || '#fff', borderRadius: 18, padding: 16, boxShadow: '0 20px 50px rgba(0,0,0,.25)' }}
      >
        <b style={{ display: 'block', marginBottom: 8, color: T.ttl }}>تنظیم کادر آواتار</b>
        <p style={{ fontSize: 12, color: T.mut, lineHeight: 1.7, margin: '0 0 12px' }}>
          با یک انگشت عکس را جابه‌جا کنید. برای نزدیک/دور شدن از دو انگشت روی عکس استفاده کنید.
        </p>
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            width: VIEW,
            height: VIEW,
            margin: '0 auto 14px',
            borderRadius: '50%',
            overflow: 'hidden',
            position: 'relative',
            background: '#111',
            touchAction: 'none',
            cursor: 'grab',
            boxShadow: `0 0 0 3px ${T.acc || '#0f766e'}`,
          }}
        >
          {img && (
            <img
              src={src}
              alt=""
              draggable={false}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: img.naturalWidth * scale,
                height: img.naturalHeight * scale,
                transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={onCancel} style={{ flex: 1, minHeight: 44, borderRadius: 10, border: `1px solid ${T.brd}`, background: T.soft, cursor: 'pointer', fontFamily: 'inherit' }}>
            انصراف
          </button>
          <button type="button" disabled={!img || busy} onClick={confirm} style={{ flex: 1, minHeight: 44, borderRadius: 10, border: 0, background: T.acc || '#0f766e', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
            {busy ? 'در حال ذخیره…' : 'تأیید کادر'}
          </button>
        </div>
      </div>
    </div>
  );
}
