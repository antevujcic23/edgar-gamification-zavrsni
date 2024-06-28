import { Injectable } from '@nestjs/common';
import {sql} from 'kysely'
import {db} from '../database'

@Injectable()
export class CoursesService {
  async getAllCourses(studentId: number) {
    return (await sql`
        SELECT id_academic_year, id_course, id_student,course_name, ects_credits, course_acronym  FROM public.student_course
        JOIN public.course on public.student_course.id_course=public.course.id
        WHERE id_student = ${studentId}
    `.execute(db)).rows;
  }
}
