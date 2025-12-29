import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StoreRow {
  shop_num_1: string
  shop_name: string
  shop_addr_1?: string
  shop_addr_2?: string
  shop_city?: string
  shop_state?: string
  shop_zip?: string
  shop_addr_1_m?: string
  shop_addr_2_m?: string
  shop_city_m?: string
  shop_state_m?: string
  shop_zip_m?: string
  shop_phone_1?: string
  shop_phone_2?: string
  shop_email?: string
  shop_website?: string
  shop_owner?: string
  shop_hours?: string
  shop_mdse?: string
}

function parseCSV(csvText: string): StoreRow[] {
  const lines = csvText.split('\n')
  if (lines.length < 2) return []
  
  // Parse header
  const headerLine = lines[0]
  const headers = parseCSVLine(headerLine)
  
  const stores: StoreRow[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    const values = parseCSVLine(line)
    const row: Record<string, string> = {}
    
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() || ''
    })
    
    // Only include rows with a valid shop_num_1 and shop_name
    if (row.shop_num_1 && row.shop_name) {
      stores.push(row as unknown as StoreRow)
    }
  }
  
  return stores
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current)
  return result
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if user is admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { csvData } = await req.json()
    
    if (!csvData) {
      return new Response(
        JSON.stringify({ error: 'No CSV data provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const stores = parseCSV(csvData)
    console.log(`Parsed ${stores.length} stores from CSV`)

    if (stores.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid stores found in CSV' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get existing store IDs
    const { data: existingStores } = await supabase
      .from('stores')
      .select('ShopID')
    
    const existingIds = new Set(existingStores?.map(s => s.ShopID) || [])

    let inserted = 0
    let updated = 0
    let errors: { shopId: string; error: string }[] = []

    // Process in batches of 100
    const batchSize = 100
    for (let i = 0; i < stores.length; i += batchSize) {
      const batch = stores.slice(i, i + batchSize)
      
      const toInsert: any[] = []
      const toUpdate: any[] = []

      for (const store of batch) {
        const storeData = {
          ShopID: store.shop_num_1,
          shop_name: store.shop_name,
          shop_addr_1: store.shop_addr_1 || null,
          shop_addr_2: store.shop_addr_2 || null,
          shop_city: store.shop_city || null,
          shop_state: store.shop_state || null,
          shop_zip: store.shop_zip || null,
          shop_addr_1_m: store.shop_addr_1_m || null,
          shop_addr_2_m: store.shop_addr_2_m || null,
          shop_city_m: store.shop_city_m || null,
          shop_state_m: store.shop_state_m || null,
          shop_zip_m: store.shop_zip_m || null,
          shop_phone_1: store.shop_phone_1 || null,
          shop_phone_2: store.shop_phone_2 || null,
          shop_email: store.shop_email || null,
          shop_website: store.shop_website || null,
          shop_owner: store.shop_owner || null,
          shop_hours: store.shop_hours || null,
          shop_mdse: store.shop_mdse || null,
        }

        if (existingIds.has(store.shop_num_1)) {
          toUpdate.push(storeData)
        } else {
          toInsert.push({ ...storeData, approved: true })
        }
      }

      // Insert new stores
      if (toInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('stores')
          .insert(toInsert)
        
        if (insertError) {
          console.error('Insert error:', insertError)
          toInsert.forEach(s => errors.push({ shopId: s.ShopID, error: insertError.message }))
        } else {
          inserted += toInsert.length
          toInsert.forEach(s => existingIds.add(s.ShopID))
        }
      }

      // Update existing stores
      for (const store of toUpdate) {
        const { error: updateError } = await supabase
          .from('stores')
          .update(store)
          .eq('ShopID', store.ShopID)
        
        if (updateError) {
          console.error('Update error for', store.ShopID, updateError)
          errors.push({ shopId: store.ShopID, error: updateError.message })
        } else {
          updated++
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          totalParsed: stores.length,
          inserted,
          updated,
          errors: errors.length,
        },
        errors: errors.slice(0, 50), // Return first 50 errors
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Import error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
