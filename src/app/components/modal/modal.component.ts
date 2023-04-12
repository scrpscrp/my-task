import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddEditBookRequestModel } from 'src/app/interfaces/add-edit-book.interface';
import { BookInterface } from 'src/app/interfaces/books.interface';
import { BookService } from 'src/app/services/books.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Input() bookForEditing: BookInterface = null;

  form: FormGroup;
  
  constructor(private booksService: BookService) {}

  ngOnInit(): void {
    this.createForm();
    this.populateFormValues();
  }

  private createForm(): void {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      pageCount: new FormControl('', [Validators.required]),
      publishDate: new FormControl('', [Validators.required]),
    });
  }

  private populateFormValues(): void {
    if (this.bookForEditing !== null) {
      const formValues: Record<string, any> = {
        title: this.bookForEditing.title ?? '',
        description: this.bookForEditing.description ?? '',
        pageCount: this.bookForEditing.pageCount ?? '',
        publishDate: this.bookForEditing.publishDate ? new Date(this.bookForEditing.publishDate) : null // create Date object from string
      };
  
      // Loop over each control in the form group and set its value to the corresponding value in formValues
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control) { // Add check for null or undefined control
          control.setValue(formValues[key]);
        }
      });
  
      this.form.markAsPristine();
    }
  }

  isFormValid(): boolean {
    return this.form.valid && !this.form.pristine;
  }

  onEditBook(): void {
    if (this.isFormValid()) {
      const formValues: AddEditBookRequestModel = {
        Title: this.form.value.title,
        Description: this.form.value.description,
        PageCount: this.form.value.pageCount,
        PublishDate: this.form.value.publishDate
      };

      this.booksService.editBook(this.bookForEditing.id, formValues).subscribe();
    }
  }

  onAddBook(): void {
    if (this.isFormValid()) {
      const formValues: AddEditBookRequestModel = {
        Title: this.form.value.title,
        Description: this.form.value.description,
        PageCount: this.form.value.pageCount,
        PublishDate: this.form.value.publishDate
      };

      this.booksService.addBook(formValues).subscribe();
    }
  }

}
