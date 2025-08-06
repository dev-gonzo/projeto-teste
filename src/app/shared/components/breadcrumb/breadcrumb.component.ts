import { Component, Input, ViewEncapsulation } from '@angular/core';

import { faHome } from '@fortawesome/free-solid-svg-icons';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'breadcrumb',
  standalone: false,
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BreadcrumbComponent {
  @Input() items: MenuItem[] | undefined;

  homeIcon = faHome;
}
