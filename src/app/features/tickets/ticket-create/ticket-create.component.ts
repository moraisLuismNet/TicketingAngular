import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketService } from '../../../core/services/ticket.service';
import { TicketPriority, CreateTicketDTO } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.css']
})
export class TicketCreateComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  ticketForm!: FormGroup;
  isSaving = false;
  errorMessage = '';

  ticketPriorities = [
    { value: TicketPriority.Low, label: 'Low' },
    { value: TicketPriority.Medium, label: 'Medium' },
    { value: TicketPriority.High, label: 'High' },
    { value: TicketPriority.Critical, label: 'Critical' }
  ];

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: [TicketPriority.Medium, Validators.required]
    });
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.ticketForm.invalid) return;

    this.isSaving = true;
    this.errorMessage = '';
    const createData: CreateTicketDTO = this.ticketForm.value;
    console.log('Sending CreateTicketDTO:', JSON.stringify(createData, null, 2));

    this.ticketService.createTicket(createData).subscribe({
      next: () => {
        this.isSaving = false;
        this.created.emit();
        this.onClose();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to create ticket';
        this.isSaving = false;
      }
    });
  }
}
