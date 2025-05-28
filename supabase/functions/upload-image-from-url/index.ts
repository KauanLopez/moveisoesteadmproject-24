
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl, bucketName = 'catalog-images', filename } = await req.json()
    
    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'URL da imagem é obrigatória' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Fazendo download da imagem:', imageUrl)
    
    // Fetch the image from the URL
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Falha ao baixar imagem: ${imageResponse.status} ${imageResponse.statusText}`)
    }

    // Get the image as blob
    const imageBlob = await imageResponse.blob()
    
    // Validate image type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(imageBlob.type)) {
      throw new Error('Formato de imagem não suportado. Use JPG, PNG ou WebP.')
    }

    // Validate image size (5MB limit)
    if (imageBlob.size > 5 * 1024 * 1024) {
      throw new Error('Imagem muito grande. Limite máximo: 5MB.')
    }

    // Generate filename if not provided
    const fileExtension = imageBlob.type.split('/')[1]
    const generatedFilename = filename || `${crypto.randomUUID()}.${fileExtension}`
    const filePath = `${generatedFilename}`

    console.log('Fazendo upload para bucket:', bucketName, 'como:', filePath)

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, imageBlob, {
        contentType: imageBlob.type,
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Erro no upload:', error)
      throw new Error(`Erro no upload: ${error.message}`)
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath)

    console.log('Upload concluído com sucesso:', urlData.publicUrl)

    return new Response(
      JSON.stringify({ 
        success: true, 
        url: urlData.publicUrl,
        path: filePath,
        size: imageBlob.size,
        type: imageBlob.type
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Erro na função:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno do servidor'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
