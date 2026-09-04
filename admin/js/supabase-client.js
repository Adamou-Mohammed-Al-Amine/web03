/* Admin-only Supabase client. Uses the JS SDK (unlike the public site's
   plain-fetch approach) because the admin needs session/auth management,
   which the SDK handles for us. The anon/publishable key below is the
   same public-safe key used on the site — see js/projects.js for why
   that's safe. */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const supabase = createClient(
  'https://oixjigudwtretogcngmy.supabase.co',
  'sb_publishable_WgV6Id9JfuzFVsnPY70eEQ_1Gleh9EV'
);
