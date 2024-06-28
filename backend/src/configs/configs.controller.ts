import {Controller, Get, Body, Patch, Query} from '@nestjs/common'
import { ConfigsService } from './configs.service';
import { UpdateConfigDto } from './dto/update-config.dto';

@Controller('configs')
export class ConfigsController {
  constructor(private readonly configsService: ConfigsService) {}

  @Get()
  getConfig(@Query('studentId') studentId: number) {
    return this.configsService.getConfig(studentId);
  }

  @Patch()
  updateConfig(@Query('studentId') studentId: number, @Body() updateConfigDto: UpdateConfigDto) {
    return this.configsService.updateConfig(studentId, updateConfigDto);
  }
}
