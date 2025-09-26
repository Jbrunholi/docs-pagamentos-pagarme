using RestSharp;
using RestSharp.Serializers.NewtonsoftJson;
using System.Net;

namespace Proteo.Service;

public class GatewayPagamentosService : IGatewayPagamentosService
{
    public async Task<GerarCobrancaResponse> GerarCobranca(GerarCobrancaRequest body, CancellationToken cancellationToken)
{
    var request = new RestRequest("cobranca/gerar-cobranca", Method.Post);
    request.AddStringBody(JsonConvert.SerializeObject(body), DataFormat.Json);

    var response = await RealizarRequest<GerarCobrancaResponse>(request, cancellationToken);
    if (response.Data == null || !response.IsSuccessful)
        throw new ConexaoApiExternaException("GerarCobranca", "Cobranca", response.Content);

    return response.Data;
}
}