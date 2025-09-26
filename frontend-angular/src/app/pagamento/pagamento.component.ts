import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PagamentoService } from './pagamento.service';
import { mascararNumeroCartao } from '../shared/utils/mask-card-number';

declare global {
  interface Window {
    PagarmeCheckout?: {
      init: (
        onSuccess: (data: any) => boolean | void,
        onFail?: (err: any) => boolean | void
      ) => void;
    };
  }
}

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
})
export class PagamentoComponent implements OnInit {
  loading = false;
  mensagem = '';

  form = this.fb.group({
    numeroCartao: ['', [Validators.required]],
    nomeImpresso: ['', [Validators.required]],
    parcelas: [1, [Validators.required, Validators.min(1)]],
    aceitar: [false, [Validators.requiredTrue]],
    numeroPedido: ['123', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private service: PagamentoService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    if (!window.PagarmeCheckout) {
      console.warn('tokenizecard.js não carregado (verifique index.html e domínio liberado)');
    }
  }

  onSubmit(): void {
    if (!window.PagarmeCheckout) {
      this.mensagem = 'Script da Pagar.me não carregado.';
      return;
    }

    if (this.form.invalid) {
      this.mensagem = 'Preencha os dados corretamente.';
      return;
    }

    // O tokenizecard irá interceptar o submit do form (ver template) e chamar esse init:
    window.PagarmeCheckout.init(
      // success
      (data) => {
        const token: string = data?.pagarmetoken ?? data?.['pagarmetoken-0'] ?? data?.id ?? '';
        if (!token) {
          this.zone.run(() => (this.mensagem = 'Não foi possível gerar o token.'));
          return false; // aborta submit nativo
        }

        const v = this.form.getRawValue();
        this.loading = true;
        this.mensagem = 'Processando pagamento...';

        // Chamada ao backend com token
        this.service
          .realizarCobranca({
            numeroPedido: String(v.numeroPedido),
            versaoCotacao: Number(v.versaoCotacao),
            token,
            numeroCartaoMascarado: mascararNumeroCartao(v.numeroCartao || ''),
            nomeImpresso: v.nomeImpresso || '',
            quantidadeParcelas: Number(v.parcelas) || 1,
          })
          .subscribe({
            next: (resp) => {
              this.zone.run(() => {
                this.loading = false;
                this.mensagem = resp.sucesso ? 'Pagamento aprovado!' : (resp.mensagemErro || 'Pagamento recusado.');
              });
            },
            error: (err) => {
              this.zone.run(() => {
                this.loading = false;
                this.mensagem = err?.error?.detail || 'Falha ao processar pagamento.';
              });
            },
          });

        return false; // impede submit nativo
      },
      // fail
      (err) => {
        this.zone.run(() => {
          this.mensagem = err?.message || 'Erro ao tokenizar o cartão.';
        });
        return false;
      }
    );
  }
}
