import { Component, signal, inject, OnInit, PLATFORM_ID, afterNextRender } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SeoService } from './services/seo.service';

interface Job {
  roleKey: string;
  company: string;
  start: string;
  end: string | null;
  noteKey?: string;
  bullets: string[];
  highlightKey?: string;
}

interface Project {
  name: string;
  kindKey: string;
  summaryKey: string;
  url?: string;
  image: string;
  tags: string[];
}

interface StackGroup {
  titleKey: string;
  items: { name: string; icon?: string }[];
}

interface Certification {
  nameKey: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TranslateModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly cvPath = 'cv/Jose-Sojo-Senior-Full-Stack-Developer.pdf';
  readonly email = 'josesojo2828@gmail.com';
  readonly phoneDisplay = '+58 412 860 6734';
  readonly phoneHref = 'tel:+584128606734';
  readonly whatsappUrl = 'https://wa.me/584128606734';
  readonly githubUrl = 'https://github.com/josesojo2828-tech';
  readonly linkedinUrl = 'https://www.linkedin.com/in/jose-sojo-14899b380/';

  // Theme & language
  isDarkMode = signal(true);
  currentLang = signal('es');

  // Contact form
  formData = {
    name: signal(''),
    email: signal(''),
    message: signal('')
  };
  isSending = signal(false);
  sentSuccess = signal(false);
  sendError = signal(false);
  emailCopied = signal(false);

  // Content: structure lives here, copy lives in public/i18n/*.json
  readonly experience: Job[] = [
    {
      roleKey: 'EXPERIENCE.JOBS.LEAD.ROLE',
      company: 'Sistemas Tecnológicos Alcaraván',
      start: '2025',
      end: null,
      noteKey: 'EXPERIENCE.JOBS.LEAD.NOTE',
      bullets: [
        'EXPERIENCE.JOBS.LEAD.B1',
        'EXPERIENCE.JOBS.LEAD.B2',
        'EXPERIENCE.JOBS.LEAD.B3'
      ]
    },
    {
      roleKey: 'EXPERIENCE.JOBS.ANALYST.ROLE',
      company: 'Sistemas Tecnológicos Alcaraván',
      start: '2025',
      end: 'Jul 2026',
      bullets: [
        'EXPERIENCE.JOBS.ANALYST.B1',
        'EXPERIENCE.JOBS.ANALYST.B2',
        'EXPERIENCE.JOBS.ANALYST.B3',
        'EXPERIENCE.JOBS.ANALYST.B4'
      ],
      highlightKey: 'EXPERIENCE.JOBS.ANALYST.HIGHLIGHT'
    },
    {
      roleKey: 'EXPERIENCE.JOBS.TEACHER.ROLE',
      company: 'UNERG — Universidad Rómulo Gallegos',
      start: '2025',
      end: null,
      bullets: ['EXPERIENCE.JOBS.TEACHER.B1', 'EXPERIENCE.JOBS.TEACHER.B2']
    },
    {
      roleKey: 'EXPERIENCE.JOBS.SIBCI.ROLE',
      company: 'SIBCI Guárico',
      start: '2022',
      end: '2025',
      bullets: ['EXPERIENCE.JOBS.SIBCI.B1', 'EXPERIENCE.JOBS.SIBCI.B2']
    },
    {
      roleKey: 'EXPERIENCE.JOBS.FREELANCE.ROLE',
      company: 'Independiente',
      start: '2021',
      end: null,
      bullets: [
        'EXPERIENCE.JOBS.FREELANCE.B1',
        'EXPERIENCE.JOBS.FREELANCE.B2',
        'EXPERIENCE.JOBS.FREELANCE.B3'
      ]
    }
  ];

  readonly projects: Project[] = [
    {
      name: 'Nutringest',
      kindKey: 'PROJECTS.KIND.OWN',
      summaryKey: 'PROJECTS.NUTRINGEST.SUMMARY',
      url: 'https://nutringest.quanticarch.com/',
      image: 'projects/nutringest.webp',
      tags: ['Next.js', 'Nuxt 3', 'NestJS', 'TypeScript', 'Supabase', 'PostgreSQL', 'Docker']
    },
    {
      name: 'Socius VE',
      kindKey: 'PROJECTS.KIND.FREELANCE',
      summaryKey: 'PROJECTS.SOCIUS.SUMMARY',
      url: 'https://sociusvex.quanticarch.com',
      image: 'projects/socius.webp',
      tags: ['Next.js', 'Nuxt 3', 'NestJS', 'Supabase', 'PostgreSQL', 'Docker', 'CI/CD']
    }
  ];

  readonly stackGroups: StackGroup[] = [
    {
      titleKey: 'STACK.FRONTEND',
      items: [
        { name: 'Vue 3', icon: 'devicon-vuejs-plain' },
        { name: 'Nuxt 3', icon: 'devicon-nuxtjs-plain' },
        { name: 'Next.js', icon: 'devicon-nextjs-plain' },
        { name: 'TypeScript', icon: 'devicon-typescript-plain' },
        { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-original' },
        { name: 'HTML / CSS' }
      ]
    },
    {
      titleKey: 'STACK.BACKEND',
      items: [
        { name: 'Node.js', icon: 'devicon-nodejs-plain' },
        { name: 'Go', icon: 'devicon-go-original-wordmark' },
        { name: 'Python', icon: 'devicon-python-plain' },
        { name: 'C#', icon: 'devicon-csharp-plain' },
        { name: '.NET', icon: 'devicon-dotnetcore-plain' },
        { name: '.NET Core' },
        { name: 'PostgreSQL', icon: 'devicon-postgresql-plain' },
        { name: 'Supabase' },
        { name: 'REST APIs' }
      ]
    },
    {
      titleKey: 'STACK.MOBILE',
      items: [
        { name: 'Flutter', icon: 'devicon-flutter-plain' },
        { name: 'React Native', icon: 'devicon-react-original' }
      ]
    },
    {
      titleKey: 'STACK.DEVOPS',
      items: [
        { name: 'AWS', icon: 'devicon-amazonwebservices-plain-wordmark' },
        { name: 'Docker', icon: 'devicon-docker-plain' },
        { name: 'Kubernetes', icon: 'devicon-kubernetes-plain' },
        { name: 'Nginx', icon: 'devicon-nginx-original' },
        { name: 'Terraform', icon: 'devicon-terraform-plain' },
        { name: 'Ansible', icon: 'devicon-ansible-plain' },
        { name: 'Linux', icon: 'devicon-linux-plain' },
        { name: 'GitLab / Jenkins' }
      ]
    },
    {
      titleKey: 'STACK.ARCH',
      items: [
        { name: 'Odoo ERP' },
        { name: 'ERP / CRM' },
        { name: 'SaaS' },
        { name: 'Serverless' },
        { name: 'Proxmox / KVM' }
      ]
    }
  ];

  readonly certifications: Certification[] = [
    { nameKey: 'EDUCATION.CERT_CCP' },
    { nameKey: 'EDUCATION.CERT_DEVOPS' },
    { nameKey: 'EDUCATION.CERT_QUEST' }
  ];

  constructor() {
    afterNextRender(() => {
      this.initTheme();
      this.initLang();
    });
  }

  ngOnInit() {
    this.updateSeo();
  }

  private initLang() {
    if (this.isBrowser) {
      const saved = localStorage.getItem('lang') || 'es';
      this.currentLang.set(saved);
      this.translate.setDefaultLang(saved);
      this.translate.use(saved);
      document.documentElement.lang = saved;
    } else {
      this.translate.setDefaultLang('es');
      this.translate.use('es');
    }
  }

  changeLang(lang: string) {
    this.currentLang.set(lang);
    this.translate.use(lang);
    if (this.isBrowser) {
      localStorage.setItem('lang', lang);
      document.documentElement.lang = lang;
    }
  }

  private initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
      this.isDarkMode.set(saved === 'dark');
    } else {
      this.isDarkMode.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode.set(!this.isDarkMode());
    this.applyTheme();
    if (this.isBrowser) {
      localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
    }
  }

  private applyTheme() {
    if (this.isBrowser) {
      const theme = this.isDarkMode() ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  /**
   * Secure submission: posts to the local Express proxy at /api/contact,
   * which forwards to Telegram so the bot token never reaches the client.
   */
  async sendEmail(event?: Event) {
    if (event) event.preventDefault();
    this.isSending.set(true);
    this.sendError.set(false);

    const data = {
      name: this.formData.name(),
      email: this.formData.email(),
      message: this.formData.message()
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        this.sentSuccess.set(true);
        this.formData.name.set('');
        this.formData.email.set('');
        this.formData.message.set('');
        setTimeout(() => this.sentSuccess.set(false), 5000);
      } else {
        console.error('Contact submission failed', response.status);
        this.sendError.set(true);
      }
    } catch (error) {
      console.error('Error in secure submission', error);
      this.sendError.set(true);
    } finally {
      this.isSending.set(false);
    }
  }

  async copyEmail() {
    try {
      await navigator.clipboard.writeText(this.email);
      this.emailCopied.set(true);
      setTimeout(() => this.emailCopied.set(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  }

  private updateSeo() {
    this.seo.updateTags({
      title: 'Jose Sojo | Senior Full-Stack Developer',
      description:
        'Senior Full-Stack Developer e Ingeniero en Informática. 4+ años construyendo y operando sistemas en producción con TypeScript, Nuxt/Vue, Node.js, Go y PostgreSQL. Cloud & DevOps: AWS, Docker, CI/CD.',
      keywords:
        'Senior Full-Stack Developer, Jose Sojo, Angular, Nuxt, Vue, TypeScript, Node.js, Go, PostgreSQL, Supabase, Docker, Kubernetes, AWS, DevOps, Cloud, Software Engineer'
    });
  }
}
