import { TestBed } from '@angular/core/testing';

import { UploadImageActivitieService } from './upload-image-activitie.service';

describe('UploadImageActivitieService', () => {
  let service: UploadImageActivitieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadImageActivitieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
