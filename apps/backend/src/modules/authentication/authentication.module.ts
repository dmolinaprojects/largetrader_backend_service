import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '../../common/common.module';
import { TokenModule } from '../../shared/token/token.module';

// Controllers
import { CreateUserController } from './controllers/create-user.controller';
import { GetUserController } from './controllers/get-user.controller';
import { UpdateUserController } from './controllers/update-user.controller';
import { DeleteUserController } from './controllers/delete-user.controller';
import { GetAllUsersController } from './controllers/get-all-users.controller';
import { LoginUserController } from './controllers/login-user.controller';
import { RegisterUserController } from './controllers/register-user.controller';
import { RefreshTokenController } from './controllers/refresh-token.controller';
import { GoogleLoginController } from './controllers/google-login.controller';

// Handlers
import { CreateUserHandlerUseCase } from './handlers/create-user-handler.use-case';
import { GetUserHandlerUseCase } from './handlers/get-user-handler.use-case';
import { UpdateUserHandlerUseCase } from './handlers/update-user-handler.use-case';
import { DeleteUserHandlerUseCase } from './handlers/delete-user-handler.use-case';
import { GetAllUsersHandlerUseCase } from './handlers/get-all-users-handler.use-case';
import { LoginUserHandlerUseCase } from './handlers/login-user-handler.use-case';
import { RegisterUserHandlerUseCase } from './handlers/register-user-handler.use-case';
import { RefreshTokenHandlerUseCase } from './handlers/refresh-token-handler.use-case';
import { GoogleLoginHandlerUseCase } from './handlers/google-login-handler.use-case';

// Use Cases
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { GetUserByIdUseCase } from './use-cases/get-user-by-id.use-case';
import { GetUserByEmailUseCase } from './use-cases/get-user-by-email.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';
import { DeleteUserUseCase } from './use-cases/delete-user.use-case';
import { GetAllUsersUseCase } from './use-cases/get-all-users.use-case';
import { LoginUserUseCase } from './use-cases/login-user.use-case';
import { RegisterUserUseCase } from './use-cases/register-user.use-case';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';
import { GoogleLoginUseCase } from './use-cases/google-login.use-case';

@Module({
  imports: [
    SharedModule,
    CommonModule,
    TokenModule,
  ],
  controllers: [
    CreateUserController,
    GetUserController,
    UpdateUserController,
    DeleteUserController,
    GetAllUsersController,
    LoginUserController,
    RegisterUserController,
    RefreshTokenController,
    GoogleLoginController,
  ],
  providers: [
    // Handlers
    CreateUserHandlerUseCase,
    GetUserHandlerUseCase,
    UpdateUserHandlerUseCase,
    DeleteUserHandlerUseCase,
    GetAllUsersHandlerUseCase,
    LoginUserHandlerUseCase,
    RegisterUserHandlerUseCase,
    RefreshTokenHandlerUseCase,
    GoogleLoginHandlerUseCase,

    // Use Cases
    CreateUserUseCase,
    GetUserByIdUseCase,
    GetUserByEmailUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetAllUsersUseCase,
    LoginUserUseCase,
    RegisterUserUseCase,
    RefreshTokenUseCase,
    GoogleLoginUseCase,
  ],
  exports: [
    CreateUserUseCase,
    GetUserByIdUseCase,
    GetUserByEmailUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetAllUsersUseCase,
    LoginUserUseCase,
    RegisterUserUseCase,
    RefreshTokenUseCase,
    GoogleLoginUseCase,
  ],
})
export class AuthenticationModule {}
