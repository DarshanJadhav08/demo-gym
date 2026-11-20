import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show scroll-to-top button after scrolling down 300px
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleWhatsAppClick = () => {
    const phone = '919999900000';
    const message = encodeURIComponent(
      'Hello DemoFit Club! I would like to enquire about gym memberships, training programs, and booking a free demo tour.'
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* 1. Scroll to Top Floating Button (Auto shows at bottom-right when scrolled) */}
      {showScrollTop && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in zoom-in-75 duration-200">
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top of page"
            title="Back to Top"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#151522] border-2 border-[#E91E63] text-[#E91E63] hover:bg-[#E91E63] hover:text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group glow-accent"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* 2. Official WhatsApp Floating Button (Vertical Center on Right Side with Wave Animation) */}
      <div className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center">
        {/* Continuous Wave Pulse Rings (3 Staggered Ripple Layers) */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-whatsapp-wave-1 pointer-events-none" />
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-whatsapp-wave-2 pointer-events-none" />
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-whatsapp-wave-3 pointer-events-none" />

        {/* Compact Full Circle WhatsApp Button */}
        <button
          onClick={handleWhatsAppClick}
          aria-label="Open WhatsApp Chat"
          title="Chat on WhatsApp"
          className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#25D366] border-2 border-white flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group shadow-[0_4px_20px_rgba(37,211,102,0.6)]"
        >
          {/* Official WhatsApp Vector Icon */}
          <svg
            className="w-6 h-6 fill-white group-hover:scale-110 transition-transform duration-300"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </button>
      </div>
    </>
  );
};
