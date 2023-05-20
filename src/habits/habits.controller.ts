import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user';
import { UserDTO } from 'src/auth/dto/user.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { HabitDatesDTO, HabitDTO } from './dtos/habit.dto';
import { fileMimetypeFilter } from './filters/fileTypeInterceptor';
import { HabitsService } from './habits.service';
import { CreateHabit } from './models/create-habit';
import { UpdateHabitDate } from './models/update-habit-date';
import { UpdateHabit } from './models/updates-habit';

@Controller('habits')
@ApiTags('Habits')
@UseGuards(JwtGuard)
export class HabitsController {
  constructor(private readonly habitService: HabitsService) {}

  @Get('')
  @ApiResponse({ type: HabitDTO, isArray: true })
  async findAll(): Promise<HabitDTO[]> {
    return this.habitService.findAll();
  }

  @Post('')
  @ApiResponse({ type: HabitDTO })
  async create(
    @Body() data: CreateHabit,
    @CurrentUser() user: UserDTO
  ): Promise<HabitDTO> {
    return this.habitService.create(data, user) as any as Promise<HabitDTO>;
  }

  @Get(':id')
  @ApiResponse({ type: HabitDTO })
  async findOne(@Param('id') id: string): Promise<HabitDTO> {
    return this.habitService.findOne(id) as any as Promise<HabitDTO>;
  }

  @Delete(':id')
  @ApiResponse({ type: HabitDTO })
  async remove(@Param('id') id: string): Promise<HabitDTO> {
    return this.habitService.remove(id) as any as Promise<HabitDTO>;
  }

  @Put('')
  @ApiResponse({ type: HabitDTO })
  async update(@Body() data: UpdateHabit): Promise<HabitDTO> {
    return this.habitService.update(data.id, data) as any as Promise<HabitDTO>;
  }

  @Put('/checked')
  @ApiResponse({ type: HabitDatesDTO })
  async check(@Body() data: UpdateHabitDate): Promise<HabitDatesDTO> {
    return this.habitService.check(data) as any as Promise<HabitDatesDTO>;
  }

  @Post('/json')
  @ApiResponse({ type: HabitDTO, isArray: true })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileMimetypeFilter('json'),
    })
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          // 👈 this property
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async importJson(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: UserDTO
  ): Promise<HabitDTO[]> {
    const jsonData = file.buffer.toString('utf-8');
    const obj = JSON.parse(jsonData) as HabitDTO[];
    return this.habitService.createMany(obj, user) as any as Promise<
      HabitDTO[]
    >;
  }
  @Post('/file/csv')
  @ApiResponse({ type: HabitDTO, isArray: true })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileMimetypeFilter('csv'),
    })
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          // 👈 this property
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async importCSV(@Body() data: UpdateHabitDate) {
    // return this.habitService.check(data) as any as Promise<HabitDTO[]>;
  }
}
