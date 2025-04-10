import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { FirebaseController } from './firebase/firebase.controller';
@Module({
  imports: [FirebaseModule],
  controllers: [AppController, FirebaseController],
  providers: [AppService],
})
export class AppModule {}
