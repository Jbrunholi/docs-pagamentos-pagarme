public class RealizarCobrancaPedidoRequest
    {
        public string NumeroPedido { get; set; } = string.Empty;
        public int VersaoCotacao { get; set; }
        public CartaoInfo Cartao { get; set; } = null!;
    }

    public class CartaoInfo
    {
        public string Token { get; set; } = string.Empty;
        public string NumeroCartaoMascarado { get; set; } = string.Empty;
        public string NomeImpresso { get; set; } = string.Empty;
        public int QuantidadeParcelas { get; set; }
    }