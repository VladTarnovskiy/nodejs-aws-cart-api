import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  HttpStatus,
  Body,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LocalAuthGuard, AuthService, BasicAuthGuard } from './auth';
import {
  RegisterUserDto,
  LoginDto,
  RegisterResponseDto,
  ProfileResponseDto,
} from './users/dto';
import { AppRequest } from './shared';
import { HealthCheckResponseDto } from './shared/swagger/health-response.dto';
import { TokenResponseDto } from './shared/swagger/token-response.dto';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Get(['', 'ping'])
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, type: HealthCheckResponseDto })
  healthCheck() {
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }

  @ApiTags('auth')
  @Post('api/auth/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ status: 201, type: RegisterResponseDto })
  @ApiResponse({
    status: 400,
    description: 'User with such name already exists',
  })
  async register(@Body() body: RegisterUserDto) {
    return this.authService.register(body);
  }

  @ApiTags('auth')
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('api/auth/login')
  @ApiOperation({ summary: 'Login and receive Basic auth token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, type: TokenResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() _body: LoginDto, @Request() req: AppRequest) {
    const token = this.authService.login(req.user, 'basic');

    return token;
  }

  @ApiTags('profile')
  @UseGuards(BasicAuthGuard)
  @ApiBasicAuth('basic')
  @Get('api/profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req: AppRequest) {
    return {
      user: req.user,
    };
  }
}
