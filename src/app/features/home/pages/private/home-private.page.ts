import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-home-private',
  imports: [CommonModule],
  templateUrl: './home-private.page.html',
})
export class HomePrivatePage {
  namePrincipa = 'aaa';


}
