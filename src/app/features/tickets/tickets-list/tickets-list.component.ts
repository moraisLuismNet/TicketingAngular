import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../../core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Ticket, TicketStatus, TicketPriority, UpdateTicketDTO } from '../../../core/models/ticket.model';

import { TicketDetailComponent } from '../ticket-detail/ticket-detail.component';
import { TicketCreateComponent } from '../ticket-create/ticket-create.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-tickets-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TicketDetailComponent, TicketCreateComponent, PaginationComponent],
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.css']
})
export class TicketsListComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  selectedTicket: Ticket | null = null;
  isCreatingTicket = false;
  isLoading = false;
  errorMessage = '';
  Math = Math;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  paginatedTickets: Ticket[] = [];

  // Filters
  searchTerm = '';
  selectedStatus = '';
  selectedPriority = '';


  // Enums for template
  ticketStatuses = [
    { value: TicketStatus.Open, label: 'Open' },
    { value: TicketStatus.InProgress, label: 'In Progress' },
    { value: TicketStatus.Resolved, label: 'Resolved' },
    { value: TicketStatus.Closed, label: 'Closed' },
    { value: TicketStatus.Canceled, label: 'Canceled' }
  ];
  ticketPriorities = [
    { value: TicketPriority.Low, label: 'Low' },
    { value: TicketPriority.Medium, label: 'Medium' },
    { value: TicketPriority.High, label: 'High' },
    { value: TicketPriority.Critical, label: 'Critical' }
  ];

  constructor(
    private ticketService: TicketService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.ticketService.getTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load tickets';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    const filtered = this.tickets.filter(ticket => {
      const formattedDate = this.formatDate(ticket.createdAt);
      const matchesSearch = !this.searchTerm || 
        ticket.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        ticket.creatorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        formattedDate.includes(this.searchTerm);
      
      const matchesStatus = !this.selectedStatus || ticket.status === Number(this.selectedStatus);
      const matchesPriority = !this.selectedPriority || ticket.priority === Number(this.selectedPriority);
      
      return matchesSearch && matchesStatus && matchesPriority;
    });



    this.filteredTickets = filtered;
    this.updatePagination();
  }

  formatStatus(status: TicketStatus): string {
    return this.ticketStatuses.find(s => s.value === status)?.label || status.toString();
  }

  formatPriority(priority: TicketPriority): string {
    return this.ticketPriorities.find(p => p.value === priority)?.label || priority.toString();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTickets = this.filteredTickets.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onStatusChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onPriorityChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }


  selectTicket(ticket: Ticket): void {
    this.selectedTicket = ticket;
  }

  closeTicketDetail(): void {
    this.selectedTicket = null;
  }

  assignToMe(event: Event, ticket: Ticket): void {
    event.stopPropagation(); // Avoid selecting the row
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const updateData: UpdateTicketDTO = {
      status: TicketStatus.InProgress,
      assignedAgentId: currentUser.id
    };

    this.isLoading = true;
    this.ticketService.updateTicket(ticket.id, updateData).subscribe({
      next: () => {
        this.loadTickets();
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to assign ticket';
        this.isLoading = false;
      }
    });
  }


  openCreateTicket(): void {
    this.isCreatingTicket = true;
  }

  closeCreateTicket(): void {
    this.isCreatingTicket = false;
  }

  onTicketCreated(): void {
    this.loadTickets();
  }

  onTicketUpdated(): void {
    this.loadTickets();
  }


  getStatusClass(status: TicketStatus): string {
    const statusMap: Record<TicketStatus, string> = {
      [TicketStatus.Open]: 'badge-status-open',
      [TicketStatus.InProgress]: 'badge-status-in-progress',
      [TicketStatus.Resolved]: 'badge-status-resolved',
      [TicketStatus.Closed]: 'badge-status-closed',
      [TicketStatus.Canceled]: 'badge-status-canceled'
    };
    return statusMap[status] || '';
  }

  getPriorityClass(priority: TicketPriority): string {
    const priorityMap: Record<TicketPriority, string> = {
      [TicketPriority.Low]: 'badge-priority-low',
      [TicketPriority.Medium]: 'badge-priority-medium',
      [TicketPriority.High]: 'badge-priority-high',
      [TicketPriority.Critical]: 'badge-priority-critical'
    };
    return priorityMap[priority] || '';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  }
}
