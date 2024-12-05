/**
 * NOTE:    This only currently supports a single snackbar at a time,
 *          fine for current use cases but we might need to handle multiple
 *          snackbars in future.
 */
'use client';

import {
  ReactNode,
  SyntheticEvent,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Alert, AlertProps, AlertTitle, Snackbar } from '@mui/material';

type Notification = {
  message: ReactNode;
  extraDetails?: ReactNode;
  severity: AlertProps['severity'];
};

type NotificationContext = {
  notification: Notification | null;
  setNotification: (notification: Notification | null) => void;
};

type Props = {
  children: ReactNode;
};

const SnackbarContext = createContext<NotificationContext>({
  notification: null,
  setNotification: () => undefined,
});

export const useSnackbar = () => useContext(SnackbarContext);

export function SnackbarProvider({ children }: Props) {
  const [notification, setNotification] = useState<Notification | null>(null);

  return (
    <SnackbarContext.Provider value={{ notification, setNotification }}>
      <SnackbarWrapper />
      {children}
    </SnackbarContext.Provider>
  );
}

export function SnackbarWrapper() {
  const { notification, setNotification } = useSnackbar();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(!!notification);
  }, [notification]);

  function handleSnackbarClose(event: SyntheticEvent | Event, reason?: string) {
    if (reason !== 'clickaway') {
      handleClose();
    }
  }

  function handleClose() {
    setIsVisible(false);
    setTimeout(() => setNotification(null), 500);
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={isVisible}
      autoHideDuration={10000}
      onClose={handleSnackbarClose}
      sx={{ mt: 6 }}
    >
      <Alert
        elevation={2}
        onClose={handleClose}
        severity={notification?.severity}
        variant="standard"
        sx={{ width: '100%' }}
      >
        {notification?.extraDetails ? (
          <>
            <AlertTitle>{notification.message}</AlertTitle>
            {notification.extraDetails}
          </>
        ) : (
          notification?.message
        )}
      </Alert>
    </Snackbar>
  );
}
