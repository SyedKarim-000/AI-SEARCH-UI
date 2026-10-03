import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RagAnswer, RagService } from '../services/rag';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-rag',
  styleUrls: ['./rag.css'],
  templateUrl: './rag.html',
})
export class Rag {
  readonly acceptedTypes = '.txt,.md,.csv,.json,.html,.htm';
  readonly ingesting = signal(false);
  readonly asking = signal(false);
  readonly error = signal('');
  readonly notice = signal('');
  readonly documentName = signal('');
  readonly chunksStored = signal<number | null>(null);
  readonly result = signal<RagAnswer | null>(null);
  question = '';

  constructor(private readonly ragService: RagService) {}

  async selectFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    this.error.set('');
    this.notice.set('');
    this.result.set(null);
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !['txt', 'md', 'csv', 'json', 'html', 'htm'].includes(extension)) {
      this.error.set('Choose a text, Markdown, CSV, JSON, or HTML file.');
      return;
    }

    this.ingesting.set(true);
    try {
      const content = await file.text();
      if (!content.trim()) {
        this.error.set('This file is empty. Choose a file with text content.');
        return;
      }

      this.ragService.ingestDocument(file.name, content).subscribe({
        next: response => {
          this.documentName.set(response.document || file.name);
          this.chunksStored.set(response.chunksStored);
          this.notice.set('Document indexed and ready for questions.');
          this.ingesting.set(false);
        },
        error: error => {
          this.error.set(this.getErrorMessage(error, 'Unable to index this document.'));
          this.ingesting.set(false);
        },
      });
    } catch {
      this.error.set('The selected file could not be read.');
      this.ingesting.set(false);
    }
  }

  ask(): void {
    const question = this.question.trim();
    if (!question || this.asking()) return;

    this.error.set('');
    this.notice.set('');
    this.asking.set(true);
    this.result.set(null);
    this.ragService.ask(question).subscribe({
      next: response => {
        this.result.set(response);
        this.asking.set(false);
      },
      error: error => {
        this.error.set(this.getErrorMessage(error, 'Unable to answer this question.'));
        this.asking.set(false);
      },
    });
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    const message = (error as { error?: unknown })?.error;
    if (typeof message === 'string') return message;
    if (message && typeof message === 'object' && 'title' in message) {
      return String((message as { title: unknown }).title);
    }
    return fallback;
  }
}