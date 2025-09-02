import React from 'react';
import { useSuccessModal } from '../hooks/useSuccessModal';
import { NotificationService } from './NotificationService';

/**
 * Serviço de Feedback Avançado
 * Combina notificações simples com modais de sucesso para diferentes cenários
 */
export class FeedbackService {
  static successModal = null;

  static configure(useSuccessModalHook) {
    this.successModal = useSuccessModalHook;
  }

  static info(message) {
    NotificationService.info(message);
  }

  static warning(message) {
    NotificationService.warning(message);
  }

  static error(message) {
    NotificationService.error(message);
  }

  static success(message) {
    NotificationService.success(message);
  }

  static showSuccessModal(config) {
    if (this.successModal) {
      this.successModal.showSuccess(config);
    }
  }

  static analysisSubmitted(onViewResults) {
    this.showSuccessModal({
      title: "Análise Enviada!",
      message: "Sua análise foi iniciada com sucesso. Em breve você poderá visualizar os resultados na seção de projetos.",
      actionText: "Ver Projetos",
      onAction: onViewResults,
      autoClose: false
    });
  }

  static projectCreated() {
    this.showSuccessModal({
      title: "Projeto Criado!",
      message: "Seu projeto foi criado com sucesso e já está disponível na lista.",
      autoClose: true,
      autoCloseDelay: 2500
    });
  }

  static tokenConfigured() {
    this.showSuccessModal({
      title: "Token Configurado!",
      message: "Seu token GitHub foi configurado com sucesso. Agora você pode analisar repositórios privados.",
      autoClose: true,
      autoCloseDelay: 2500
    });
  }

  static dataExported() {
    this.showSuccessModal({
      title: "Dados Exportados!",
      message: "Seus dados foram exportados com sucesso. Verifique sua pasta de downloads.",
      autoClose: true,
      autoCloseDelay: 3000
    });
  }

  static settingsSaved() {
    this.showSuccessModal({
      title: "Configurações Salvas!",
      message: "Suas configurações foram atualizadas com sucesso.",
      autoClose: true,
      autoCloseDelay: 2000
    });
  }
}

export const useFeedback = () => {
  const successModalHook = useSuccessModal();

  React.useEffect(() => {
    FeedbackService.configure(successModalHook);
  }, [successModalHook]);

  return {
    ...successModalHook,
    showInfo: FeedbackService.info,
    showWarning: FeedbackService.warning,
    showError: FeedbackService.error,
    showSuccess: FeedbackService.success,
    showAnalysisSuccess: FeedbackService.analysisSubmitted,
    showProjectCreated: FeedbackService.projectCreated,
    showTokenConfigured: FeedbackService.tokenConfigured,
    showDataExported: FeedbackService.dataExported,
    showSettingsSaved: FeedbackService.settingsSaved
  };
};
