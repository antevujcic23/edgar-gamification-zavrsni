import {Controller, Get, Query} from '@nestjs/common'
import { ExamsService } from './exams.service';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get()
  findAll(
    @Query('academicYear') academicYearId: number,
    @Query('courseId') courseId: number,
    @Query('studentId') studentId: number
  ) {
    return this.examsService.findExams(courseId, academicYearId, studentId);
  }

  @Get('open-exams')
  getOpenExams(
    @Query('courseId') courseId: number,
    @Query('studentId') studentId: number
  ) {
    return this.examsService.openExams(courseId, studentId);
  }

  @Get('open-tutorials')
  getOpenTutorials(
    @Query('courseId') courseId: number,
    @Query('studentId') studentId: number
  ) {
    return this.examsService.openTutorials(courseId, studentId);
  }

  @Get('finished-exams')
  getFinishedExams(
    @Query('courseId') courseId: number,
    @Query('academicYear') academicYearId: number,
    @Query('studentId') studentId: number
  ) {
    return this.examsService.finishedExams(academicYearId, courseId, studentId)
  }

  @Get('finished-exercises')
  getFinishedExercises(
    @Query('courseId') courseId: number,
    @Query('academicYear') academicYearId: number,
    @Query('studentId') studentId: number
  ) {
    return this.examsService.finishedExercises(academicYearId, courseId, studentId)
  }

}
