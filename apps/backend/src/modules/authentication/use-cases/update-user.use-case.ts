import { TTransactionArgs } from '@app/core';
import {
  Users,
  UsersRepository,
} from '@app/shared';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { HttpErrorCode } from '../../../common/filters/internal/internal-exception-error';
import { UpdateUserRequestDto } from '../dto/update-user-request.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @InjectPinoLogger(UpdateUserUseCase.name)
    private readonly logger: PinoLogger,
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(
    id: string,
    userData: UpdateUserRequestDto,
    tx?: TTransactionArgs,
  ): Promise<Users> {
    this.logger.info(
      `[UpdateUserUseCase.execute] Updating user with ID: ${id}`,
    );

    // Verificar si el usuario existe
    const existingUser = await this.usersRepository.findOne(
      { where: { Id: parseInt(id) } },
      tx,
    );

    if (!existingUser) {
      this.logger.error(
        `[UpdateUserUseCase.execute] User with ID ${id} not found`,
      );
      throw new ConflictException(HttpErrorCode.NOT_FOUND);
    }

    // Si se está actualizando el email, verificar que no exista otro usuario con ese email
    if (userData.email && userData.email !== existingUser.Email) {
      const userWithEmail = await this.usersRepository.findByEmail(userData.email);

      if (userWithEmail) {
        this.logger.error(
          `[UpdateUserUseCase.execute] User with email ${userData.email} already exists`,
        );
        throw new ConflictException(HttpErrorCode.ALREADY_EXISTS);
      }
    }

    // Preparar datos para actualización
    const updateData: Partial<Users> = {};
    if (userData.firstName) updateData.Name = userData.firstName;
    if (userData.lastName) updateData.Surname = userData.lastName;
    if (userData.email) updateData.Email = userData.email;
    if (userData.phone) updateData.Phone = userData.phone;
    if (userData.isActive !== undefined) updateData.Admin = userData.isActive;

    // Actualizar el usuario
    const updatedUser = await this.usersRepository.updateOne({
      where: { Id: parseInt(id) },
      data: updateData,
    });

    this.logger.info(
      `[UpdateUserUseCase.execute] User updated successfully with ID: ${id}`,
    );

    return updatedUser;
  }
}
