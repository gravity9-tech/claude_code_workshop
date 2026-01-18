import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate with empty params when category is all', () => {
    const routerSpy = jest.spyOn((component as any).router, 'navigate');
    component.onFilterCategory('all');
    expect(routerSpy).toHaveBeenCalledWith(['/'], { queryParams: {} });
  });

  it('should navigate with category param when category is specified', () => {
    const routerSpy = jest.spyOn((component as any).router, 'navigate');
    component.onFilterCategory('green');
    expect(routerSpy).toHaveBeenCalledWith(['/'], { queryParams: { category: 'green' } });
  });
});
