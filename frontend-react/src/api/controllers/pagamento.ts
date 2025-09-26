import axios from "axios";

export interface RealizarCobrancaPedidoRequest {
  numeroPedido: string;
  token: string;
  numeroCartaoMascarado: string;
  nomeImpresso: string;
  quantidadeParcelas: number;
}

export interface RealizarCobrancaPedidoResponse {
  sucesso: boolean;
  numeroConfirmacao?: string;
  mensagemErro?: string;
}

export async function realizarCobranca(
  body: RealizarCobrancaPedidoRequest
): Promise<RealizarCobrancaPedidoResponse> {
  const { data } = await axios.post<RealizarCobrancaPedidoResponse>(
    "http://localhost:5000/api/pagamento",
    body
  );
  return data;
}