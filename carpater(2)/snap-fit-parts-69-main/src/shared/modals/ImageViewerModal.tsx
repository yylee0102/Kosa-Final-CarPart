import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export default function ImageViewerModal({ 
  isOpen, 
  onClose, 
  images, 
  currentIndex, 
  onIndexChange 
}: ImageViewerModalProps) {
  const [zoom, setZoom] = useState(1);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
      setZoom(1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      onIndexChange(currentIndex + 1);
      setZoom(1);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        handlePrevious();
        break;
      case 'ArrowRight':
        handleNext();
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-6xl max-h-[90vh] p-0 bg-black/95"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <DialogHeader className="absolute top-4 left-4 right-4 z-10 flex flex-row items-center justify-between">
          <DialogTitle className="text-white">
            이미지 {currentIndex + 1} / {images.length}
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="text-white hover:bg-white/20"
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-white text-sm min-w-16 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="text-white hover:bg-white/20"
              disabled={zoom >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="relative flex items-center justify-center h-[80vh] overflow-hidden">
          {/* 이전 버튼 */}
          {currentIndex > 0 && (
            <Button
              variant="ghost"
              size="lg"
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 h-12 w-12"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {/* 메인 이미지 */}
          <div className="flex items-center justify-center w-full h-full overflow-auto">
            <img
              src={images[currentIndex]}
              alt={`이미지 ${currentIndex + 1}`}
              className="max-w-none object-contain"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'center',
                transition: 'transform 0.2s ease-in-out',
                maxHeight: zoom === 1 ? '100%' : 'none',
                maxWidth: zoom === 1 ? '100%' : 'none'
              }}
              onDoubleClick={() => setZoom(zoom === 1 ? 2 : 1)}
            />
          </div>

          {/* 다음 버튼 */}
          {currentIndex < images.length - 1 && (
            <Button
              variant="ghost"
              size="lg"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 h-12 w-12"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}
        </div>

        {/* 썸네일 네비게이션 */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  onIndexChange(index);
                  setZoom(1);
                }}
                className={`w-12 h-12 overflow-hidden rounded border-2 transition-all ${
                  index === currentIndex 
                    ? 'border-primary scale-110' 
                    : 'border-white/30 hover:border-white/50'
                }`}
              >
                <img
                  src={image}
                  alt={`썸네일 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}