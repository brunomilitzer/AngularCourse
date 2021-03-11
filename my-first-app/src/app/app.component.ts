import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  /*styles: [`
    h3 {
      color: dodgerblue;
    }
  `]*/
})
export class AppComponent {
  name = 'Bruno';
  username = '';
  showSecret = false;
  log = [];

  onToggleDetails(): void {
    this.showSecret = !this.showSecret;
    /*this.log.push(this.log.length + 1);*/
    this.log.push(new Date());
  }
}
