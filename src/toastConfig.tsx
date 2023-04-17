
import { ToastProps, BaseToast, ErrorToast } from 'react-native-toast-message';

interface CustomSuccessToastProps extends ToastProps {
  text1: string;
  text2: string;
}

const text1Style = {
  fontSize: 17,
  color: 'white'
}

const text2Style = {
  fontSize: 14,
}

const toastConfig = {
  info: (props: CustomSuccessToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#00717C', backgroundColor: 'rgba(34, 43, 69, 1)' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={text1Style}
    />
  ),
  success: (props: CustomSuccessToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#2D9411', backgroundColor: 'rgba(34, 43, 69, 1)' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={text1Style}
    />
  ),
  error: (props: CustomSuccessToastProps) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#89150C', backgroundColor: 'rgba(34, 43, 69, 1)' }}
      text1Style={text1Style}
      text2Style={text2Style}
    />
  ),
}

export default toastConfig;