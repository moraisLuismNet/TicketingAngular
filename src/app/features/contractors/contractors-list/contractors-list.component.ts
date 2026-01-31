import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contractors-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Contractors Management</h1>
      </div>
      <div class="coming-soon">
        <h2>🚧 Coming Soon</h2>
        <p>This feature is under development</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: var(--spacing-xl);

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

    .coming-soon {
      background: var(--color-white);
      border-radius: var(--radius-lg);
      padding: var(--spacing-2xl);
      text-align: center;
      box-shadow: var(--shadow-md);

      h2 {
        font-size: var(--font-size-xl);
        color: var(--color-gray-800);
        margin-bottom: var(--spacing-md);
      }

      p {
        color: var(--color-gray-600);
      }
    }
  `]
})
export class ContractorsListComponent {}
