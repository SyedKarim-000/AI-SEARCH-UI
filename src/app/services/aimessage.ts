import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AIMessage {

    constructor( private http: HttpClient    ) {

      }

      sendMessage(message: string) {

        return this.http.post(
        'https://localhost:7100/api/chat',
        {
            message
        }
        );

    }
}
