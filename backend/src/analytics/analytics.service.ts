import {Injectable} from '@nestjs/common'
import {QueryResult, sql} from 'kysely'
import {db} from '../database'

@Injectable()
export class AnalyticsService {

  async findAllRanks(academicYearId: number, courseId: number) {
    try {
      const result = await sql`
WITH student_ranks AS (
    SELECT
        sc.id_student AS id_student,
        s.first_name AS first_name,
        s.last_name AS last_name,
        RANK() OVER (ORDER BY SUM(ti.score) DESC) AS rank,
        PERCENT_RANK() OVER (ORDER BY SUM(ti.score)) AS percent_rank,
        SUM(ti.score) AS score,
        COUNT(ti.id) AS attendedtests
    FROM
        public.v_test_stats t
        JOIN test_instance ti ON t.id = ti.id_test
        JOIN student_course sc ON sc.id_course = t.id_course
        AND ti.id_student = sc.id_student
        AND sc.id_academic_year = ${academicYearId}
        JOIN student s ON s.id = sc.id_student
    WHERE
        t.id_course = ${courseId}
        AND t.test_score_ignored = false
        AND t.id_academic_year = ${academicYearId}
        AND ti.score IS NOT NULL
        AND COALESCE(class_group, '-') <> 'Teachers'
    GROUP BY
        sc.id_student, s.first_name, s.last_name
), max_score_cte AS (
    SELECT
        SUM(t.max_score) AS maxwinnablescore
    FROM
        v_test_stats t
        JOIN test_instance ti ON t.id = ti.id_test
    WHERE
        t.id_course = ${courseId}
        AND t.id_academic_year = ${academicYearId}
        AND score IS NOT NULL
    GROUP BY
        ti.id_student
    ORDER BY
        1 DESC
    LIMIT 1
), held_tests_cte AS (
    SELECT
        COUNT(t.id) AS heldtests
    FROM
        public.v_test_stats t
    WHERE
        t.id_course = ${courseId}
        AND t.id_academic_year = ${academicYearId}
), open_exams_cte AS (
    SELECT
        sc.id_student,
        COUNT(DISTINCT CASE WHEN test.test_score_ignored = false THEN test.title END) AS open_exams,
        COUNT(DISTINCT CASE WHEN test.test_score_ignored = true THEN test.title END) AS open_exercises
    FROM
        student_course sc
        JOIN test ON test.id_course = sc.id_course
        JOIN academic_year ON test.id_academic_year = academic_year.id
        LEFT JOIN test_instance ON test.id = test_instance.id_test AND test_instance.id_student = sc.id_student
    WHERE
        test.is_public
        AND sc.id_academic_year = ${academicYearId}
        AND sc.id_course = ${courseId}
        AND (CURRENT_TIMESTAMP BETWEEN test.ts_available_from AND test.ts_available_to)
    GROUP BY
        sc.id_student
), finished_exams_cte AS (
    SELECT
        ti.id_student,
        COUNT(DISTINCT CASE WHEN test.test_score_ignored = false THEN test.title END) AS finished_exams,
        COUNT(DISTINCT CASE WHEN test.test_score_ignored = true THEN test.title END) AS finished_exercises
    FROM
        test_instance ti
        JOIN test ON ti.id_test = test.id
    WHERE
        ti.id_student IN (
            SELECT id_student
            FROM student_course
            WHERE id_academic_year = ${academicYearId}
            AND id_course = ${courseId}
        )
        AND (test.id_academic_year = ${academicYearId} OR test.is_global)
        AND test.id_course = ${courseId}
        AND ti.ts_submitted IS NOT NULL
    GROUP BY
        ti.id_student
), open_tutorials_cte AS (
    SELECT
        sc.id_student,
        COUNT(DISTINCT CASE WHEN tutorial_student.ts_finished IS NULL THEN tutorial.id END) AS open_tutorials,
        COUNT(DISTINCT CASE WHEN tutorial_student.ts_finished IS NOT NULL THEN tutorial.id END) AS finished_tutorials,
        COUNT(DISTINCT tutorial.id) AS all_tutorials
    FROM
        student_course sc
        JOIN tutorial_course ON tutorial_course.id_course = sc.id_course
        JOIN tutorial ON tutorial_course.id_tutorial = tutorial.id
        LEFT JOIN tutorial_student ON tutorial.id = tutorial_student.id_tutorial AND tutorial_student.id_student = sc.id_student
    WHERE
        tutorial.is_active = true
        AND sc.id_academic_year = ${academicYearId}
        AND sc.id_course = ${courseId}
    GROUP BY
        sc.id_student
),
all_exams_cte AS (
    SELECT
        ti.id_student,
        COUNT(DISTINCT CASE WHEN test.test_score_ignored = true THEN test.title END) AS all_exercises
    FROM
        test_instance ti
        JOIN test ON ti.id_test = test.id
    WHERE
        ti.id_student IN (
            SELECT id_student
            FROM student_course
            WHERE id_academic_year = ${academicYearId}
            AND id_course = ${courseId}
        )
        AND (test.id_academic_year = ${academicYearId} OR test.is_global)
        AND test.id_course = ${courseId}
        AND ti.ts_submitted IS NOT NULL
    GROUP BY
        ti.id_student
)
SELECT
    sr.id_student,
    sr.first_name,
    sr.last_name,
    sr.rank,
    sr.percent_rank,
    sr.score,
    sr.attendedtests,
    max_score_cte.maxwinnablescore,
    held_tests_cte.heldtests,
    COALESCE(open_exams_cte.open_exams, 0) AS open_exams,
    COALESCE(open_exams_cte.open_exercises, 0) AS open_exercises,
    COALESCE(finished_exams_cte.finished_exams, 0) AS finished_exams,
    COALESCE(finished_exams_cte.finished_exercises, 0) AS finished_exercises,
    COALESCE(open_tutorials_cte.open_tutorials, 0) AS open_tutorials,
    COALESCE(open_tutorials_cte.finished_tutorials, 0) AS finished_tutorials,
    COALESCE(open_tutorials_cte.all_tutorials, 0) AS all_tutorials,
    COALESCE(all_exams_cte.all_exercises, 0) AS all_exercises
FROM
    student_ranks sr
    CROSS JOIN max_score_cte
    CROSS JOIN held_tests_cte
    LEFT JOIN open_exams_cte ON sr.id_student = open_exams_cte.id_student
    LEFT JOIN finished_exams_cte ON sr.id_student = finished_exams_cte.id_student
    LEFT JOIN open_tutorials_cte ON sr.id_student = open_tutorials_cte.id_student
    LEFT JOIN all_exams_cte ON sr.id_student = all_exams_cte.id_student
ORDER BY
    sr.rank;
        
      `.execute(db) as QueryResult<{ rank: number, percent_rank: number, maxrank: number }>;

      return result.rows
    } catch (error) {
      console.error('Error executing SQL query:', error);
      throw error;
    }

    /*
    * SELECT
                sc.id_student AS id_student,
                s.first_name AS first_name,
                s.last_name AS last_name,
                RANK() OVER (ORDER BY SUM(ti.score) DESC) AS rank,
                PERCENT_RANK() OVER (ORDER BY SUM(ti.score)) AS percent_rank,
                SUM(ti.score) AS score,
                COUNT(ti.id) AS attendedtests,
                (
                    SELECT SUM(t.max_score) AS max_score
                    FROM v_test_stats t
                    JOIN test_instance ti
                        ON t.id = ti.id_test
                    WHERE t.id_course = ${courseId}
                        AND t.id_academic_year = ${academicYearId}
                        AND score IS NOT NULL
                    GROUP BY ti.id_student
                    ORDER BY 1 DESC
                    LIMIT 1
                ) AS maxwinnablescore,
                COUNT(t.id) heldtests
            FROM public.v_test_stats t
            JOIN test_instance ti ON t.id = ti.id_test
            JOIN student_course sc ON sc.id_course = t.id_course
                AND ti.id_student = sc.id_student
                AND sc.id_academic_year = ${academicYearId}
            JOIN student s ON s.id = sc.id_student
            WHERE
                t.id_course = ${courseId}
                AND t.test_score_ignored = false
                AND t.id_academic_year = ${academicYearId}
                AND ti.score IS NOT NULL
                AND COALESCE(class_group, '-') <> 'Teachers'
            GROUP BY sc.id_student, s.first_name, s.last_name
            ORDER BY rank;*/
  }

  async getStatInfo(academicYearId: number = 2022, courseId: number = 2021, testId: number = 0, studentId: number = 7726, decimals = 2) {
    try {
      const mainStatInfoResult = await Promise.all([
        this.findRank(academicYearId, courseId, studentId, testId),
        this.getStudentCourseScores(academicYearId, courseId, studentId, testId, decimals),
        this.getStudentScore(academicYearId, courseId, studentId, testId, true, decimals)
      ]);

      const [rankInfo, courseScores, score] = mainStatInfoResult;

      return {
        rank: rankInfo.rank,
        percentileRank: rankInfo.percentileRank,
        maxRank: rankInfo.maxRank,
        attendedtests: courseScores.attendedtests,
        heldtests: courseScores.heldtests,
        minscore: courseScores.minscore,
        maxscore: courseScores.maxscore,
        avgscore: courseScores.avgscore,
        winnedscore: courseScores.winnedscore,
        maxwinnablescore: courseScores.maxwinnablescore,
        score: score.score
      };
    } catch (error) {
      console.error('Error executing SQL query:', error);
      throw error;
    }
  }

  async findRank(academicYearId: number, courseId: number, studentId: number, testId: number) {
    try {
      const result = await sql`
        SELECT
          MAX(CASE WHEN ranked.id_student = ${studentId} THEN ranked.rank ELSE -1 END) AS rank,
          MAX(CASE WHEN ranked.id_student = ${studentId} THEN 100 * ranked.percent_rank ELSE -1 END) AS percent_rank,
          COUNT(*) AS maxrank
        FROM (
          SELECT
            RANK() OVER (ORDER BY SUM(ti.score) DESC) AS rank,
            PERCENT_RANK() OVER (ORDER BY SUM(ti.score)) AS percent_rank,
            COUNT(ti.*) AS maxrank,
            sc.id_student AS id_student
          FROM public.v_test_stats t
          JOIN test_instance ti ON t.id = ti.id_test
          JOIN student_course sc ON sc.id_course = t.id_course
            AND ti.id_student = sc.id_student
            AND sc.id_academic_year = ${academicYearId}
          WHERE
            t.id_course = ${courseId}
            AND t.id_academic_year = ${academicYearId}
            AND ti.score IS NOT NULL
            AND COALESCE(class_group, '-') <> 'Teachers'
            ${testId ? sql`AND t.id = ${testId}` : sql``}
          GROUP BY sc.id_student
        ) AS ranked
      `.execute(db) as QueryResult<{ rank: number, percent_rank: number, maxrank: number }>;

      const rowData = result.rows[0];

      return {
        rank: parseFloat(String(rowData.rank)),
        percentileRank: parseFloat(String(rowData.percent_rank)),
        maxRank: parseFloat(String(rowData.maxrank))
      };
    } catch (error) {
      console.error('Error executing SQL query:', error);
      throw error;
    }
  }


  async getStudentCourseScores(academicYearId: number, courseId: number, studentId: number, testId: number, decimals: number) {
    try {
      const result = await sql`
        SELECT
            COUNT(ti.id) attendedtests,
            COUNT(t.id) heldtests,
            ROUND(MIN(ti.score_perc) * 100, ${decimals}) minscore,
            ROUND(MAX(ti.score_perc) * 100, ${decimals}) maxscore,
            ROUND(AVG(ti.score_perc) * 100, ${decimals}) avgscore,
            SUM(ti.score) winnedscore,
            -- SUM(t.max_score) maxwinnablescoretest,
            (   -- max possible score ANY student on the course could have achieved through written tests
                SELECT SUM(t.max_score) as max_score
                  FROM v_test_stats t
                  JOIN test_instance ti
                    ON t.id = ti.id_test
                 WHERE t.id_course = ${courseId}
                   AND t.id_academic_year = ${academicYearId}
                   AND score IS NOT NULL
                   ${testId ? sql`AND t.id = ${testId}` : sql``}
                 GROUP BY ti.id_student
                 ORDER BY 1 desc
                 LIMIT 1
            ) AS maxwinnablescore
        FROM v_test_stats t 
        LEFT JOIN test_instance ti
               ON t.id = ti.id_test
              AND ti.id_student = ${studentId}
        WHERE -- t.use_in_stats
                t.id_course = ${courseId}
            AND t.id_academic_year = ${academicYearId}
            AND test_score_ignored = false ${testId ? sql`AND t.id = ${testId}` : sql``}
        
      `.execute(db) as QueryResult<{
        attendedtests: number,
        heldtests: number,
        minscore: number,
        maxscore: number,
        avgscore: number,
        winnedscore: number,
        maxwinnablescore: number
      }>;


      const rowData = result.rows[0];

      return {
        attendedtests: parseFloat(String(rowData.attendedtests)),
        heldtests: parseFloat(String(rowData.heldtests)),
        minscore: parseFloat(String(rowData.minscore)),
        maxscore: parseFloat(String(rowData.maxscore)),
        avgscore: parseFloat(String(rowData.avgscore)),
        winnedscore: parseFloat(String(rowData.winnedscore)),
        maxwinnablescore: parseFloat(String(rowData.maxwinnablescore))
      };
    } catch (error) {
      console.error('Error executing SQL query:', error);
      throw error;
    }
  }


  async getStudentScore(academicYearId: number, courseId: number, studentId: number, testId: number, onlyScored: boolean, decimals: number) {
    const result = await sql
      `SELECT ROUND(  (CASE WHEN SUM(t.max_score) <> 0 THEN SUM(ti.score) / SUM(t.max_score) ELSE 0 END) * 100, ${decimals}) score
           FROM v_test_stats t 
           JOIN test_instance ti
             ON t.id = ti.id_test
           JOIN student_course sc
             ON sc.id_course = t.id_course
            AND sc.id_academic_year = t.id_academic_year
            AND ti.id_student = sc.id_student
          WHERE -- t.use_in_stats
                t.id_course = ${courseId}
            AND COALESCE(sc.class_group, '-') <> 'Teachers'
            AND t.id_academic_year = ${academicYearId}
            AND sc.id_student = ${studentId} ${testId ? sql`AND t.id = ${testId}` : sql``} ${
        onlyScored ? sql`AND test_score_ignored = false` : sql``
      }`.execute(db) as QueryResult<{
      score: number,
    }>;

    return {score: parseFloat(String(result.rows[0].score))};
  }

  async getAllStudentScore(academicYearId: number = 2022, courseId: number = 2021, onlyScored: boolean = true, resolution: number = 5, testId: number = 14298) {
    try {
      const data = await Promise.all([
        this.getScoreAnalyticsByAllGroups(academicYearId, courseId, testId, onlyScored, resolution)
      ]);

      const [scoreAnalyticsByAllGroups] = data;

      return {
        data: scoreAnalyticsByAllGroups,
      };
    } catch (error) {
      console.error('Error executing SQL query:', error);
      throw error;
    }
  }

  async getScoreAnalyticsByAllGroups(
    academicYearId,
    courseId,
    testId,
    onlyScored,
    resolution
  ) {
    const result = await sql
      `WITH ranges as
      (SELECT step * ${resolution} AS range_min,
    step * ${resolution} + ${resolution} - 1 AS range_max FROM generate_series(0, 100 / ${resolution}) step)
    SELECT range_min::int x, COUNT( * )::int y
    FROM student_course sc JOIN
    (
      SELECT ti.id_student,
      (CASE WHEN SUM(t.max_score) <> 0 THEN SUM(ti.score) / SUM(t.max_score) ELSE 0 END) * 100 AS score
    FROM v_test_stats t
    JOIN test_instance ti
    ON t.id = ti.id_test
    WHERE -- t.use_in_stats
    t.id_course = ${courseId}
    AND t.id_academic_year = ${academicYearId} ${testId ? sql`AND t.id = ${testId}` : sql``} ${
        onlyScored ? sql`AND test_score_ignored = false` : sql``
      }
    AND score IS NOT NULL
    GROUP BY ti.id_student
  ) students
    ON sc.id_student = students.id_student
    JOIN ranges
    ON students.score between range_min and range_max
    WHERE sc.id_course = ${courseId}
    AND sc.id_academic_year = ${academicYearId}
    AND students.score BETWEEN 0 AND 100
    AND COALESCE(sc.class_group, '-') <> 'Teachers'
    GROUP BY range_min
    ORDER BY range_min`.execute(db) as any;

    const scoreCategories = [];
    for (let i = 0; i <= 100; i += resolution) {
      scoreCategories.push(i);
    }

    // add missing score categories with no students in it
    result.rows.forEach((score, idx) => {
      const missing = [...new Set(scoreCategories.filter((x) => !result.rows.map((s) => s.x).includes(x)))];
      missing.forEach((xVal) => {
        result.rows.push({
          x: xVal,
          y: 0,
        });
      });
    });

    // sort them
    result.rows = result.rows.sort((a, b) => a.x - b.x);

    return result.rows;
  }

  async getQuestionScoreAnalyticsThroughTime(academicYearId: number = 2022, courseId: number = 2021, testId, studentId) {
    return (await sql
      `WITH enrolledStudents AS (
                SELECT sc.id_student 
                FROM student_course sc 
                WHERE sc.id_course = ${courseId}
                AND sc.id_academic_year = ${academicYearId}
                AND COALESCE(class_group, '-') <> 'Teachers'
                )
        SELECT    tiq.ordinal x
        , COALESCE( MAX (CASE WHEN (ti.id_student = ${studentId}) THEN tiq.score ELSE NULL END), 0) as y
        , ROUND(AVG(tiq.score), 2) as y2
        , (SELECT ROUND(AVG(tiq2.score), 2) 
            FROM test_instance_question tiq2 
            JOIN test_instance ti ON ti.id = tiq2.id_test_instance 
            JOIN v_test_stats t ON t.id = ti.id_test 
            JOIN enrolledStudents
              ON enrolledStudents.id_student = ti.id_student
            WHERE t.id_course = ${courseId}
            AND t.id = ${testId}
            AND t.id_academic_year = ${academicYearId} 
            AND tiq2.id_question = (SELECT id_question 
                FROM test_instance_question 
                JOIN test_instance ti ON ti.id = test_instance_question.id_test_instance 
                AND id_student = ${studentId}
                AND ordinal = tiq.ordinal 
                AND ti.id_test = ${testId})
          ) as y3
            FROM test_instance_question tiq
            JOIN test_instance ti
              ON ti.id = tiq.id_test_instance
            JOIN v_test_stats t
              ON t.id = ti.id_test
            JOIN enrolledStudents
              ON enrolledStudents.id_student = ti.id_student
            WHERE t.id_course = ${courseId}
              AND t.id = ${testId}
              AND t.id_academic_year = ${academicYearId}                         
        GROUP BY tiq.ordinal
            ORDER BY x`.execute(db) as any).rows;
  }

  async getScoreAnalyticsThroughTime(academicYearId: number = 2022, courseId: number = 2021, studentId: number = 7726) {
    return (await sql
      `SELECT
            CASE WHEN (t.title_abbrev IS NULL OR t.title_abbrev = '') THEN 'ID' || t.id ELSE t.title_abbrev END x,
            COUNT(ti.id) as n,
            ROUND(100 * MAX ( CASE WHEN (ti.id_student = ${studentId}) THEN COALESCE(ti.score_perc, 0) ELSE 0 END), 2) as y,
            ROUND(AVG(ti.score_perc * 100), 2) y2,
            (
                SELECT max(case when (ranked.id_student = ${studentId}) then ranked.rank else -1 end) as rank
                    FROM (
                    SELECT
                        sc.id_student,
                        RANK() OVER (ORDER BY SUM(ti.score) desc) rank
                    FROM v_test_stats tt
                    JOIN test_instance ti 
                      ON tt.id = ti.id_test
                    JOIN student_course sc 
                      ON sc.id_course = tt.id_course 
                     AND ti.id_student = sc.id_student
                     AND sc.id_academic_year = tt.id_academic_year
                    WHERE -- tt.use_in_stats
                          tt.id_course = ${courseId}
                      AND tt.id_academic_year = ${academicYearId}
                      AND ti.score IS NOT NULL
                      AND COALESCE(class_group, '-') <> 'Teachers'
                      -- AND test_score_ignored = false
                      AND tt.test_ordinal <= t.test_ordinal
                    GROUP BY sc.id_student
                ) as ranked) as y3
        FROM v_test_stats t
        LEFT JOIN test_instance ti 
               ON t.id = ti.id_test
        WHERE --t.use_in_stats
                t.id_course = ${courseId}
            AND t.id_academic_year = ${academicYearId} 
           -- AND sc.id_student = 7726
            -- AND test_score_ignored = false
        GROUP BY x, t.id, t.test_ordinal
        ORDER BY t.test_ordinal`.execute(db) as any).rows;
  }

  async getLeaderboardForExam(academicYearId: number, courseId: number, testId: number, decimals: number = 2) {
    try {
      const result = await sql`
        SELECT
            ti.id_student,
            ROUND(MIN(ti.score_perc) * 100, ${decimals}) AS score_perc,
            SUM(ti.score) AS winnedscore,
            (
                SELECT SUM(t.max_score) AS max_score
                FROM v_test_stats t
                JOIN test_instance ti
                    ON t.id = ti.id_test
                WHERE t.id_course = ${courseId}
                    AND t.id_academic_year = ${academicYearId}
                    AND score IS NOT NULL
                    ${testId ? sql`AND t.id = ${testId}` : sql``}
                GROUP BY ti.id_student
                ORDER BY 1 DESC
                LIMIT 1
            ) AS maxwinnablescore
        FROM v_test_stats t 
        LEFT JOIN test_instance ti
            ON t.id = ti.id_test
        WHERE t.id_course = ${courseId}
            AND t.id_academic_year = ${academicYearId}
            AND test_score_ignored = false 
            ${testId ? sql`AND t.id = ${testId}` : sql``}
        GROUP BY ti.id_student
        ORDER BY winnedscore DESC;
      `.execute(db) as QueryResult<{
        attendedtests: number,
        heldtests: number,
        minscore: number,
        maxscore: number,
        avgscore: number,
        winnedscore: number,
        maxwinnablescore: number
      }>;

      return result.rows
    } catch (error) {
      console.error('Error executing SQL query:', error);
      throw error;
    }
  }
}