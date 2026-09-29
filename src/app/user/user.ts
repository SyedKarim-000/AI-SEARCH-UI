import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIMessage } from '../services/aimessage';
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-user',
  styleUrls: ['./user.css'],
  templateUrl: './user.html',
})
export class User {
  messages: Array<{ role: string; content: string }> = [];
  userInput = '';

  constructor(private chatService: AIMessage) {}

  send() {
    if (!this.userInput || !this.userInput.trim()) return;
    this.messages.push({ role: 'user', content: this.userInput });
    this.chatService.sendMessage(this.userInput).subscribe((response: any) => {
      
      this.messages.push({ role: 'assistant', content: response });
    });
    this.userInput = '';
  }
}
