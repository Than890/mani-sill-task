import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserSignUpDto } from '../auth/dto/user-sign-up.dto';
import { UserSignInDto } from '../auth/dto/user-sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { Helpers } from 'src/utilities/helpers';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async UserSignUp(userInfo: UserSignUpDto): Promise<any> {
    const exitUser = await this.prisma.user.findUnique({
      where: { username: userInfo.username },
    });

    if (exitUser) {
      throw new BadRequestException('User already exists');
    }
    userInfo.password = await Helpers.hashPassword(userInfo.password);
    const createdUser = await this.prisma.user.create({
      data: userInfo,
    });

    const currentTime = Math.floor(Date.now() / 1000);

    const payload = {
      sub: createdUser.id,
      role: createdUser.role,
      organization_id: createdUser.organization_id,
      username: createdUser.username,
      iat: currentTime,
    };

    const tokens = await this.getToken(payload);
    await this.updateRefreshToken(createdUser.id, tokens.refreshToken);
    return tokens;
  }

  async UserSignIn(userInfo: UserSignInDto) {
    const { username, password } = userInfo;
    const exitUser = await this.prisma.user.findUnique({
      where: { username: username },
    });

    if (!exitUser || !(await bcrypt.compare(password, exitUser.password))) {
      throw new BadRequestException('User does not exist');
    }

    const currentTime = Math.floor(Date.now() / 1000);

    const payload = {
      sub: exitUser.id,
      role: exitUser.role,
      organization_id: exitUser.organization_id,
      username: exitUser.username,
      iat: currentTime,
    };

    const tokens = await this.getToken(payload);
    await this.updateRefreshToken(exitUser.id, tokens.refreshToken);
    return tokens;
  }

  async refreshToken(refreshInfo: RefreshTokenDto) {
    const { user_id, refresh_token } = refreshInfo;
    const user = await this.prisma.user.findUnique({
      where: { id: user_id },
    });
    if (!user || user.refresh_token != refresh_token)
      throw new ForbiddenException('Access Denied');

    const currentTime = Math.floor(Date.now() / 1000);

    const payload = {
      sub: user.id,
      role: user.role,
      organization_id: user.organization_id,
      username: user.username,
      iat: currentTime,
    };

    const tokens = await this.getToken(payload);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { refresh_token: refreshToken },
    });
  }

  async getToken(payload: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.accessJwtSecret,
        expiresIn: jwtConstants.accessTokenExpiresInSecond,
      }),
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.refreshJwtSecret,
        expiresIn: jwtConstants.refreshTokenExpired,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
