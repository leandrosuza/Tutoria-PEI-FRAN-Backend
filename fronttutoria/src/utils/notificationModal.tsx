import { useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

export type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const initialState: ModalState = {
  isOpen: false,
  type: 'info',
  title: '',
  message: '',
};

export function useNotificationModal() {
  const [modal, setModal] = useState<ModalState>(initialState);

  const showModal = useCallback((type: ModalType, title: string, message: string, onConfirm?: () => void, onCancel?: () => void) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
      onCancel,
    });
  }, []);

  const showSuccess = useCallback((title: string, message: string) => {
    showModal('success', title, message);
  }, [showModal]);

  const showError = useCallback((title: string, message: string) => {
    showModal('error', title, message);
  }, [showModal]);

  const showWarning = useCallback((title: string, message: string) => {
    showModal('warning', title, message);
  }, [showModal]);

  const showInfo = useCallback((title: string, message: string) => {
    showModal('info', title, message);
  }, [showModal]);

  const showConfirm = useCallback((title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
    showModal('confirm', title, message, onConfirm, onCancel);
  }, [showModal]);

  const closeModal = useCallback(() => {
    setModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleConfirm = useCallback(() => {
    modal.onConfirm?.();
    closeModal();
  }, [modal.onConfirm, closeModal]);

  const handleCancel = useCallback(() => {
    modal.onCancel?.();
    closeModal();
  }, [modal.onCancel, closeModal]);

  const NotificationModalComponent = useCallback(() => {
    if (!modal.isOpen) return null;

    const iconConfig = {
      success: { icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-100' },
      error: { icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-100' },
      warning: { icon: AlertCircle, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
      info: { icon: Info, color: 'text-blue-500', bgColor: 'bg-blue-100' },
      confirm: { icon: AlertCircle, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
    };

    const config = iconConfig[modal.type];
    const Icon = config.icon;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in duration-200">
          {/* Header com ícone */}
          <div className="px-6 pt-6 pb-4 text-center">
            <div className={`w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Icon className={`w-8 h-8 ${config.color}`} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{modal.title}</h3>
            <p className="text-gray-500 text-sm">{modal.message}</p>
          </div>

          {/* Botões */}
          <div className="px-4 pb-6 flex gap-3 justify-center">
            {modal.type === 'confirm' ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                >
                  Confirmar
                </button>
              </>
            ) : (
              <button
                onClick={closeModal}
                className="px-8 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
              >
                OK
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }, [modal, closeModal, handleConfirm, handleCancel]);

  return {
    modal,
    showModal,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    closeModal,
    NotificationModalComponent,
  };
}
