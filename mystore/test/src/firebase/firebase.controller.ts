// src/firebase/firebase.controller.ts
import { Controller, Get } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Get('ping')
  pingFirebase() {
    const projectId = this.firebaseService.getProjectId();
    return { status: 'connected', projectId };
  }
}
