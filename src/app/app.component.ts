import { Component } from '@angular/core';
import { BookService } from './services/books.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  constructor (private test:BookService) {}
  ngOnInit(): void {

  }
}
