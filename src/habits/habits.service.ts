import { Injectable } from '@nestjs/common';
import { Habit } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UserDTO } from 'src/auth/dto/user.dto';
import { CreateHabit } from './models/create-habit';
@Injectable()
export class HabitsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateHabit, user: UserDTO) {
    return this.prisma.habit.create({ data: { ...data, userId: user.id } });
  }
  async findAll(): Promise<Habit[]> {
    return this.prisma.habit.findMany({
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findOne(id: string): Promise<Habit | null> {
    return this.prisma.habit.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: CreateHabit) {
    return this.prisma.habit.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.habit.delete({
      where: { id },
    });
  }
}
