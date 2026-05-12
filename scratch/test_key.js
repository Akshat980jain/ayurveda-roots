
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fwfgwzpodlbgfgockzcf.supabase.co';
const TEST_KEY = 'sb_publishable_QDS3PF2hGI7YGKh0oX87hQ_Ku7dMPll';

async function testKey() {
  console.log('Testing key:', TEST_KEY);
  const supabase = createClient(SUPABASE_URL, TEST_KEY);
  
  // Try to fetch from auth.users (requires service_role)
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  
  if (error) {
    console.error('Error with profiles select:', error.message);
  } else {
    console.log('Successfully selected from profiles (might be public).');
  }

  // Try to perform an action that DEFINITELY requires service_role
  // Like listing users from auth
  const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
  
  if (userError) {
    console.error('Error listing users (Service Role test):', userError.message);
  } else {
    console.log('SUCCESS! The key has Service Role permissions.');
  }
}

testKey();
