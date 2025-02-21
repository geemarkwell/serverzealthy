import { Module } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

export const SupabaseClient = 'SUPABASE_CLIENT';

@Module({
  providers: [
    {
      provide: SupabaseClient,
      useFactory: () => {
        return createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_ANON_KEY,
        );
      },
    },
  ],
  exports: [SupabaseClient],
})
export class DatabaseModule {}