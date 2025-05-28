
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestPayload {
  pdfUrl: string;
  filename?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { pdfUrl, filename }: RequestPayload = await req.json();
    
    console.log(`Processing PDF: ${pdfUrl}, filename: ${filename}`);
    
    if (!pdfUrl) {
      throw new Error('PDF URL is required');
    }

    // Create initial record in database
    const { data: catalogRecord, error: insertError } = await supabaseClient
      .from('pdf_derived_catalogs')
      .insert({
        original_pdf_url: pdfUrl,
        original_pdf_filename: filename,
        processing_status: 'processing'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating catalog record:', insertError);
      throw insertError;
    }

    console.log(`Created catalog record: ${catalogRecord.id}`);

    try {
      // Fetch the PDF file
      const pdfResponse = await fetch(pdfUrl);
      if (!pdfResponse.ok) {
        throw new Error(`Failed to fetch PDF: ${pdfResponse.statusText}`);
      }

      const pdfBuffer = await pdfResponse.arrayBuffer();
      console.log(`PDF downloaded, size: ${pdfBuffer.byteLength} bytes`);

      // For now, we'll simulate PDF processing with placeholder images
      // In a real implementation, you would use a PDF processing library
      // like pdf-lib or similar to extract actual pages
      
      const mockPageCount = Math.floor(Math.random() * 8) + 3; // 3-10 pages
      const extractedImages: string[] = [];
      let coverImageUrl = '';

      // Generate placeholder images for each page
      for (let i = 1; i <= mockPageCount; i++) {
        const colors = ['f8fafc', 'f1f5f9', 'e2e8f0', 'cbd5e1', 'd1d5db'];
        const color = colors[i % colors.length];
        const width = 800;
        const height = 1000;
        
        // Create a simple placeholder image URL
        const placeholderUrl = `https://via.placeholder.com/${width}x${height}/${color}/64748b?text=Página+${i}`;
        
        try {
          // Download the placeholder image
          const imageResponse = await fetch(placeholderUrl);
          if (!imageResponse.ok) {
            throw new Error(`Failed to fetch placeholder image for page ${i}`);
          }
          
          const imageBlob = await imageResponse.blob();
          const fileName = `catalog-${catalogRecord.id}-page-${i}.png`;
          const filePath = `extracted/${fileName}`;
          
          // Upload to processed-catalog-images bucket
          const { data: uploadData, error: uploadError } = await supabaseClient
            .storage
            .from('processed-catalog-images')
            .upload(filePath, imageBlob, {
              contentType: 'image/png',
              cacheControl: '3600',
              upsert: false
            });
          
          if (uploadError) {
            console.error(`Error uploading page ${i}:`, uploadError);
            throw uploadError;
          }
          
          // Get public URL
          const { data: urlData } = supabaseClient
            .storage
            .from('processed-catalog-images')
            .getPublicUrl(filePath);
          
          const imageUrl = urlData.publicUrl;
          
          if (i === 1) {
            coverImageUrl = imageUrl;
          } else {
            extractedImages.push(imageUrl);
          }
          
          console.log(`Processed page ${i}: ${imageUrl}`);
        } catch (pageError) {
          console.error(`Error processing page ${i}:`, pageError);
          // Continue with other pages
        }
      }

      // Update catalog record with extracted images
      const { error: updateError } = await supabaseClient
        .from('pdf_derived_catalogs')
        .update({
          cover_image_url: coverImageUrl,
          content_image_urls: extractedImages,
          total_pages: mockPageCount,
          processing_status: 'completed',
          processing_error: null
        })
        .eq('id', catalogRecord.id);
      
      if (updateError) {
        console.error('Error updating catalog record:', updateError);
        throw updateError;
      }

      console.log(`Successfully processed PDF catalog ${catalogRecord.id}: ${mockPageCount} pages`);

      return new Response(
        JSON.stringify({
          success: true,
          catalogId: catalogRecord.id,
          pagesCount: mockPageCount,
          coverImage: coverImageUrl,
          contentImages: extractedImages
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );

    } catch (processingError) {
      // Update record with error status
      await supabaseClient
        .from('pdf_derived_catalogs')
        .update({
          processing_status: 'failed',
          processing_error: processingError.message
        })
        .eq('id', catalogRecord.id);
      
      throw processingError;
    }

  } catch (error) {
    console.error('Error processing PDF catalog:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
