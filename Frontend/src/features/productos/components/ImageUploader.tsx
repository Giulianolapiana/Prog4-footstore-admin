import { useCallback, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { uploadImages, deleteImage } from "../api/images";

interface ImageUploaderProps {
    value?: string | null; 
    publicId?: string | null; 
    onChange: (url: string, publicId?: string) => void; 
    onRemove: () => void;
}

export const ImageUploader = ({ value, publicId, onChange, onRemove }: ImageUploaderProps) => {
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const uploadMutation = useMutation({
        mutationFn: (files: File[]) => uploadImages(files),
        onSuccess: (data) => {
            if (data.length > 0) {
                onChange(data[0].url, data[0].public_id);
            }
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteImage(id),
        onSuccess: () => {
            onRemove();
        }
    });

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            uploadMutation.mutate(Array.from(e.dataTransfer.files));
        }
    }, [uploadMutation]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            uploadMutation.mutate(Array.from(e.target.files));
        }
    };

    const handleRemoveClick = () => {
        if (publicId) {
            deleteMutation.mutate(publicId);
        } else {
            onRemove();
        }
    };

    if (value) {
        return (
            <div className="relative group rounded-xl overflow-hidden border border-outline-variant/30 h-48 w-full bg-surface-container">
                <img src={value} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                        type="button"
                        onClick={handleRemoveClick}
                        disabled={deleteMutation.isPending}
                        className="bg-error text-on-error p-2 rounded-lg hover:bg-error/80 flex items-center gap-2 font-bold text-sm disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                        {deleteMutation.isPending ? 'Borrando...' : 'Quitar Imagen'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-3 py-11
              ${dragging
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-outline-variant hover:border-primary/60 hover:bg-surface-container-highest"
                }`}
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${dragging ? "bg-primary/20" : "bg-surface-container-high"}`}>
                {uploadMutation.isPending ? (
                    <span className="material-symbols-outlined text-primary animate-spin">sync</span>
                ) : (
                    <span className="material-symbols-outlined text-on-surface-variant">cloud_upload</span>
                )}
            </div>
            
            <div className="text-center">
                {uploadMutation.isPending ? (
                    <p className="text-sm font-semibold text-primary">Subiendo a la nube...</p>
                ) : (
                    <>
                        <p className="text-sm text-on-surface">
                            <span className="font-semibold text-primary">Click para buscar</span> o arrastrá
                        </p>
                        <p className="text-xs text-on-surface-variant mt-1">
                            PNG, JPG, WEBP · Máximo 5 MB
                        </p>
                    </>
                )}
            </div>

            {uploadMutation.isError && (
                 <p className="text-xs text-error font-semibold text-center mt-2 px-4">
                     Error: {(uploadMutation.error as Error).message}
                 </p>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
                onChange={handleFileSelect}
                disabled={uploadMutation.isPending}
            />
        </div>
    );
};