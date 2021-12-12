import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeafletHandcodeComponent } from './leaflet-handcode.component';

describe('LeafletHandcodeComponent', () => {
  let component: LeafletHandcodeComponent;
  let fixture: ComponentFixture<LeafletHandcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeafletHandcodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeafletHandcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
