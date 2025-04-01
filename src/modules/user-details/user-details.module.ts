import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDetails, UserDetailsSchema } from './schemas/user-details.schema';
import { UserDetailsService } from './user-details.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDetails.name, schema: UserDetailsSchema },
    ]),
  ],
  providers: [UserDetailsService],
  exports: [UserDetailsService],
})
export class UserDetailsModule {}
