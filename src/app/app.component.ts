import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  messages: string[] = [];
  @ViewChild('scrollDiv') scrollDiv!: ElementRef;
  @ViewChildren('messages') messagesDiv!: QueryList<any>;

  ngAfterViewInit() {
    this.messagesDiv.changes.subscribe((_) => this.onItemElementsChanged());
    const numbers = interval(500);
    numbers.subscribe({
      next: () => {
        this.messages.push('oi');
      },
    });
  }

  private onItemElementsChanged(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    let nativeElement = this.scrollDiv.nativeElement;
    nativeElement.scrollTop = nativeElement.scrollHeight;
  }
}
