import { IsInt, IsString, IsBoolean } from 'class-validator';

export class CreateConfigDto {
  @IsInt()
  id: number;

  @IsString()
  font_family: string;

  @IsInt()
  font_size: number;

  @IsBoolean()
  contrast: boolean;

  @IsBoolean()
  custom_cursor: boolean;

  @IsBoolean()
  rank_theme: boolean;

  @IsBoolean()
  rank_shadows: boolean;

  @IsBoolean()
  rank_icon: boolean;
}
