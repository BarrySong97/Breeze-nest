import { IsJWT, IsNotEmpty } from 'class-validator';
import { GraphQLJWT } from 'graphql-scalars';

export class RefreshTokenInput {
  @IsNotEmpty()
  @IsJWT()
  token: string;
}
