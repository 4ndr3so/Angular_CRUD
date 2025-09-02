import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductsFacade } from '../state/products.facade';

type AddForm = FormGroup<{
  title: FormControl<string>;
  price: FormControl<number | null>;
  description: FormControl<string>;
}>;

@Component({
  selector: 'app-list-ng',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './list-ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListNg implements OnInit {
  private facade = inject(ProductsFacade);

  vm$ = this.facade.vm$;

  addForm: AddForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(60)] }),
    price: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(1)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] })
  });

  ngOnInit() {
    this.facade.enterListPage();
  }

  onSearch(v: string) { this.facade.search(v); }

  goto(p: number, pageCount: number) {
    const next = Math.min(Math.max(0, p), pageCount - 1);
    this.facade.goToPage(next);
  }

  submitCreate() {
    if (this.addForm.invalid) return;
    const { title, price, description } = this.addForm.getRawValue();
    this.facade.create(title, Number(price), description);
    this.addForm.reset();
  }

  trackById = (_: number, p: any) => p.id;
}
