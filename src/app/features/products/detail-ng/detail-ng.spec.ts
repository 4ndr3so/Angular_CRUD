import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailNg } from './detail-ng';

describe('DetailNg', () => {
  let component: DetailNg;
  let fixture: ComponentFixture<DetailNg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailNg]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailNg);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
