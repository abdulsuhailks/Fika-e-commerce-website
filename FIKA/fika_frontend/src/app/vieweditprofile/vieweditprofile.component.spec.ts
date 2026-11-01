import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VieweditprofileComponent } from './vieweditprofile.component';

describe('VieweditprofileComponent', () => {
  let component: VieweditprofileComponent;
  let fixture: ComponentFixture<VieweditprofileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VieweditprofileComponent]
    });
    fixture = TestBed.createComponent(VieweditprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
