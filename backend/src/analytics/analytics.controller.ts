import {Controller, Get, Query} from '@nestjs/common'
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('score')
  findStat(
    @Query('academicYear') academicYearId: number,
    @Query('courseId') courseId: number,
    @Query('testId') testId: number,
    @Query('studentId') studentId: number
  ) {
    return this.analyticsService.getStatInfo(academicYearId, courseId, +testId ?? 0, studentId);
  }

  @Get('total')
  findAllStudentScore(
    @Query('academicYear') academicYearId: number,
    @Query('courseId') courseId: number,
    @Query('testId') testId: number,
    @Query('onlyScored') onlyScored: boolean,
    @Query('resolution') resolution: string
  ) {
    return this.analyticsService.getAllStudentScore(academicYearId, courseId, onlyScored, +resolution, +testId);
  }

  @Get('timeQuestion')
  getQuestionScoreAnalyticsThroughTime(
    @Query('courseId') courseId: number,
    @Query('testId') testId: number,
    @Query('studentId') studentId: number
  ) {
    return this.analyticsService.getQuestionScoreAnalyticsThroughTime(undefined, courseId, testId, studentId)
  }

  @Get('time')
  getScoreAnalyticsThroughTime(
    @Query('courseId') courseId: number,
    @Query('studentId') studentId: number
  ) {
    return this.analyticsService.getScoreAnalyticsThroughTime(undefined, courseId, studentId)
  }

  @Get('all-ranks')
  findAllRanks(
    @Query('academicYear') academicYearId: number,
    @Query('courseId') courseId: number,
  ) {
    return this.analyticsService.findAllRanks(academicYearId, courseId)
  }

  @Get('leaderboard')
  findLeaderboardForExam(
    @Query('academicYear') academicYearId: number,
    @Query('courseId') courseId: number,
    @Query('testId') testId: number
  ) {
    return this.analyticsService.getLeaderboardForExam(academicYearId, courseId, +testId ?? 0);
  }
}
