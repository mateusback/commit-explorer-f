import React, { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import { NotificationService } from '../../services/NotificationService';

const notificationColors = {
    success: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    error: 'bg-red-100 text-red-700 border-red-300',
    info: 'bg-blue-100 text-blue-700 border-blue-300',
};

export default function NotificationProvider({ children }) {
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        NotificationService.register((data) => {
            setNotification(data);
            setTimeout(() => setNotification(null), 5000);
        });
    }, []);

    return (
        <>
            {children}
            {notification && (
                <div className={`fixed top-4 right-4 border rounded-lg px-4 py-3 shadow-lg flex items-start space-x-3 ${notificationColors[notification.type]}`}>
                    <XCircle className="w-5 h-5 mt-1" />
                    <span>{notification.message}</span>
                </div>
            )}
        </>
    );
}
