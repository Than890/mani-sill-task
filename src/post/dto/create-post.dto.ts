import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  @ApiProperty()
  post: string;

  @IsOptional()
  @IsString()
  @MaxLength(36)
  @MinLength(0)
  @ApiProperty()
  user_id: string;
}
