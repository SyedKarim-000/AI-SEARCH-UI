import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AIMessage } from '../services/aimessage';
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  selector: 'app-user',
  styleUrls: ['./user.css'],
  templateUrl: './user.html',
})
export class User {
  messages = signal<Array<{ role: string; content: string }>>([]);
  userInput = '';

  constructor(private chatService: AIMessage) {}

  send() {
    if (!this.userInput || !this.userInput.trim()) return;
    this.messages.update(messages => [...messages, { role: 'user', content: this.userInput }]);
    this.chatService.sendMessage(this.userInput).subscribe((response: any) => {
      this.messages.update(messages => [...messages, { role: 'assistant', content: this.formatResponse(response) }]);
    }, (error: any) => {
      console.error('Chat request failed:', error);
      this.messages.update(messages => [...messages, { role: 'assistant', content: 'Unable to get a response. Check the API connection and try again.' }]);
    });
    this.userInput = '';
  }

  private formatResponse(response: string): string {
    let parsed: unknown;
    try {
      parsed = JSON.parse(response);
    } catch {
      return response;
    }

    if (typeof parsed === 'string') return parsed;
    if (parsed && typeof parsed === 'object') {
      const payload = parsed as Record<string, unknown>;
      const answer = payload['response'] ?? payload['message'] ?? payload['answer'] ?? payload['content'];
      if (typeof answer === 'string') return answer;
      return JSON.stringify(answer ?? parsed);
    }

    return String(parsed);
  }
}
