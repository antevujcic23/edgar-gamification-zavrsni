import {Controller, Get, Query} from '@nestjs/common'
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(@Query('studentId') studentId: number) {
    return this.coursesService.getAllCourses(studentId);
  }
}
