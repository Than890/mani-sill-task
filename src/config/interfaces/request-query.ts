import { ApiProperty } from '@nestjs/swagger';

export class PaginationQuery {
  @ApiProperty({ example: 0 })
  [`page[skip]`]: number;

  @ApiProperty({ example: 10 })
  [`page[take]`]: number;

  @ApiProperty({ example: 'mg mg' })
  [`search[name]`]: string;

  @ApiProperty({ example: 'desc' })
  [`sort[created_at]`]: string;
}
