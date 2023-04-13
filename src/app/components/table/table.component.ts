import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { BookInterface } from 'src/app/interfaces/books.interface';
import { BooksService } from 'src/app/services/books.service';
import { ExportsService } from 'src/app/services/exports.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  selectedBook: any;
  chartModal: boolean = false;
  rangeDates: Date[] = [];
  minDate: Date;
  maxDate: Date;
  books$: Observable<BookInterface[]> = this.booksService.getAllBooks();
  bookForEditing$: BehaviorSubject<BookInterface> = new BehaviorSubject<BookInterface>(null);
  sortOrder: string = 'asc';
  showModal: boolean = false;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private booksService: BooksService, private exportService: ExportsService) { }

  customTitleSorter() {
    this.isLoading.next(true);
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.books$ = this.booksService.getAllBooks().pipe(
      map(books => books.map(book => {
        const numberStr = book.title.match(/\d+/)?.[0];
        const number = parseInt(numberStr || '0', 10);
        return { ...book, number };
      })),
      tap(booksWithNumber => {
        if (this.sortOrder === 'asc') {
          booksWithNumber.sort((a, b) => a.number - b.number);
        } else {
          booksWithNumber.sort((a, b) => b.number - a.number);
        }
      }),
      tap(()=>this.isLoading.next(false))
    );
  }

  ngOnInit(): void {
    this.configureCalendarOptions();
  }

  private configureCalendarOptions() {
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = (month === 0) ? 11 : month - 1;
    let prevYear = (prevMonth === 11) ? year - 1 : year;
    let nextMonth = (month === 11) ? 0 : month + 1;
    let nextYear = (nextMonth === 0) ? year + 1 : year;
    this.minDate = new Date();
    this.minDate.setMonth(prevMonth);
    this.minDate.setFullYear(prevYear);
    this.maxDate = new Date();
    this.maxDate.setMonth(nextMonth);
    this.maxDate.setFullYear(nextYear);
    let invalidDate = new Date();
    invalidDate.setDate(today.getDate() - 1);
  }

  applyFilterGlobal($event: any, stringVal: string) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  onSelectDates() {
    const [startDate, endDate] = this.rangeDates;

    if (startDate && endDate) {
    this.isLoading.next(true);
      this.books$ = this.booksService.getAllBooks().pipe(
        map(books => books.filter(book => {
          const publishDate = new Date(book.publishDate);
          return publishDate >= startDate && publishDate <= endDate;
        })),
      tap(()=>this.isLoading.next(false))
      );
    }
  }

  onClear() {
    this.books$ = this.booksService.getAllBooks();
  }

  onSelectCurrentMonthRange() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.rangeDates = [firstDayOfMonth, lastDayOfMonth];
    this.onSelectDates();
  }

  onSelectCurrentYearRange() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const firstDayOfYear = new Date(currentYear, 0, 1);
    const lastDayOfYear = new Date(currentYear, 11, 31);
    this.rangeDates = [firstDayOfYear, lastDayOfYear];
    this.onSelectDates();
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.bookForEditing$.next(null);
    this.showModal = false;
  }

  closeChart() {
    this.chartModal = !this.chartModal;
  }

  editBook(book: BookInterface) {
    this.bookForEditing$.next(book);
    this.openModal();
  }

  exportExcel(books: BookInterface[]) {
    this.exportService.exportExcel(books, 'books');
  }

  exportPDF(books: BookInterface[]) {
    this.exportService.exportPDF(books, 'books');
  }

  select(book: BookInterface) {
    if(this.selectedBook === book) {
      return this.selectedBook = null;
    }
      return this.selectedBook = book;
  }
}
