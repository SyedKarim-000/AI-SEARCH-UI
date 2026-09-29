import { TestBed } from '@angular/core/testing';
import { AIMessage } from './aimessage';

describe('AIMessage', () => {
  let service: AIMessage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AIMessage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
