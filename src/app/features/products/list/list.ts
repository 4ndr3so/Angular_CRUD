import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsApi, Product } from '../products-api';
import { Subject, combineLatest, startWith, switchMap, map, distinctUntilChanged } from 'rxjs';
import { auditTime } from 'rxjs/operators';

type AddForm = FormGroup<{
  title: FormControl<string>;
  price: FormControl<number | null>;
  description: FormControl<string>;
}>;


@Component({
  standalone: true,
  selector: 'app-list',
   imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './list.html',
  styleUrl: './list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class List implements OnInit {
  private api = inject(ProductsApi);

  // pagination
  readonly limit = signal(10);
  private pageIndex = signal(0); // 0-based page
  private pageChange$ = new Subject<number>();

  // search (noisy stream control)
  private searchInput$ = new Subject<string>();

  // derived paging math
  readonly skip = computed(() => this.pageIndex() * this.limit());

  // data stream: search or plain list
  readonly vm$ = combineLatest([
    this.searchInput$.pipe(startWith(''), auditTime(16), distinctUntilChanged()),
    this.pageChange$.pipe(startWith(0))
  ]).pipe(
    switchMap(([q]) => {
      const limit = this.limit();
      const skip = this.skip();
      return q ? this.api.search(q, limit, skip) : this.api.list(limit, skip);
    }),
    map(res => ({
      items: res.products,
      total: res.total,
      page: this.pageIndex(),
      pageCount: Math.max(1, Math.ceil(res.total / this.limit()))
    }))
  );

  // typed reactive form (create mini form)
  addForm: AddForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(60)] }),
    price: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(1)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] })
  });

  // a11y (WCAG): live region for errors
  formStatus = signal<'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'>('VALID');

  ngOnInit(): void {
    this.addForm.statusChanges.subscribe(s => this.formStatus.set(s as any));
  }

  onSearch(term: string) {
    this.pageIndex.set(0); // reset paging on new query
    this.searchInput$.next(term.trim());
  }

  goToPage(p: number, pageCount: number) {
    const next = Math.min(Math.max(0, p), pageCount - 1);
    if (next !== this.pageIndex()) {
      this.pageIndex.set(next);
      this.pageChange$.next(next);
    }
  }

  trackById = (_: number, p: Product) => p.id;

  submitCreate() {
    if (this.addForm.invalid) return;
    const { title, price, description } = this.addForm.getRawValue();
    this.api.create({ title, price: Number(price), description }).subscribe(created => {
      // naive: prepend new item visually by resetting search/paging
      this.onSearch('');
      this.addForm.reset();
      alert(`Created: ${created?.title ?? 'Unknown'}`);
    });
  }
}