export interface RealizarCobrancaPedidoRequest {
  numeroPedido: string;
  versaoCotacao: number;
  token: string;
  numeroCartaoMascarado: string;
  nomeImpresso: string;
  quantidadeParcelas: number;
}

export interface RealizarCobrancaPedidoResponse {
  sucesso: boolean;
  numeroApolice?: string;
  mensagemErro?: string;
}