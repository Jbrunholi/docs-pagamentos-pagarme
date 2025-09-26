import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mascararNumeroCartao } from "./../../lib/utils/mask-card-number";
import { realizarCobranca } from "./../../api/controllers/pagamento";
import "./ResumoEPagamento.types"

export function usePagamento() {
  const form = useForm({
    defaultValues: {
      numeroCartao: "",
      nomeImpresso: "",
      parcelas: 1,
      aceitouTermos: false,
    },
  });

  const onSubmit = form.handleSubmit(() => {
    if (!window.PagarmeCheckout) {
      toast.error("Script da Pagar.me não carregado!");
      return;
    }

    window.PagarmeCheckout.init(
      (data) => {
        const token: string =
          data?.pagarmetoken ?? data?.["pagarmetoken-0"] ?? data?.id ?? "";

        if (!token) {
          toast.error("Não foi possível gerar o token");
          return false;
        }

        const valores = form.getValues();

        if (!valores.aceitouTermos) {
          toast.error("Você deve aceitar os termos");
          return false;
        }

        toast.promise(
          (async () => {
            const response = await realizarCobranca({
              numeroPedido: "123",
              token,
              numeroCartaoMascarado: mascararNumeroCartao(valores.numeroCartao),
              nomeImpresso: valores.nomeImpresso,
              quantidadeParcelas: valores.parcelas,
            });

            if (response.sucesso) {
              toast.success("Pagamento aprovado!");
            } else {
              toast.error("Pagamento recusado!");
            }
          })(),
          { loading: "Processando pagamento..." }
        );

        return false;
      },
      (err) => {
        toast.error("Erro ao processar pagamento", {
          description: err?.message,
        });
        return false;
      }
    );
  });

  return { form, onSubmit };
}