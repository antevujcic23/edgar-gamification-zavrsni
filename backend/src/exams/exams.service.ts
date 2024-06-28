import { Injectable } from '@nestjs/common';
import {QueryResult, sql} from 'kysely'
import {db} from '../database'

@Injectable()
export class ExamsService {
  async findExams(courseId: number, academicYearId: number, studentId: number) {
    return (await sql`SELECT t.title || ' (' || COALESCE(t.title_abbrev, '') || ')' as name, t.id as value
                    FROM v_test_stats t
                    JOIN test_instance ti
                      ON t.id = ti.id_test
                     AND ti.id_student = ${studentId}
                    WHERE t.id_academic_year = ${academicYearId}
                        AND t.id_course = ${courseId}
                    ORDER BY ti.ts_submitted DESC`.execute(db)).rows;
  }

  async openExams(courseId: number, studentId: number) {
    return (await sql`SELECT
                academic_year.title as ac_year, test.title, test.max_runs, questions_no, duration_seconds,
                    test_score_ignored, forward_only, use_in_stats, is_global, is_public, password,
                    EXTRACT(EPOCH FROM(test.ts_available_to - CURRENT_TIMESTAMP)) as seconds_available_to,
                    ts_available_to::timestamp(0)::varchar,
                    SUM(CASE WHEN(ts_started IS NULL) THEN 0 ELSE 1 END) as no_started,
                    SUM(CASE WHEN(ts_submitted IS NULL) THEN 0 ELSE 1 END) as no_submitted
                FROM test
                JOIN academic_year
                  ON test.id_academic_year = academic_year.id
                LEFT JOIN test_instance
                       ON test.id = test_instance.id_test
                      AND test_instance.id_student = ${studentId}
             WHERE is_public
               AND id_course = ${courseId}
               AND (CURRENT_TIMESTAMP BETWEEN test.ts_available_from AND test.ts_available_to)
             GROUP BY academic_year.title, test.title, test.max_runs, questions_no, duration_seconds,
                 test_score_ignored, forward_only, use_in_stats, is_global, is_public, password, test.ts_available_to, test.ts_created
             ORDER BY test.ts_created DESC`.execute(db)).rows
  }

  async finishedExercises(academicYearId: number, courseId: number, studentId: number) {
    return (await sql`
    SELECT test_instance.id, test_ordinal, title, passed, score_perc, first_name || ' ' || last_name as full_name, test_score_ignored
                  FROM test_instance
                  JOIN student on test_instance.id_student = student.id
                  JOIN test on test_instance.id_test = test.id
                  JOIN test_type ON test.id_test_type = test_type.id
                 WHERE id_student = ${studentId}
                    AND id_academic_year = ${academicYearId}
                    AND id_course = ${courseId}
                   AND ts_submitted IS NOT NULL
                   AND test_type.type_name <> 'Lecture quiz'
              ORDER BY ts_submitted desc
    `.execute(db)).rows
  }

  async finishedExams(academicYearId, courseId, studentId) {
    return (await sql`
        SELECT
            test.title,
            test.test_score_ignored,
            ti.ts_started as tosort,
            ti.ts_started::timestamp(0)::varchar,
            ti.ts_submitted::timestamp(0)::varchar,
            ((ti.ts_submitted - ti.ts_started)::interval(0))::varchar as duration,
            ti.correct_no,
            ti.incorrect_no,
            ti.unanswered_no,
            ti.partial_no,
            ti.score as t_score,
            round(ti.score_perc * 100, 1) || '%' AS t_score_perc,
            ti.passed,
            ti.id as id_test_instance,
            (EXTRACT(EPOCH FROM (current_timestamp- ts_submitted)) < review_period_mins * 60) as show_review
        FROM test_instance ti
        JOIN test ON ti.id_test = test.id
        WHERE
            id_student = ${studentId}
            AND (id_academic_year = ${academicYearId} OR test.is_global)
            AND id_course = ${courseId}
            AND ti.ts_submitted IS NOT NULL
        ORDER BY ti.ts_submitted DESC
    `.execute(db)).rows;
  }

  async openTutorials(courseId: number, studentId: number) {
    return (await sql`SELECT tutorial.id, tutorial_title, tutorial.is_active, tutorial_desc,
                tutorial_student.ts_finished :: timestamp(0) :: varchar,
                CASE WHEN is_finished = TRUE THEN 'Yes' ELSE 'No' END AS finished,
                string_agg(DISTINCT course_name, ', ') AS courses,
                COUNT(DISTINCT tutorial_step.id) AS no_steps
            FROM tutorial JOIN tutorial_course
                    ON tutorial.id = tutorial_course.id_tutorial
                JOIN course
                    ON tutorial_course.id_course = course.id
                LEFT JOIN tutorial_step
                    ON tutorial.id = tutorial_step.id_tutorial
                LEFT JOIN tutorial_student
                    ON tutorial.id = tutorial_student.id_tutorial
                    AND tutorial_student.id_student = ${studentId}
            WHERE tutorial_course.id_course = ${courseId}
                AND tutorial.is_active = true
            GROUP BY tutorial.id, tutorial_title, tutorial_desc,
                tutorial_student.ts_finished, tutorial_student.is_finished
            ORDER BY tutorial_title`.execute(db)).rows
  }
}
