import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
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
constructor(private booksService: BookService) {}
applyFilterGlobal($event:any, stringVal:any) {
  this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
}

}
