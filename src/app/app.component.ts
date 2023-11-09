import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  messages: string[] = [];
  @ViewChild('scrollDiv') scrollDiv!: ElementRef;
  @ViewChildren('messages') messagesDiv!: QueryList<any>;

  automaticMessagesObservable!: Observable<number>;
  automaticMessagesSubscription!: Subscription;
  watchDivSubscription?: Subscription;

  automaticMessages = false;
  lastNumberOfMessagesToCheck = 0;
  isScrollBottom = false;
  isScrollVisible = false;

  addMessages() {
    this.automaticMessagesObservable = interval(500);
    if (this.messages.length == 0) {
      this.watchChangeDiv();
    }
    this.automaticMessagesSubscription =
      this.automaticMessagesObservable.subscribe({
        next: () => {
          this.messages.push('oi');
        },
      });
  }

  watchChangeDiv() {
    if (!this.watchDivSubscription) {
      this.watchDivSubscription = this.messagesDiv.changes.subscribe((_) =>
        this.onItemElementsChanged()
      );
    }
  }

  unWatchChangeDiv() {
    if (this.watchDivSubscription) {
      this.watchDivSubscription.unsubscribe();
      this.watchDivSubscription = undefined;
    }
  }

  stopMessages() {
    this.automaticMessagesSubscription.unsubscribe();
  }

  toggleAutomaticMessages() {
    this.automaticMessages = !this.automaticMessages;

    if (this.automaticMessages) {
      this.addMessages();
    } else {
      this.lastNumberOfMessagesToCheck = this.messages.length;
      this.stopMessages();
    }
  }

  onScroll() {
    let isScrollAtBottom =
      this.scrollDiv.nativeElement.offsetHeight +
        this.scrollDiv.nativeElement.scrollTop >=
      this.scrollDiv.nativeElement.scrollHeight;

    if (
      this.scrollDiv.nativeElement.scrollHeight >
      this.scrollDiv.nativeElement.offsetHeight
    ) {
      this.isScrollVisible = true;
    }

    if (isScrollAtBottom) {
      this.watchChangeDiv();
      this.isScrollBottom = true;
    } else {
      this.unWatchChangeDiv();
      this.isScrollBottom = false;
    }
  }

  private onItemElementsChanged(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    let nativeElement = this.scrollDiv.nativeElement;
    nativeElement.scrollTop = nativeElement.scrollHeight;
  }

  showYouHaveNewMessagesButton() {
    return (
      this.isScrollVisible &&
      !this.isScrollBottom &&
      this.lastNumberOfMessagesToCheck < this.messages.length
    );
  }
}
