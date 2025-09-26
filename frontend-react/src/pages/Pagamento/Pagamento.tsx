import { usePagamento } from "./Pagamento.hook";
import { FormProvider } from "react-hook-form";

export function Pagamento() {
  const { form, onSubmit } = usePagamento();

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} data-pagarmecheckout-form>
        <input
          {...form.register("numeroCartao")}
          data-pagarmecheckout-element="number"
          placeholder="Número do cartão"
        />
        <input
          {...form.register("nomeImpresso")}
          data-pagarmecheckout-element="holder_name"
          placeholder="Nome impresso"
        />
        <input
          data-pagarmecheckout-element="expiration"
          placeholder="MM/AA"
        />
        <input
          data-pagarmecheckout-element="cvv"
          placeholder="CVV"
        />
        <button type="submit">Pagar</button>
      </form>
    </FormProvider>
  );
}