export interface Message {
  text: string;
  sent: boolean;
  timestamp?: number;
  userId: string;
  receiverId: string;
}
