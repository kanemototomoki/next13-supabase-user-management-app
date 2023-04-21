'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push('/account');
  }, [session, router]);

  return (
    <main className='grid min-h-screen place-items-center'>
      <div
        className='container'
        style={{
          padding: '50px 0 100px 0',
        }}
      >
        {!session && (
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme='dark'
          />
        )}
      </div>
    </main>
  );
}
