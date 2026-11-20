import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: any;
  onOpenJoinModal: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  isOpen,
  onClose,
  service,
  onOpenJoinModal,
}) => {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative max-w-lg w-full bg-[#151522] rounded-3xl overflow-hidden border border-[#E91E63]/40 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 bg-[#10101C] border-b border-gray-800 flex items-center justify-between">
          <span className="font-heading text-2xl font-bold text-white uppercase">{service.title || service.name}</span>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 sm:p-8 space-y-4">
          <p className="text-sm text-[#B8B5C2] leading-relaxed">
            {service.fullDesc || service.description}
          </p>
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-xs text-white">
              <CheckCircle2 className="w-4 h-4 text-[#E91E63]" />
              <span>Full supervision by certified sports conditioning experts</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white">
              <CheckCircle2 className="w-4 h-4 text-[#E91E63]" />
              <span>Includes periodic biomechanical and body composition scans</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white">
              <CheckCircle2 className="w-4 h-4 text-[#E91E63]" />
              <span>Custom macro & nutritional roadmap</span>
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenJoinModal();
              }}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#A51C55] to-[#E91E63] text-white font-bold text-xs uppercase tracking-wider"
            >
              Join This Program
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-[#10101C] border border-gray-800 text-gray-300 font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
