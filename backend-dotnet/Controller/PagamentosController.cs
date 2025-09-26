[ApiController]
[Route("pagamento/cobranca")]
public class PagamentosController(IPagamentoService pagamentoService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> RealizarCobranca([FromBody] RealizarCobrancaPedidoRequest request)
    {
        var result = await pagarmeService.CriarCobranca(request);
        return Ok(result);
    }
}