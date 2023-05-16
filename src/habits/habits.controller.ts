import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Habit } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user';
import { UserDTO } from 'src/auth/dto/user.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { HabitDTO } from './dtos/habit.dto';
import { HabitsService } from './habits.service';
import { CreateHabit } from './models/create-habit';
import { UpdateHabit } from './models/updates-habit';

@Controller('habits')
@ApiTags('Habits')
@UseGuards(JwtGuard)
export class HabitsController {
  constructor(private readonly habitService: HabitsService) {}

  @Get('')
  @ApiResponse({ type: HabitDTO, isArray: true })
  async findAll(): Promise<HabitDTO[]> {
    return this.habitService.findAll() as any as Promise<HabitDTO[]>;
  }

  @Post('')
  @ApiResponse({ type: HabitDTO })
  async create(
    @Body() data: CreateHabit,
    @CurrentUser() user: UserDTO
  ): Promise<HabitDTO> {
    return this.habitService.create(data, user) as any as Promise<HabitDTO>;
  }

  @Get('/{id}')
  @ApiResponse({ type: HabitDTO })
  async findOne(@Param('id') id: string): Promise<HabitDTO> {
    return this.habitService.findOne(id) as any as Promise<HabitDTO>;
  }

  @Delete('/{id}')
  @ApiResponse({ type: HabitDTO })
  async remove(@Param('id') id: string): Promise<HabitDTO> {
    return this.habitService.remove(id) as any as Promise<HabitDTO>;
  }

  @Put('/{id}')
  @ApiResponse({ type: HabitDTO })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateHabit
  ): Promise<HabitDTO> {
    return this.habitService.update(id, data) as any as Promise<HabitDTO>;
  }
}
