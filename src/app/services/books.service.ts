import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookInterface } from '../interfaces/books.interface';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }

  getAllBooks() : Observable<BookInterface[]>{
return this.http.get<BookInterface[]>('https://fakerestapi.azurewebsites.net/api/v1/Books')
  }
}
