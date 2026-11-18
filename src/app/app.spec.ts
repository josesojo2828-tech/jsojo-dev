import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('exposes a downloadable CV path', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance.cvPath).toBe(
      'cv/Jose-Sojo-Senior-Full-Stack-Developer.pdf'
    );
  });

  it('renders the full experience timeline', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance.experience.length).toBe(5);
  });

  it('links every public project to a real URL', () => {
    const fixture = TestBed.createComponent(App);
    for (const project of fixture.componentInstance.projects) {
      if (project.url) {
        expect(project.url.startsWith('https://')).toBe(true);
      }
    }
  });
});
