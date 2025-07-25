import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

export interface GroupHolding {
  quantity: number;
  name: string;
  buying_price: number;
  stop_loss: number;
  tags: { label: string }[];
  showBreakdown: boolean;
  breakdowns: Holding[];
}

export interface Holding {
  id: number;
  quantity: number;
  buying_price: number;
  stop_loss: number;
  trade_date: string | Date;
}

@Component({
  selector: 'app-group-holding-card',
  templateUrl: './group-holding-card.component.html',
  styleUrls: ['./group-holding-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupHoldingCardComponent {
  /** Data for one card */
  @Input() groupHolding!: GroupHolding;

  /** Position in the parent array (handy for deletes, etc.) */
  @Input() index!: number;

  /* ------------------------------------------------------------------
   * Output events to bubble user interactions back to the parent page
   * ------------------------------------------------------------------*/

  /** Equivalent to `(click)="actions(null,index,'groupHolding')"` */
  @Output() cardAction = new EventEmitter<{
    holdingId: number | null;
    index: number;
    type: 'groupHolding' | 'holding';
  }>();

  /** Equivalent to `(click)="toggleBreakdown(index)"` */
  @Output() toggle = new EventEmitter<number>();

  /** Public wrappers the template can call ---------------------------*/
  onCardClick(): void {
    this.cardAction.emit({
      holdingId: null,
      index: this.index,
      type: 'groupHolding',
    });
  }

  onBreakdownClick(holdingId: number): void {
    this.cardAction.emit({
      holdingId,
      index: this.index,
      type: 'holding',
    });
  }

  onToggleBreakdown(): void {
    this.toggle.emit(this.index);
  }
}
