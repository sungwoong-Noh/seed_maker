import toast from 'react-hot-toast';

/**
 * 성공 토스트 알림
 */
export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-center',
    style: {
      background: '#10B981',
      color: '#FFFFFF',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
    },
    iconTheme: {
      primary: '#FFFFFF',
      secondary: '#10B981',
    },
  });
};

/**
 * 에러 토스트 알림
 */
export const showError = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-center',
    style: {
      background: '#EF4444',
      color: '#FFFFFF',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
    },
    iconTheme: {
      primary: '#FFFFFF',
      secondary: '#EF4444',
    },
  });
};

/**
 * 정보 토스트 알림
 */
export const showInfo = (message: string) => {
  toast(message, {
    duration: 3000,
    position: 'top-center',
    style: {
      background: '#2563EB',
      color: '#FFFFFF',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
    },
    icon: 'ℹ️',
  });
};

/**
 * 로딩 토스트 알림
 */
export const showLoading = (message: string) => {
  return toast.loading(message, {
    position: 'top-center',
    style: {
      background: '#FFFFFF',
      color: '#111827',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      border: '1px solid #E5E7EB',
    },
  });
};

/**
 * 토스트 제거
 */
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};
