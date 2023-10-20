import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ValidationMessage } from 'src/utilities/constant';

enum Role {
  Admin = 'admin',
  User = 'user',
}

export class UserSignUpDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  @ApiProperty()
  fullname: string;

  @IsNotEmpty()
  @Transform(({ value }) => value.replace('+959', '09'))
  @IsString()
  @IsPhoneNumber('MM')
  @MaxLength(13)
  @MinLength(9)
  @ApiProperty()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  @MinLength(6)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: ValidationMessage.username,
  })
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  @MinLength(6)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message: ValidationMessage.password,
    },
  )
  @ApiProperty()
  password: string;

  @IsOptional()
  @IsString()
  @IsEnum(Role)
  @ApiProperty()
  role: Role;

  @IsOptional()
  @IsString()
  @MaxLength(36)
  @MinLength(0)
  @ApiProperty()
  organization_id: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  address: string;
}
