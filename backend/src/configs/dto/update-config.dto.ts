import { IsInt, IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateConfigDto {
  @IsOptional()
  @IsString()
  font_family?: string;

  @IsOptional()
  @IsInt()
  font_size?: number;

  @IsOptional()
  @IsBoolean()
  contrast?: boolean;

  @IsOptional()
  @IsBoolean()
  custom_cursor?: boolean;

  @IsOptional()
  @IsBoolean()
  rank_theme?: boolean;

  @IsOptional()
  @IsBoolean()
  rank_shadows?: boolean;

  @IsOptional()
  @IsBoolean()
  rank_icon?: boolean;
}
