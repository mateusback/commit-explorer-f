import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle, X, ArrowRight } from 'lucide-react';

export default function SuccessModal({ 
  isOpen, 
  onClose, 
  title = "Sucesso!", 
  message = "Operação realizada com sucesso.",
  actionText = "Continuar",
  onAction = null,
  autoClose = true,
  autoCloseDelay = 3000 
}) {
  const [showContent, setShowContent] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowContent(true), 100);
      setTimeout(() => setShowCheckmark(true), 300);
      
      if (autoClose) {
        setTimeout(() => {
          onClose();
        }, autoCloseDelay);
      }
    } else {
      setShowContent(false);
      setShowCheckmark(false);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 relative transform transition-all duration-500 ${
        showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ícone de Sucesso Animado */}
        <div className="flex justify-center mb-6">
          <div className={`relative transform transition-all duration-700 ${
            showCheckmark ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
          }`}>
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            {/* Efeito de ondas */}
            <div className={`absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20 ${
              showCheckmark ? 'block' : 'hidden'
            }`}></div>
            <div className={`absolute inset-0 bg-emerald-500 rounded-full animate-pulse opacity-10 ${
              showCheckmark ? 'block' : 'hidden'
            }`}></div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className={`text-center transform transition-all duration-500 delay-200 ${
          showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <h2 className="text-2xl font-bold text-stone-800 mb-3">{title}</h2>
          <p className="text-stone-600 leading-relaxed mb-6">{message}</p>

          {/* Botões de Ação */}
          <div className="space-y-3">
            {onAction && (
              <button
                onClick={onAction}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span>{actionText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            
            {!autoClose && (
              <button
                onClick={onClose}
                className="w-full text-stone-600 hover:text-stone-800 font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Fechar
              </button>
            )}
          </div>

          {/* Indicador de auto-close */}
          {autoClose && (
            <div className="mt-4">
              <div className="w-full bg-stone-200 rounded-full h-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all ease-linear"
                  style={{
                    animation: `shrink ${autoCloseDelay}ms linear forwards`
                  }}
                ></div>
              </div>
              <p className="text-xs text-stone-500 mt-2">
                Fechando automaticamente em {autoCloseDelay / 1000}s
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CSS para animação */}
      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

SuccessModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
  autoClose: PropTypes.bool,
  autoCloseDelay: PropTypes.number
};
