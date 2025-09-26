export interface PagamentoFormValues {
  numeroCartao: string;
  nomeImpresso: string;
  parcelas: number;
  aceitouTermos: boolean;
}

declare global {
    interface Window {
        PagarmeCheckout?: {
            init: (
                onSuccess: (data: any) => boolean | void,
                onFail?: (err: any) => boolean | void
            ) => void
        }
    }
}

export {}
