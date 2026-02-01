import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="team-container">
      <div class="team-header">
        <div class="header-content">
          <h1>Agents Management</h1>
          <p>View and manage all registered support agents in the system.</p>
        </div>
      </div>

      @if (isLoading) {
        <div class="loading-container">
          <div class="spinner"></div>
        </div>
      }

      @if (errorMessage) {
        <div class="alert alert-error">
          {{ errorMessage }}
        </div>
      }

      @if (!isLoading && !errorMessage) {
        <div class="team-table">
          <table>
            <thead>
              <tr>
                <th>Joined Date</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (agent of agents; track agent.id) {
                <tr class="agent-row">
                  <td>{{ formatDate(agent.createdAt) }}</td>
                  <td class="agent-name">{{ agent.fullName }}</td>
                  <td>{{ agent.email }}</td>
                  <td>
                    <span class="badge" [ngClass]="agent.isActive ? 'badge-active' : 'badge-inactive'">
                      {{ agent.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>

          @if (agents.length === 0) {
            <div class="empty-state">
              <p>No agents found</p>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .team-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .team-header {
      margin-bottom: var(--spacing-xl);
      .header-content {
        h1 {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--color-gray-900);
          margin-bottom: var(--spacing-xs);
        }
        p {
          font-size: var(--font-size-sm);
          color: var(--color-gray-600);
        }
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: var(--spacing-2xl);
    }

    .team-table {
      background: var(--color-white);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      overflow: hidden;

      table {
        width: 100%;
        border-collapse: collapse;

        thead {
          background-color: var(--color-gray-50);
          border-bottom: 1px solid var(--color-gray-200);

          th {
            padding: var(--spacing-md);
            text-align: left;
            font-size: var(--font-size-sm);
            font-weight: 600;
            color: var(--color-gray-700);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
        }

        tbody {
          tr.agent-row {
            border-bottom: 1px solid var(--color-gray-200);
            transition: background-color var(--transition-fast);

            &:hover {
              background-color: var(--color-gray-50);
            }

            &:last-child {
              border-bottom: none;
            }
          }

          td {
            padding: var(--spacing-md);
            font-size: var(--font-size-sm);
            color: var(--color-gray-800);

            &.agent-name {
              font-weight: 500;
            }
          }
        }
      }
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: 600;
    }

    .badge-active {
      background-color: #ecfdf5;
      color: #059669;
    }

    .badge-inactive {
      background-color: #fef2f2;
      color: #dc2626;
    }

    .empty-state {
      padding: var(--spacing-2xl);
      text-align: center;
      color: var(--color-gray-600);
    }

    .alert-error {
      background-color: #fef2f2;
      color: #dc2626;
      padding: var(--spacing-md);
      border-radius: var(--radius-md);
      margin-bottom: var(--spacing-lg);
    }
  `]
})
export class TeamListComponent implements OnInit {
  agents: User[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadAgents();
  }

  loadAgents(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getUsers(UserRole.Agent).subscribe({
      next: (users) => {
        // Filter to ensure only agents are shown
        this.agents = users.filter(u => u.role === UserRole.Agent);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load agents';
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

