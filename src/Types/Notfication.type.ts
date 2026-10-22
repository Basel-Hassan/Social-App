export interface NotificationType {
  _id: string;
  actor: { _id: string; name: string; photo: string };
  type: string;
  entityType: string;
  entityId: string;
  isRead: boolean;
  createdAt: string;
  entity?: { unavailable?: boolean , post?:string ,topComment?:{post:string}};
};