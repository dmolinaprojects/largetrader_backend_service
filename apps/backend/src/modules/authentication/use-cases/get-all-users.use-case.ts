import { TTransactionArgs } from '@app/core';
import {
  Users,
  UsersRepository,
} from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @InjectPinoLogger(GetAllUsersUseCase.name)
    private readonly logger: PinoLogger,
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(
    page: number = 1,
    limit: number = 10,
    tx?: TTransactionArgs,
  ): Promise<{ users: Users[]; total: number; page: number; limit: number }> {
    this.logger.info(
      `[GetAllUsersUseCase.execute] Fetching users - page: ${page}, limit: ${limit}`,
    );

    const skip = (page - 1) * limit;

    try {
      const users = await this.usersRepository.findMany(
        {
          skip,
          take: limit,
        },
        tx,
      );
      
      // Para obtener el total, intentamos hacer una consulta separada
      // pero manejamos el error de datos inválidos
      let total = 0;
      try {
        const allUsers = await this.usersRepository.findMany({}, tx);
        total = allUsers.length;
      } catch (error) {
        this.logger.warn(
          `[GetAllUsersUseCase.execute] Error getting total count. Using users count as total.`,
        );
        total = users.length; // Usar el conteo de usuarios obtenidos como aproximación
      }

      this.logger.info(
        `[GetAllUsersUseCase.execute] Found ${users.length} users out of ${total} total`,
      );

      return {
        users,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(
        `[GetAllUsersUseCase.execute] Error fetching users: ${error.message}`,
      );
      throw error;
    }
  }
}
