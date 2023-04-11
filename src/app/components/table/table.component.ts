import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Observable, map, tap } from 'rxjs';
import { BookInterface } from 'src/app/interfaces/books.interface';
import { BookService } from 'src/app/services/books.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
 @ViewChild('dt') dt: Table | undefined;
books$: Observable<BookInterface[]> = this.booksService.getAllBooks();
sortOrder: string = 'asc';

constructor(private booksService: BookService) {}

customTitleSorter(){
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


applyFilterGlobal($event:any, stringVal:any) {
  this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
}

}
