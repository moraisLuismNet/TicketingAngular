import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Ticket,
  CreateTicketDTO,
  UpdateTicketDTO,
  UpdateTicketStatusDTO,
  AddCommentDTO,
  TicketComment
} from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = `${environment.apiUrl}/tickets`;

  constructor(private http: HttpClient) {}

  getTickets(filters?: {
    status?: string;
    priority?: string;
    search?: string;
  }): Observable<Ticket[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.priority) params = params.set('priority', filters.priority);
      if (filters.search) params = params.set('search', filters.search);
    }

    return this.http.get<Ticket[]>(this.apiUrl, { params });
  }

  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  createTicket(data: CreateTicketDTO): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, data);
  }

  updateTicket(id: number, data: UpdateTicketDTO): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}`, data);
  }

  updateTicketStatus(id: number, data: UpdateTicketStatusDTO): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/${id}/status`, data);
  }

  deleteTicket(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addComment(ticketId: number, data: AddCommentDTO): Observable<TicketComment> {
    return this.http.post<TicketComment>(`${this.apiUrl}/${ticketId}/comments`, data);
  }
}
