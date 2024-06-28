import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnalyticsModule } from './analytics/analytics.module';
import { CoursesModule } from './courses/courses.module';
import { ExamsModule } from './exams/exams.module';
import { ConfigsModule } from './configs/configs.module';

@Module({
  imports: [AnalyticsModule, CoursesModule, ExamsModule, ConfigsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
