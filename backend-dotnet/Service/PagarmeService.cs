public class PagamentoService(IPagarmeService pagarmeService)
{

    public async Task<GerarCobrancaResponse> CriarCobranca(RealizarCobrancaPropostaRequest request, CancellationToken cancellationToken)
    {
        if (request.InformacoesCartao == null)
            throw new ArgumentException("Informações do cartão são obrigatórias");

        GerarCobrancaRequest body = new()
        {
            Descricao = $"Cobrança de seguro - Proposta {request.InformacoesProposta.NumeroProposta}",
            Token = request.InformacoesCartao.Token,
            FormaDePagamento = request.FormaPagamento.ToString(),
            NomeCartao = request.InformacoesCartao.NomeImpresso,
            QuantidadeParcelas = request.InformacoesCartao.QuantidadeParcelas,
            ValorTransacao = request.ValorTransacao,
            EmailPagador = request.Cliente?.Email,
            NomePagador = request.Cliente?.Nome,
            TipoDocumentoPagador = request.Cliente?.Documento?.Length == 11 ? "cpf" : "cnpj",
            DocumentoPagador = request.Cliente?.Documento,
            AbrevPais = request.ClienteEndereco?.PaisAbreviado,
            Bairro = request.ClienteEndereco?.Bairro,
            Cep = request.ClienteEndereco?.CEP,
            Cidade = request.ClienteEndereco?.Cidade,
            Estado = request.ClienteEndereco?.UF,
            NumeroEndereco = request.ClienteEndereco?.Numero,
            Rua = request.ClienteEndereco?.Logradouro
        };

        return await _gatewayPagamentos.GerarCobranca(body, cancellationToken);
    }
}