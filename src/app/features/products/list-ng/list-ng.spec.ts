import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNg } from './list-ng';

describe('ListNg', () => {
  let component: ListNg;
  let fixture: ComponentFixture<ListNg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListNg]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListNg);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
