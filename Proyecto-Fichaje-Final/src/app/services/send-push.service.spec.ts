import { TestBed } from '@angular/core/testing';

import { SendPushService } from './send-push.service';

describe('SendPushService', () => {
  let service: SendPushService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendPushService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
