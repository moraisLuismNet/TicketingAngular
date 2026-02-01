import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketService } from '../../../core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Ticket, TicketStatus, TicketPriority, UpdateTicketDTO } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit {
  @Input() ticket!: Ticket;
  @Output() close = new EventEmitter<void>();
  @Output() ticketUpdated = new EventEmitter<void>();


  ticketForm!: FormGroup;
  isSaving = false;
  isUploading = false;
  canAddAttachment = false;




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
    private fb: FormBuilder,
    private ticketService: TicketService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeForms();
  }

  initializeForms(): void {
    const currentUser = this.authService.getCurrentUser();
    const isAgent = this.authService.isAgent();
    const isAdmin = this.authService.isAdmin();
    
    // Only the assigned agent or an admin can change the status
    const canChangeStatus = isAdmin || (isAgent && this.ticket.assignedAgentId === currentUser?.id);
    this.canAddAttachment = !isAgent; // Only customers can add attachments
    // User requested: "al abrir el ticket desde el agente logueado no se deberia mostrar add atachment"
    // So if isAgent is true (and not Admin), hide it.
    
    this.ticketForm = this.fb.group({
      title: [this.ticket.title, Validators.required],
      description: [this.ticket.description, Validators.required],
      status: [{ value: this.ticket.status, disabled: !canChangeStatus }, Validators.required],
      priority: [this.ticket.priority, Validators.required]
    });
  }



  onClose(): void {
    this.close.emit();
  }

  onCancel(): void {
    this.ticketForm.reset({
      title: this.ticket.title,
      description: this.ticket.description,
      status: this.ticket.status,
      priority: this.ticket.priority
    });
    this.onClose();
  }



  saveTicket(): void {
    if (this.ticketForm.invalid) return;

    this.isSaving = true;
    const updateData: UpdateTicketDTO = this.ticketForm.getRawValue();




    this.ticketService.updateTicket(this.ticket.id, updateData).subscribe({
      next: (updatedTicket) => {
        this.ticket = updatedTicket;
        this.isSaving = false;
        this.ticketForm.markAsPristine();
        this.ticketUpdated.emit();
        this.cdr.detectChanges();
        this.onClose();
      },




      error: (error) => {
        console.error('Failed to update ticket:', error);
        this.isSaving = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.ticketService.uploadAttachment(this.ticket.id, file).subscribe({
        next: (attachment) => {
          if (!this.ticket.attachments) {
            this.ticket.attachments = [];
          }
          this.ticket.attachments.push(attachment);
          this.isUploading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Failed to upload attachment:', error);
          this.isUploading = false;
        }
      });
    }
  }

  isImage(attachment: any): boolean {
    const validExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
    const fileName = attachment.fileName.toLowerCase();
    const contentType = attachment.contentType?.toLowerCase() || '';
    
    return validExtensions.some(ext => fileName.endsWith(ext)) || 
           contentType.startsWith('image/');
  }

  isVideo(attachment: any): boolean {
      const validExtensions = ['.mp4', '.webm', '.ogv', '.mov', '.avi', '.mkv', '.wmv', '.flv'];
      const fileName = attachment.fileName.toLowerCase();
      const contentType = attachment.contentType?.toLowerCase() || '';
      
      return validExtensions.some(ext => fileName.endsWith(ext)) || 
             contentType.startsWith('video/');
  }

  getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    
    switch (ext) {
      case 'pdf': return '📕';
      case 'doc':
      case 'docx': 
      case 'txt':
      case 'rtf': return '📄';
      case 'xls':
      case 'xlsx':
      case 'csv': return '📊';
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz': return '📦';
      default: return '📎';
    }
  }

  downloadAttachment(attachment: any): void {
    const isPdf = attachment.fileName.toLowerCase().endsWith('.pdf');
    
    if (attachment.filePath && !isPdf) {
      window.open(attachment.filePath, '_blank');
      return;
    }

    // Use blob download for PDFs or if filePath is missing to force browser download
    this.ticketService.downloadAttachment(this.ticket.id, attachment.id).subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = attachment.fileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
}
