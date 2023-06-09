import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Habit } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { AuthService } from 'src/auth/auth.service';
import { UserDTO } from 'src/auth/dto/user.dto';
import { HabitDTO } from './dtos/habit.dto';
import { CreateHabit } from './models/create-habit';
import { UpdateHabitDate } from './models/update-habit-date';
import { UpdateHabit } from './models/updates-habit';
@Injectable()
export class HabitsService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateHabit, user: UserDTO) {
    return this.prisma.habit.create({ data: { ...data, userId: user.id } });
  }
  async createMany(data: HabitDTO[], user: UserDTO) {
    try {
      await this.prisma.$transaction(async (transaction) => {
        // 创建主要的数据
        for (const habit of data) {
          const createdHabit = await transaction.habit.create({
            data: {
              name: habit.name,
              order: habit.order,
              userId: user.id,
            },
          });

          const createdDates = habit.dates.map((date) => {
            return {
              habitId: createdHabit.id,
              // for local version data
              date: date.date ?? (date as any as Date),
            };
          });

          await transaction.habitDates.createMany({
            data: createdDates,
          });
        }
      });
    } catch (error) {
      this.logger.error(`import habit data error: ${error.message}`);
      throw new BadRequestException('import Error');
    }
  }
  async findAll(): Promise<HabitDTO[]> {
    return this.prisma.habit.findMany({
      include: {
        dates: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async check(data: UpdateHabitDate) {
    const exist = !!data.id;
    if (exist) {
      const deleteItem = this.prisma.habitDates.delete({
        where: { id: data.id },
      });
      return {
        ...deleteItem,
        exist: false,
      };
    } else {
      return this.prisma.habitDates.create({
        data: {
          habitId: data.habitId,
          date: data.date,
        },
      });
    }
  }

  async findOne(id: string): Promise<Habit | null> {
    return this.prisma.habit.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateHabit) {
    return this.prisma.habit.update({
      where: { id },
      data: {
        name: data.name,
        order: data.order,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.habit.delete({
      where: { id },
    });
  }
}
