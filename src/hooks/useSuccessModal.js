import { useState, useCallback } from 'react';

export const useSuccessModal = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    actionText: '',
    onAction: null,
    autoClose: true,
    autoCloseDelay: 3000
  });

  const showSuccess = useCallback((config) => {
    setModalState({
      isOpen: true,
      title: config.title || "Sucesso!",
      message: config.message || "Operação realizada com sucesso.",
      actionText: config.actionText || "Continuar",
      onAction: config.onAction || null,
      autoClose: config.autoClose !== undefined ? config.autoClose : true,
      autoCloseDelay: config.autoCloseDelay || 3000
    });
  }, []);

  const hideSuccess = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const showAnalysisSuccess = useCallback((onViewResults) => {
    showSuccess({
      title: "Análise Enviada!",
      message: "Sua análise foi iniciada com sucesso. Em breve você poderá visualizar os resultados na seção de projetos.",
      actionText: "Ver Projetos",
      onAction: onViewResults,
      autoClose: false
    });
  }, [showSuccess]);

  const showProjectCreated = useCallback(() => {
    showSuccess({
      title: "Projeto Criado!",
      message: "Seu projeto foi criado com sucesso e já está disponível na lista.",
      autoClose: true,
      autoCloseDelay: 2500
    });
  }, [showSuccess]);

  const showTokenConfigured = useCallback(() => {
    showSuccess({
      title: "Token Configurado!",
      message: "Seu token GitHub foi configurado com sucesso. Agora você pode analisar repositórios privados.",
      autoClose: true,
      autoCloseDelay: 2500
    });
  }, [showSuccess]);

  return {
    modalState,
    showSuccess,
    hideSuccess,
    showAnalysisSuccess,
    showProjectCreated,
    showTokenConfigured
  };
};
