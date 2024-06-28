import { Injectable } from '@nestjs/common';
import { UpdateConfigDto } from './dto/update-config.dto';
import {sql} from 'kysely'
import {db} from '../database'

@Injectable()
export class ConfigsService {
  async getConfig(studentId: number) {
    return (await sql`SELECT * FROM student_config
                    where id=${studentId}`.execute(db)).rows;
  }

  async updateConfig(studentId: number, updateConfigDto: UpdateConfigDto) {
    const {
      font_family,
      font_size,
      contrast,
      custom_cursor,
      rank_theme,
      rank_shadows,
      rank_icon
    } = updateConfigDto;

    if (font_family) {
      await sql`UPDATE student_config SET font_family = ${font_family} WHERE id = ${studentId}`.execute(db);
    }

    if (font_size) {
      await sql`UPDATE student_config SET font_size = ${font_size} WHERE id = ${studentId}`.execute(db);
    }

    if (contrast !== undefined) {
      await sql`UPDATE student_config SET contrast = ${contrast} WHERE id = ${studentId}`.execute(db);
    }

    if (custom_cursor !== undefined) {
      await sql`UPDATE student_config SET custom_cursor = ${custom_cursor} WHERE id = ${studentId}`.execute(db);
    }

    if (rank_theme !== undefined) {
      await sql`UPDATE student_config SET rank_theme = ${rank_theme} WHERE id = ${studentId}`.execute(db);
    }

    if (rank_shadows !== undefined) {
      await sql`UPDATE student_config SET rank_shadows = ${rank_shadows} WHERE id = ${studentId}`.execute(db);
    }

    if (rank_icon !== undefined) {
      await sql`UPDATE student_config SET rank_icon = ${rank_icon} WHERE id = ${studentId}`.execute(db);
    }

    return this.getConfig(studentId);
  }
}
