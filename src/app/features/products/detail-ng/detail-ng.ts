import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsFacade } from '../state/products.facade';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-detail-ng',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailNg implements OnInit {
  private route = inject(ActivatedRoute);
  private facade = inject(ProductsFacade);

  product$ = this.route.paramMap.pipe(
    map(pm => Number(pm.get('id'))),
    tap(id => this.facade.loadDetail(id)),
    // select from store (detail is upserted by the effect)
    map(id => ({ id })), // you can select by entity map if needed
  );

  ngOnInit() {}
}
