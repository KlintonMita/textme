import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private messagesRef = this.db.list('messages');

  constructor(private db: AngularFireDatabase) {}

  sendMessage(text: string, userId: string, receiverId: string): void {
    const message = {
      text: text,
      sent: true,
      timestamp: Date.now(),
      userId: userId,
      receiverId: receiverId
    };
    this.messagesRef.push(message);
  }

  getMessages(currentUserId: string, selectedUserId: string) {
    return this.db.list('messages', ref => ref.orderByChild('timestamp'))
      .valueChanges()
      .pipe(
        map(messages => messages.filter((message: any) => 
          (message.userId === currentUserId && message.receiverId === selectedUserId) ||
          (message.userId === selectedUserId && message.receiverId === currentUserId)
        ))
      );
  }
}
