import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BookInterface } from 'src/app/interfaces/books.interface';
import { BookService } from 'src/app/services/books.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit  {
  @Output() closeChart = new EventEmitter<void>();
  @Input() books: BookInterface[] = [];

  constructor(private bookService:BookService) {}

  basicData: object;
  basicOptions: object;

  ngOnInit() {
    this.showBooksStat();   
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    }; 
  }

  showBooksStat() {
  const  year2022 = [];
  const  year2023 = [];
    this.bookService.getAllBooks().subscribe(books => {
      books.forEach(book=> {
        const year = new Date(book.publishDate).getFullYear();
        if (year === 2022) {
          year2022.push(book);
        } else if ( year === 2023) {
          year2023.push(book);
        }
      });
      this.basicData = {
        labels: ['2022','2023'],
        datasets: [
          {
            label: 'Books',
            data: [year2022.length, year2023.length],
            backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
            borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
            borderWidth: 2
          }
        ]
      };
    });
  }
}
