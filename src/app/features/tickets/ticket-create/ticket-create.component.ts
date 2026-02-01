import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketService } from '../../../core/services/ticket.service';
import { TicketPriority, CreateTicketDTO } from '../../../core/models/ticket.model';
import { forkJoin, of } from 'rxjs';
import { switchMap, catchError, finalize } from 'rxjs/operators';

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
  selectedFiles: File[] = [];

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

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.selectedFiles.push(event.target.files[i]);
      }
    }
    // Reset the input value so the same file can be selected again if needed
    event.target.value = '';
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  onSubmit(): void {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    const createData: CreateTicketDTO = this.ticketForm.value;

    this.ticketService.createTicket(createData).pipe(
      switchMap(ticket => {
        if (this.selectedFiles.length > 0) {
          const uploadObservables = this.selectedFiles.map(file => 
            this.ticketService.uploadAttachment(ticket.id, file)
          );
          return forkJoin(uploadObservables).pipe(
            // If uploads fail, we still want to return the ticket creation success
            // but maybe warn the user? For now just catch error and log
            catchError(err => {
              console.error('Error uploading attachments', err);
              // Return null or empty array to continue the stream
              return of(null);
            })
          );
        } else {
          return of(null);
        }
      }),
      finalize(() => {
        this.isSaving = false;
      })
    ).subscribe({
      next: () => {
        this.created.emit();
        this.onClose();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to create ticket';
      }
    });
  }
}
