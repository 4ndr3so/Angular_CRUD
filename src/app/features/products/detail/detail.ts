import { ChangeDetectionStrategy, Component, ElementRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsApi, Product } from '../products-api';
import { map, switchMap } from 'rxjs';
@Component({
  selector: 'app-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Detail implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ProductsApi);
  private host = inject(ElementRef<HTMLElement>);

  product$ = this.route.paramMap.pipe(
    map(pm => Number(pm.get('id'))),
    switchMap(id => this.api.detail(id))
  );

  ngOnInit(): void {
    // Focus the main heading on navigation (WCAG: help screen-reader users)
    queueMicrotask(() => {
      const h1 = this.host.nativeElement.querySelector('h1') as HTMLElement | null;
      h1?.setAttribute('tabindex', '-1');
      h1?.focus();
    });
  }
}