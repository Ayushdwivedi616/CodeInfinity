import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Not Connected: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    const { data, error, status } = await supabase.from('todos').select('id,name').limit(1)
    if (error) {
      console.error('❌ Not Connected: Failed query to todos', error.message)
      process.exit(1)
    }
    console.log('✅ Connected')
    console.log('Data fetched:', data)
    if (!data) {
      console.warn('⚠️ Query succeeded but returned no rows.')
    }
    console.log('✅ Table validation: todos table exists and returned id,name columns or at least query succeeded.')
  } catch (err) {
    console.error('❌ Not Connected: Unexpected error', err)
    process.exit(1)
  }
}

testConnection()
