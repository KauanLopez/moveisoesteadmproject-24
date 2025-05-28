
import { supabase } from '@/integrations/supabase/client';

export const createImcalCatalog = async () => {
  // First check if IMCAL catalog already exists
  const { data: existingCatalog } = await supabase
    .from('external_url_catalogs')
    .select('id')
    .eq('title', 'IMCAL')
    .single();

  if (existingCatalog) {
    console.log('IMCAL catalog already exists, skipping creation');
    return existingCatalog;
  }

  const catalogData = {
    title: "IMCAL",
    description: "Criando ambientes que tocam os sentidos e emocionam.",
    external_cover_image_url: "https://i.imgur.com/7l0H29Q.jpeg",
    external_content_image_urls: [
      "https://i.imgur.com/X09OW6n.jpeg",
      "https://i.imgur.com/dNpw2Y5.jpeg",
      "https://i.imgur.com/fqnuiCo.jpeg",
      "https://i.imgur.com/l8S2wqm.jpeg",
      "https://i.imgur.com/dznxeDV.jpeg",
      "https://i.imgur.com/5ORtQJ1.jpeg",
      "https://i.imgur.com/dRTdRHA.jpeg",
      "https://i.imgur.com/4Ej7hRU.jpeg",
      "https://i.imgur.com/rWMfDqd.jpeg",
      "https://i.imgur.com/zGENPD2.jpeg",
      "https://i.imgur.com/fb6ZGZA.jpeg",
      "https://i.imgur.com/8eUJRDR.jpeg",
      "https://i.imgur.com/oPR2mPB.jpeg",
      "https://i.imgur.com/cRX6ndx.jpeg",
      "https://i.imgur.com/BCPdI5I.jpeg",
      "https://i.imgur.com/J0garDp.jpeg",
      "https://i.imgur.com/UWli8XE.jpeg",
      "https://i.imgur.com/YSwLgSY.jpeg",
      "https://i.imgur.com/wu3uZR1.jpeg",
      "https://i.imgur.com/VJK7kuG.jpeg",
      "https://i.imgur.com/R727cGl.jpeg",
      "https://i.imgur.com/RD4trM1.jpeg",
      "https://i.imgur.com/KyTzj4E.jpeg",
      "https://i.imgur.com/8XXf77i.jpeg",
      "https://i.imgur.com/7RLrLfQ.jpeg",
      "https://i.imgur.com/lCG82SV.jpeg",
      "https://i.imgur.com/xO7eiUs.jpeg",
      "https://i.imgur.com/trlXrzF.jpeg",
      "https://i.imgur.com/Hr83FNG.jpeg",
      "https://i.imgur.com/ggyA8G1.jpeg",
      "https://i.imgur.com/o1pCfbh.jpeg",
      "https://i.imgur.com/6KHtnKu.jpeg",
      "https://i.imgur.com/w1pgBo8.jpeg",
      "https://i.imgur.com/FHfJvDx.jpeg",
      "https://i.imgur.com/pFYWfEc.jpeg",
      "https://i.imgur.com/n1KBIJ3.jpeg",
      "https://i.imgur.com/z9yIqy6.jpeg",
      "https://i.imgur.com/HiPqGz6.jpeg",
      "https://i.imgur.com/9ZXoIVy.jpeg",
      "https://i.imgur.com/T6D05lV.jpeg",
      "https://i.imgur.com/FzwWpgr.jpeg",
      "https://i.imgur.com/tVtb59Y.jpeg",
      "https://i.imgur.com/bqkKWPI.jpeg",
      "https://i.imgur.com/rrE5pHu.jpeg",
      "https://i.imgur.com/0oQPX9q.jpeg",
      "https://i.imgur.com/NeKUxJD.jpeg",
      "https://i.imgur.com/mkrpH12.jpeg",
      "https://i.imgur.com/rzLlgQR.jpeg",
      "https://i.imgur.com/HKM5CpQ.jpeg",
      "https://i.imgur.com/qjXrOXF.jpeg",
      "https://i.imgur.com/ZfCAmAK.jpeg",
      "https://i.imgur.com/C9jkMF6.jpeg",
      "https://i.imgur.com/zzt1wct.jpeg",
      "https://i.imgur.com/VNMxQzU.jpeg",
      "https://i.imgur.com/TFX5OEa.jpeg",
      "https://i.imgur.com/M5JYuux.jpeg",
      "https://i.imgur.com/ZELlPWN.jpeg",
      "https://i.imgur.com/p6wIgjF.jpeg",
      "https://i.imgur.com/0xeqeCP.jpeg",
      "https://i.imgur.com/8BrAJ9J.jpeg",
      "https://i.imgur.com/TG0SuUg.jpeg",
      "https://i.imgur.com/AVfuATg.jpeg",
      "https://i.imgur.com/GwX0uYM.jpeg",
      "https://i.imgur.com/oS0KKnG.jpeg",
      "https://i.imgur.com/R52pdZU.jpeg",
      "https://i.imgur.com/g2O9edq.jpeg",
      "https://i.imgur.com/hcHb2J9.jpeg",
      "https://i.imgur.com/foRmZ8L.jpeg",
      "https://i.imgur.com/eKP16bI.jpeg",
      "https://i.imgur.com/leuXKtH.jpeg",
      "https://i.imgur.com/TQShmIe.jpeg"
    ]
  };

  try {
    const { data, error } = await supabase
      .from('external_url_catalogs')
      .insert([catalogData])
      .select()
      .single();

    if (error) {
      console.error('Error creating IMCAL catalog:', error);
      throw error;
    }

    console.log('IMCAL catalog created successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to create IMCAL catalog:', error);
    throw error;
  }
};
