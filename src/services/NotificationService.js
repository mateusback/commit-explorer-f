let showNotification = () => {};

export const NotificationService = {
    success: (message) => showNotification({ type: 'success', message }),
    error: (message) => showNotification({ type: 'error', message }),
    info: (message) => showNotification({ type: 'info', message }),
    register: (fn) => { showNotification = fn; },
};
