import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewordersComponent } from './vieworders.component';

describe('ViewordersComponent', () => {
  let component: ViewordersComponent;
  let fixture: ComponentFixture<ViewordersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewordersComponent]
    });
    fixture = TestBed.createComponent(ViewordersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
