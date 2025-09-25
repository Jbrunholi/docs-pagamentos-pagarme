# Integração Pagar.me com TokenizeCard.js

Este repositório contém exemplos de **implementação segura de pagamentos com cartão de crédito** usando o **Pagar.me**.

## Introdução

Quando trabalhamos com pagamentos online, precisamos lidar com informações extremamente sensíveis — como número do cartão, CVV e data de validade. Essas informações **nunca devem transitar diretamente pelo backend da sua aplicação**. Para resolver esse problema de segurança, a Pagar.me fornece o **`tokenizecard.js`**, um script que roda no **frontend** e gera um **token seguro** a partir dos dados do cartão.

---

### 🔑 O que é o `tokenizecard.js`?

O `tokenizecard.js` é uma biblioteca JavaScript fornecida pela **Pagar.me** que permite capturar os dados do cartão diretamente no navegador do usuário e transformá-los em um **token temporário**.  
Esse token substitui os dados sensíveis e pode ser enviado com segurança ao seu backend.

- Para utilizar o tokenizecard.js é necessário cadastrar o domínio que fará a requisição para a Pagar.me. A liberação do domínio pode ser feita via dashboard nas configurações de conta.
- O token expira rapidamente (por segurança, geralmente em até 60 segundos).  
- O frontend **não precisa (nem deve)** enviar número do cartão, CVV ou validade para o backend.  
- O backend recebe somente o **token** e utiliza a `sk_*` (secret key) para processar a cobrança junto ao gateway da Pagar.me.

---

### 🖥️ Papel do Frontend

- Renderizar os campos de cartão utilizando os atributos do `tokenizecard.js` (`data-pagarmecheckout-element`).
- Coletar as informações de forma segura (sem armazenar no app).
- Gerar o **token** usando a `pk_*` (public key).
- Enviar apenas esse token e os dados de negócio (proposta, cotação, parcelas, etc.) para o backend.

👉 Isso garante que o frontend **nunca tenha contato direto** com a `sk_*` e nem precise armazenar dados de cartão.

---

### ⚙️ Papel do Backend

- Receber a requisição do frontend com o **token** do cartão.
- Usar a **chave secreta (`sk_*`)** para chamar a API do Pagar.me.
- Criar a cobrança (charge) no gateway, passando o token como `card_token`.
- Tratar o retorno da API (sucesso, recusado, boleto gerado, PIX, etc.).
- Encapsular a lógica de pagamento em um **serviço backend confiável**, deixando o frontend responsável apenas pela coleta e envio do token.

---

## Salvando dados do cartão (máscara)


O backend **não deve armazenar dados sensíveis do cartão**. Porém, em alguns casos pode ser necessário salvar informações não sensíveis para referência do cliente ou auditoria:


- **Nome impresso no cartão**
- **Número mascarado do cartão** (ex.: `**** **** **** 1234`)


### Exemplo de função utilitária
```ts
export function mascararNumeroCartao(numero: string){
    const digits = numero.replace(/\s+/g, "")
    if (digits.length < 6) return numero

    const prefix = digits.slice(0, 4)
    const sufix = digits.slice(-4)
    return `${prefix} **** **** ${sufix}`
}

```


Essa função transforma `4111111111111111` em `4111 **** **** 1111` antes de salvar no banco.


### Boas práticas de backend
- Salvar apenas: `nomeImpresso` e `numeroCartaoMascarado`.
- Nunca salvar CVV ou data de validade.
- Sempre vincular esses dados ao **id do cliente** ou **id da proposta/apólice** para o caso de uma futura auditoria.

---

## 📂 Estrutura
- `frontend-react/` → Exemplo completo em React.
- `frontend-angular/` → Exemplo completo em Angular.
- `backend-dotnet/` → Exemplo em .NET com Controller + Service.

---

## 🔑 Fluxo de Pagamento
1. Usuário preenche dados do cartão no frontend.
2. O **tokenizecard.js** gera um **token seguro** (substitui dados sensíveis).
3. O frontend envia somente o **token** + dados da proposta para o backend.
4. O backend cria a cobrança com `CardToken` via **Pagar.me**.

---

## 📘 Documentação oficial
- [TokenizeCard.js](https://docs.pagar.me/reference/tokenizecard-js)
- [API de Cobrança](https://docs.pagar.me/reference/criar-uma-cobranca)
