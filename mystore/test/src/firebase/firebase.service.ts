// src/firebase/firebase.service.ts
import { Injectable } from '@nestjs/common';
import admin, { firebaseProjectId } from './firebase.config';

@Injectable()
export class FirebaseService {
  getProjectId(): string {
    return firebaseProjectId || 'unknown';
  }
}
