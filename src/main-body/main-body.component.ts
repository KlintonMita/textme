import { CommonModule, NgClass, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../assets/services/models/user.model';
import { Firestore, collection, collectionData, addDoc, query, orderBy } from '@angular/fire/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { User as FirebaseUser } from 'firebase/auth';

@Component({
  selector: 'app-main-body',
  standalone: true,
  imports: [NgClass, CommonModule, NgIf, FormsModule],
  templateUrl: './main-body.component.html',
  styleUrls: ['./main-body.component.scss']
})
export class MainBodyComponent implements OnChanges {
  @Input() selectedUser: User | null = null;
  currentUser: FirebaseUser | null = null;
  messages: { text: string, sent: boolean, userId: string, receiverId: string, timestamp: any }[] = [];
  newMessage: string = '';
  firestore: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUser = user;
        console.log('Authenticated user:', this.currentUser);
      } else {
        // Handle user sign-out
        this.currentUser = null;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedUser'] && !changes['selectedUser'].firstChange) {
      this.loadMessages();
    }
  }

  private generateChatId(user1Id: string, user2Id: string): string {
    return [user1Id, user2Id].sort().join('_');
  }

  loadMessages() {
    if (this.selectedUser && this.currentUser) {
      const chatId = this.generateChatId(this.currentUser.uid, this.selectedUser.id);
      const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);
      const q = query(messagesRef, orderBy('timestamp', 'asc')); // Ensure messages are ordered by timestamp
      collectionData(q, { idField: 'id' }).subscribe((messages: any[]) => {
        this.messages = messages;
        this.cdr.detectChanges(); // Manually trigger change detection
      }, error => {
        console.error('Error fetching messages: ', error);
      });
    }
  }

  async sendMessage() {
    if (this.newMessage.trim() && this.selectedUser && this.currentUser) {
      const chatId = this.generateChatId(this.currentUser.uid, this.selectedUser.id);
      const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);
      
      try {
        await addDoc(messagesRef, {
          text: this.newMessage,
          sent: true,
          userId: this.currentUser.uid,
          receiverId: this.selectedUser.id,
          timestamp: new Date() 
        });
        this.newMessage = '';
        
        this.messages = [...this.messages]; // Create a new reference
        this.cdr.detectChanges(); // Manually trigger change detection
      } catch (error) {
        console.error('Error sending message: ', error);
      }
    } else {
      console.log('Message not sent: Missing required fields.');
    }
  }
}