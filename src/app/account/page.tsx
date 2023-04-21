'use client';

import { useEffect, useState } from 'react';
import {
  useUser,
  useSupabaseClient,
  useSession,
} from '@supabase/auth-helpers-react';
import { Database } from '@/types/supabase';
import { useRouter } from 'next/navigation'

type Profiles = Database['public']['Tables']['profiles']['Row'];

export default function Page() {
  const router = useRouter();
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const session = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<Profiles['username']>('');
  const [website, setWebsite] = useState<Profiles['website']>('');
  const [avatar_url, setAvatarUrl] = useState<Profiles['avatar_url']>('');

  useEffect(() => {
    async function getProfile() {
      try {
        setIsLoading(true);

        if (!user) throw new Error('No user');

        let { data, error, status } = await supabase
          .from('profiles')
          .select('username, website, avatar_url')
          .eq('id', user.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setUsername(data.username);
          setWebsite(data.website);
          setAvatarUrl(data.avatar_url);
        }
      } catch (error) {
        // alert('Error loading user data!');
        // console.warn(error);
      } finally {
        setIsLoading(false);
      }
    }
    getProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: Profiles['username'];
    website: Profiles['website'];
    avatar_url: Profiles['avatar_url'];
  }) {
    try {
      setIsLoading(true);
      if (!user) throw new Error('No user');

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;

      alert('Profile updated!');
    } catch (error) {
      alert('Error updating the data!');
      // console.warn(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className='grid min-h-screen place-items-center'>
      <div className='container grid gap-4'>
        <div>
          <label htmlFor='email'>Email</label>
          <input id='email' type='text' value={session?.user.email || ''} disabled />
        </div>
        <div>
          <label htmlFor='username'>Username</label>
          <input
            id='username'
            type='text'
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='website'>Website</label>
          <input
            id='website'
            type='url'
            value={website || ''}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div>
          <button
            className='button primary block'
            onClick={() => updateProfile({ username, website, avatar_url })}
            disabled={isLoading}
          >
            {isLoading ? 'Loading ...' : 'Update'}
          </button>
        </div>

        <div>
          <button
            className='button block'
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/')
            }
            }
          >
            Sign Out
          </button>
        </div>
      </div>
    </main>
  );
}
