import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-suit-builder',
  templateUrl: './suit-builder.component.html',
  styleUrls: ['./suit-builder.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuitBuilderComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

}
