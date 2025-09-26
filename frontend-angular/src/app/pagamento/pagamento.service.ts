import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  RealizarCobrancaPedidoRequest,
  RealizarCobrancaPedidoResponse,
} from './pagamento.types';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PagamentoService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  realizarCobranca(body: RealizarCobrancaPedidoRequest): Observable<RealizarCobrancaPedidoResponse> {
    return this.http.post<RealizarCobrancaPedidoResponse>(
      `${this.baseUrl}/pagamento`,
      body
    );
  }
}