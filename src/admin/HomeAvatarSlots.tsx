import { useCallback, useEffect, useRef, useState } from 'react';
import { ZkStethoscopeIcon, ZkUploadIcon } from './adminIcons';

const DEFAULT_HOME = [
  { id: '1', url: '/images/specialist/home-avatar-1.webp' },
  { id: '2', url: '/images/specialist/home-avatar-2.webp' },
  { id: '3', url: '/images/specialist/home-avatar-3.webp' },
  { id: '4', url: '/images/specialist/home-avatar-4.webp' },
];

const VIEW = 280;
const OUT = 768;

function isAllowed(f: File) {
  return ['image/jpeg', 'image/png', 'image/webp'].includes(f.type) && f.size <= 8 * 1024 * 1024;
}

function AvatarCropper({
  src,
  onCancel,
  onDone,
  T,
}: {
  src: string;
  onCancel: () => void;
  onDone: (file: File) => void;
  T: any;
}) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [minScale, setMinScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const [busy, setBusy] = useState(false);

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
    el.onerror = () => setImg(null);
    el.src = src;
  }, [src]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setPos({
      x: drag.current.px + (e.clientX - drag.current.x),
      y: drag.current.py + (e.clientY - drag.current.y),
    });
  };
  const onPointerUp = () => {
    drag.current = null;
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
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 8000,
        background: 'rgba(15,23,42,.62)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(420px,100%)',
          background: T.card || '#fff',
          borderRadius: 18,
          padding: 16,
          boxShadow: '0 20px 50px rgba(0,0,0,.25)',
        }}
      >
        <b style={{ display: 'block', marginBottom: 8, color: T.ttl }}>تنظیم کادر آواتار</b>
        <p style={{ fontSize: 12, color: T.mut, lineHeight: 1.7, margin: '0 0 12px' }}>
          عکس را بکشید تا صورت داخل دایره بیفتد. با اسلایدر بزرگ‌نمایی کنید. مثل اینستاگرام فقط همین کادر ذخیره می‌شود.
        </p>
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            width: VIEW,
            height: VIEW,
            margin: '0 auto 12px',
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
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>زوم</label>
        <input
          type="range"
          min={minScale}
          max={Math.max(minScale * 3, minScale + 0.2)}
          step={0.01}
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          style={{ width: '100%', marginBottom: 14 }}
        />
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

export default function HomeAvatarSlots({
  imgs,
  editCfg,
  setEditCfg,
  fileToData,
  deleteStoredImage,
  T,
  AdminBtn,
}: any) {
  const rawHome = imgs?.specialistHome || {};
  const options: any[] = Array.isArray(rawHome.options) && rawHome.options.length === 4 ? rawHome.options : DEFAULT_HOME;
  const selectedId = String(rawHome.selectedId || options.find((o: any) => o?.url)?.id || '1');
  const setHome = (next: any) => setEditCfg({ ...editCfg, images: { ...imgs, specialistHome: next } });
  const [crop, setCrop] = useState<{ id: string; src: string; replaceOld?: string } | null>(null);

  const applyFile = async (id: string, file: File, oldUrl?: string) => {
    const prev = oldUrl && /^https:\/\//i.test(oldUrl) ? oldUrl : undefined;
    const url = await fileToData(file, prev, 'images');
    const nextOpts = options.map((o: any) => (String(o.id) === String(id) ? { ...o, url } : o));
    setHome({ selectedId: id, options: nextOpts });
  };

  const openFile = (id: string, f: File | undefined, oldUrl?: string) => {
    if (!f) return;
    if (!isAllowed(f)) {
      alert('فقط JPG / PNG / WEBP تا ۸ مگابایت');
      return;
    }
    const src = URL.createObjectURL(f);
    setCrop({ id, src, replaceOld: oldUrl });
  };

  return (
    <div className="zkad-media-slot">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <b style={{ fontSize: 13, color: T.ttl }}>
          <ZkStethoscopeIcon size={14} color={T.ttl} /> عکس کارشناس صفحه اصلی (آواتار دایره‌ای)
        </b>
      </div>
      <p style={{ fontSize: 11, color: T.mut, margin: '0 0 12px', lineHeight: 1.8 }}>
        یکی را برای هوم انتخاب کنید. با «تنظیم کادر» مثل اینستاگرام مشخص کنید کدام قسمت داخل دایره باشد. بعد «ذخیره تنظیمات تصاویر» را بزنید.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {options.map((opt: any, idx: number) => {
          const on = String(opt.id) === selectedId && !!opt.url;
          return (
            <div key={opt.id || idx} style={{ border: `2px solid ${on ? T.acc : T.brd}`, borderRadius: 14, padding: 10, background: on ? `${T.acc}10` : T.card }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: opt.url ? 'pointer' : 'default', marginBottom: 8, fontSize: 12, fontWeight: 800 }}>
                <input type="radio" name="home-avatar-pick" disabled={!opt.url} checked={on} onChange={() => opt.url && setHome({ selectedId: opt.id, options })} />
                عکس {idx + 1}
                {on ? ' — فعال در هوم' : ''}
              </label>
              {opt.url ? (
                <img src={opt.url} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: '50%', border: `2px solid ${T.brd}`, display: 'block', marginBottom: 8 }} onError={(e: any) => { e.currentTarget.style.display = 'none'; }} />
              ) : (
                <div style={{ width: 72, height: 72, borderRadius: '50%', border: `1px dashed ${T.brd}`, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: T.mut }}>خالی</div>
              )}
              <label className="zkad-drop" style={{ padding: '8px 6px', marginBottom: 6 }}>
                <ZkUploadIcon size={16} />
                <span style={{ fontSize: 11 }}>آپلود و تنظیم کادر</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    e.currentTarget.value = '';
                    openFile(opt.id, f, opt.url);
                  }}
                />
              </label>
              {opt.url && (
                <button type="button" style={{ ...AdminBtn(), width: '100%', padding: '7px 8px', marginBottom: 6 }} onClick={() => setCrop({ id: opt.id, src: opt.url, replaceOld: opt.url })}>
                  تنظیم کادر
                </button>
              )}
              {opt.url && (
                <button
                  type="button"
                  style={{ ...AdminBtn(), color: T.err, width: '100%', padding: '7px 8px' }}
                  onClick={async () => {
                    if (!confirm('این عکس از لیست هوم حذف شود؟')) return;
                    if (opt.url && /^https:\/\//i.test(opt.url)) {
                      try { await deleteStoredImage(opt.url); } catch {}
                    }
                    const nextOpts = options.map((o: any) => (String(o.id) === String(opt.id) ? { ...o, url: '' } : o));
                    const still = nextOpts.find((o: any) => o.url);
                    setHome({ selectedId: still ? still.id : opt.id, options: nextOpts });
                  }}
                >
                  حذف این عکس
                </button>
              )}
            </div>
          );
        })}
      </div>
      {crop && (
        <AvatarCropper
          src={crop.src}
          T={T}
          onCancel={() => {
            if (crop.src.startsWith('blob:')) URL.revokeObjectURL(crop.src);
            setCrop(null);
          }}
          onDone={async (file) => {
            try {
              await applyFile(crop.id, file, crop.replaceOld);
            } catch (err: any) {
              alert(err?.message || 'آپلود انجام نشد');
            }
            if (crop.src.startsWith('blob:')) URL.revokeObjectURL(crop.src);
            setCrop(null);
          }}
        />
      )}
    </div>
  );
}
