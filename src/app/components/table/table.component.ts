import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Observable, map, tap } from 'rxjs';
import { BookInterface } from 'src/app/interfaces/books.interface';
import { BookService } from 'src/app/services/books.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  rangeDates: Date[] = [];
  minDate: Date ;
  maxDate: Date ;
  books$: Observable<BookInterface[]> = this.booksService.getAllBooks();
  sortOrder: string = 'asc';
  showModal: boolean = false;

  constructor(private booksService: BookService) { }

  customTitleSorter() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'; // toggle sort order
    // Trigger observable to re-sort and re-render
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
      })
    );

  }

  ngOnInit(): void {
    this.configureCalendarOptions();
    // this.invalidDates = [today,invalidDate];
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

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  onSelectDates() {
    console.log(this.rangeDates)
    const [startDate, endDate] = this.rangeDates;

    if (startDate && endDate) {
      this.books$ = this.booksService.getAllBooks().pipe(
        map(books => books.filter(book => {
          const publishDate = new Date(book.publishDate);
          return publishDate >= startDate && publishDate <= endDate;
        }))
      );
    }
  }

  onClear() {
    this.books$ = this.booksService.getAllBooks();
    console.log('aaa')
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
    console.log("open modal");
    this.showModal = !this.showModal;
  }
}
