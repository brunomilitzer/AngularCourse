import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component( {
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: [ './alert.component.css' ]
} )
export class AlertComponent {
  @Input() message: string;
  @Output() modalClose = new EventEmitter<void>();

  onClose(): void {
    this.modalClose.emit();
  }
}
