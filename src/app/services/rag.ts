import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface RagIngestResponse {
  document: string;
  chunksStored: number;
}

export interface RagSource {
  name: string;
  score: number;
  description: string;
}

export interface RagAnswer {
  answer: string;
  sources: RagSource[];
}

@Injectable({ providedIn: 'root' })
export class RagService {
  private readonly endpoint = 'https://localhost:7100/api/rag';

  constructor(private readonly http: HttpClient) {}

  ingestDocument(name: string, content: string) {
    return this.http.post<RagIngestResponse>(`${this.endpoint}/documents`, { name, content });
  }

  ask(question: string, topK = 5) {
    return this.http.post<RagAnswer>(`${this.endpoint}/ask`, { question, topK });
  }
}