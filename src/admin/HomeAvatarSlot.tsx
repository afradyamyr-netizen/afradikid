import { useState } from 'react';
import { ZkStethoscopeIcon, ZkUploadIcon } from './adminIcons';
import HomeAvatarCropper from './HomeAvatarCropper';

function isAllowed(f: File) {
  return ['image/jpeg', 'image/png', 'image/webp'].includes(f.type) && f.size <= 8 * 1024 * 1024;
}

export default function HomeAvatarSlot({
  imgs,
  editCfg,
  setEditCfg,
  fileToData,
  T,
  AdminBtn,
}: any) {
  const home = imgs?.homeAvatar || {};
  const up = (patch: any) => setEditCfg({ ...editCfg, images: { ...imgs, homeAvatar: { ...home, ...patch } } });
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [replaceOld, setReplaceOld] = useState<string | undefined>(undefined);

  const openFile = (f?: File) => {
    if (!f) return;
    if (!isAllowed(f)) {
      alert('فقط JPG / PNG / WEBP تا ۸ مگابایت');
      return;
    }
    setReplaceOld(home.url);
    setCropSrc(URL.createObjectURL(f));
  };

  return (
    <div className="zkad-media-slot">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <b style={{ fontSize: 13, color: T.ttl }}>
          <ZkStethoscopeIcon size={14} color={T.ttl} /> عکس کارشناس صفحه اصلی
        </b>
        <label style={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
          <input type="checkbox" checked={home.enabled !== false} onChange={(e) => up({ enabled: e.target.checked })} /> فعال
        </label>
      </div>
      {home.url && (
        <img
          src={home.url}
          alt=""
          style={{ width: 80, height: 80, objectFit: 'cover', objectPosition: 'center 18%', borderRadius: '50%', border: `2px solid ${T.brd}`, display: 'block', marginBottom: 8 }}
          onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
        />
      )}
      <label className="zkad-drop" style={{ marginBottom: 8 }}>
        <ZkUploadIcon size={22} />
        <span>آپلود تصویر از گوشی</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.currentTarget.value = '';
            openFile(f);
          }}
        />
      </label>
      {home.url && (
        <button type="button" style={{ ...AdminBtn(), width: '100%' }} onClick={() => { setReplaceOld(home.url); setCropSrc(home.url); }}>
          تنظیم کادر
        </button>
      )}
      {cropSrc && (
        <HomeAvatarCropper
          src={cropSrc}
          T={T}
          onCancel={() => {
            if (cropSrc.startsWith('blob:')) URL.revokeObjectURL(cropSrc);
            setCropSrc(null);
          }}
          onDone={async (file) => {
            try {
              const prev = replaceOld && /^https:\/\//i.test(replaceOld) ? replaceOld : undefined;
              const url = await fileToData(file, prev, 'images');
              up({ url, enabled: true });
            } catch (err: any) {
              alert(err?.message || 'آپلود انجام نشد');
            }
            if (cropSrc.startsWith('blob:')) URL.revokeObjectURL(cropSrc);
            setCropSrc(null);
          }}
        />
      )}
    </div>
  );
}
