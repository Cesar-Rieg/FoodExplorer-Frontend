import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Notification() {
    return (
        <ToastContainer 
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='colored'
        />
    );
}

function NotifySuccess({mensagem}) {
    return toast.success(mensagem);
}

function NotifyInfo({mensagem}) {
    return toast.info(mensagem);
}

function NotifyWarning({mensagem}) {
    return toast.warn(mensagem);
}

function NotifyError({mensagem}) {
    return toast.error(mensagem);
}


export { Notification, NotifySuccess, NotifyInfo, NotifyWarning, NotifyError };