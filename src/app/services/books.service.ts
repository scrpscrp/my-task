import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookInterface } from '../interfaces/books.interface';
import { AddEditBookRequestModel } from '../interfaces/add-edit-book.interface';


@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }

  getAllBooks() : Observable<BookInterface[]>{
return this.http.get<BookInterface[]>('https://fakerestapi.azurewebsites.net/api/v1/Books')
  }
  addBook(book: AddEditBookRequestModel): Observable<AddEditBookRequestModel> {
    return this.http.post<AddEditBookRequestModel>('https://fakerestapi.azurewebsites.net/api/v1/Books', book);
  }

  editBook(bookId: number, book: AddEditBookRequestModel): Observable<AddEditBookRequestModel> {
    return this.http.put<AddEditBookRequestModel>(`https://fakerestapi.azurewebsites.net/api/v1/Books/${bookId}`, book);
  }

}
