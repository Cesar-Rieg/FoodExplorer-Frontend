export class FrontEndException {
    Message;

    constructor(exception, message = null) {
        if (exception?.response) {
            this.Message = exception?.response?.data?.Message;
        }
        else if (message) {
            this.Message = message;
        }
        else {
            this.Message = "Não foi possível capturar a exceção.";
        }
    }
}