import { useCallback, useState } from "react";
import { Upload, X, Star } from "lucide-react";

interface ImageFileEntry {
  file: File;
  preview: string;
  isPrimary: boolean;
}

interface ImageUploaderProps {
  onChange: (files: ImageFileEntry[]) => void;
  maxFiles?: number;
}

export function ImageUploader({ onChange, maxFiles = 8 }: ImageUploaderProps) {
  const [images, setImages] = useState<ImageFileEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const newEntries: ImageFileEntry[] = Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, maxFiles - images.length)
        .map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          isPrimary: false,
        }));

      if (newEntries.length === 0) return;

      const updated = [...images, ...newEntries];
      if (!updated.some((img) => img.isPrimary) && updated.length > 0) {
        updated[0].isPrimary = true;
      }

      setImages(updated);
      onChange(updated);
    },
    [images, maxFiles, onChange]
  );

  const removeImage = useCallback(
    (index: number) => {
      const updated = images.filter((_, i) => i !== index);
      URL.revokeObjectURL(images[index].preview);

      if (images[index].isPrimary && updated.length > 0) {
        updated[0].isPrimary = true;
      }

      setImages(updated);
      onChange(updated);
    },
    [images, onChange]
  );

  const setPrimary = useCallback(
    (index: number) => {
      const updated = images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }));
      setImages(updated);
      onChange(updated);
    },
    [images, onChange]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = "";
    }
  };

  return (
    <div className='space-y-4'>
      {/* Drop Zone */}
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed p-8 cursor-pointer transition-colors duration-150
          ${
            isDragging
              ? "border-admin-accent bg-[var(--color-bg-subtle)]"
              : "border-[var(--color-border)] hover:border-admin-accent hover:bg-[var(--color-bg-subtle)]"
          }
          ${images.length >= maxFiles ? "opacity-50 pointer-events-none" : ""}
        `}>
        <Upload size={24} className='text-admin-muted' />
        <div className='text-center'>
          <span className='text-sm font-semibold text-admin-ink uppercase tracking-wide'>
            Drop images here
          </span>
          <p className='text-xs text-admin-muted mt-1'>
            or click to browse · {images.length}/{maxFiles} images
          </p>
        </div>
        <input
          type='file'
          multiple
          accept='image/*'
          onChange={handleFileInput}
          className='hidden'
        />
      </label>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
          {images.map((img, i) => (
            <div
              key={img.preview}
              className={`relative group border overflow-hidden aspect-square
                ${
                  img.isPrimary
                    ? "border-admin-accent border-2"
                    : "border-[var(--color-border)]"
                }
              `}>
              <img
                src={img.preview}
                alt={img.file.name}
                className='w-full h-full object-cover'
              />

              {/* Overlay controls */}
              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-start justify-between p-1.5'>
                <button
                  type='button'
                  onClick={() => setPrimary(i)}
                  title={img.isPrimary ? "Primary image" : "Set as primary"}
                  className={`p-1 transition-opacity
                    ${
                      img.isPrimary
                        ? "opacity-100 text-yellow-400"
                        : "opacity-0 group-hover:opacity-100 text-white hover:text-yellow-400"
                    }
                  `}>
                  <Star
                    size={16}
                    fill={img.isPrimary ? "currentColor" : "none"}
                  />
                </button>

                <button
                  type='button'
                  onClick={() => removeImage(i)}
                  title='Remove image'
                  className='opacity-0 group-hover:opacity-100 p-1 text-white hover:text-red-400 transition-opacity'>
                  <X size={16} />
                </button>
              </div>

              {img.isPrimary && (
                <div className='absolute bottom-0 inset-x-0 bg-admin-accent text-white text-[10px] font-bold uppercase tracking-widest text-center py-0.5'>
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
