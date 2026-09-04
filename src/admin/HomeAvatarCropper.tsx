import ImageCropper from './ImageCropper';

type Props = {
  src: string;
  onCancel: () => void;
  onDone: (file: File) => void | Promise<void>;
  T: any;
};

// سازگاری با بخش قدیمی آواتار؛ موتور برش عمومی اکنون برای همه تصاویر پنل استفاده می‌شود.
export default function HomeAvatarCropper({ src, onCancel, onDone, T }: Props) {
  return (
    <ImageCropper
      src={src}
      T={T}
      title="تنظیم کادر آواتار"
      aspectRatio="1 / 1"
      circular
      outputLongSide={768}
      fileName="home-avatar.webp"
      onCancel={onCancel}
      onDone={onDone}
    />
  );
}
