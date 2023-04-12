import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
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
  modalTitle: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private booksService: BookService) { }

  ngOnInit(): void {
    this.createForm();
    this.populateFormValues();
    this.stashBookDataIntoStorage();
    this.configureModalTitle();
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
    const storageData = localStorage.getItem('bookData');
    const bookId = localStorage.getItem('bookId');

    if (this.bookForEditing !== null && this.bookForEditing.id.toString() !== bookId) {
      const formValues: Record<string, any> = {
        title: this.bookForEditing.title ?? '',
        description: this.bookForEditing.description ?? '',
        pageCount: this.bookForEditing.pageCount ?? '',
        publishDate: this.bookForEditing.publishDate ? new Date(this.bookForEditing.publishDate) : null
      };
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control) {
          control.setValue(formValues[key]);
        }
      });

      this.form.markAsPristine();
    }
    else {
      if (storageData) {
        const parsedData = JSON.parse(storageData);

        const formValues: Record<string, any> = {
          title: parsedData.title ?? '',
          description: parsedData.description ?? '',
          pageCount: parsedData.pageCount ?? '',
          publishDate: parsedData.publishDate ? new Date(parsedData.publishDate) : null
        };
        Object.keys(this.form.controls).forEach(key => {
          const control = this.form.get(key);
          if (control) {
            control.setValue(formValues[key]);
          }
        });

        this.form.markAsPristine();
      }
    }
  }

  private stashBookDataIntoStorage() {
    this.form.valueChanges.subscribe(() => {
      localStorage.setItem('bookData', JSON.stringify(this.form.value));
      if (this.bookForEditing !== null) {
        const bookId: string = this.bookForEditing.id.toString();
        localStorage.setItem('bookId', bookId);
      }
    })
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

  onCancelClicked() {
    localStorage.removeItem('bookId');
    localStorage.removeItem('bookData');
    this.onCloseModal();
  }

  onCloseModal() {
    this.close.emit();
  }

  private configureModalTitle() {
    let title: string = '';
    if (this.bookForEditing !== null) {
      title = 'Edit Book: ' + this.bookForEditing.title;
    } else title = 'Add New Book'

    this.modalTitle.next(title);
  }

}
