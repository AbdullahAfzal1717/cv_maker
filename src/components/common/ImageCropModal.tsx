"use client";

import React, { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Cropper from "react-easy-crop";
import { X, Check, ZoomIn } from "lucide-react";
import { getCroppedImage, type CropArea } from "../../utils/cropImage";

interface ImageCropModalProps {
  imageSrc: string;
  onCancel: () => void;
  onConfirm: (croppedDataUrl: string) => void;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  imageSrc,
  onCancel,
  onConfirm,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((_: CropArea, pixels: CropArea) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const cropped = await getCroppedImage(imageSrc, croppedAreaPixels);
      onConfirm(cropped);
    } finally {
      setIsProcessing(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-9999">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Adjust Photo</h3>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative w-full h-72 bg-slate-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="px-4 py-3 flex items-center gap-3">
          <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-slate-700"
          />
        </div>

        <div className="flex gap-2 px-4 pb-4">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="flex-1 py-2 rounded-lg text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 flex items-center justify-center gap-1 disabled:opacity-60"
          >
            <Check className="w-3.5 h-3.5" />
            {isProcessing ? "Saving..." : "Use Photo"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ImageCropModal;
