
// Local storage service to replace backend functionality
export interface StoredCatalog {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  created_at: string;
  category_id?: string;
  category_name?: string;
  slug: string;
}

export interface StoredCatalogItem {
  id: string;
  catalog_id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface StoredExternalCatalog {
  id: string;
  title: string;
  description: string;
  external_cover_image_url: string;
  external_content_image_urls: string[];
  created_at: string;
}

export interface StoredPdfCatalog {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  content_image_urls: string[];
  created_at: string;
}

export interface StoredContent {
  id: string;
  section: string;
  title: string;
  description: string;
  image_url: string;
  object_position?: string;
  scale?: number;
}

class LocalStorageService {
  private getKey(type: string): string {
    return `moveis_oeste_${type}`;
  }

  // Generic methods
  private get<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return [];
    }
  }

  private set<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  }

  // Content methods
  getContent(): StoredContent[] {
    return this.get<StoredContent>(this.getKey('content'));
  }

  setContent(content: StoredContent[]): void {
    this.set(this.getKey('content'), content);
  }

  addContent(item: StoredContent): void {
    const content = this.getContent();
    const existingIndex = content.findIndex(c => c.id === item.id);
    if (existingIndex >= 0) {
      content[existingIndex] = item;
    } else {
      content.push(item);
    }
    this.setContent(content);
  }

  deleteContent(id: string): void {
    const content = this.getContent().filter(c => c.id !== id);
    this.setContent(content);
  }

  // Catalog methods
  getCatalogs(): StoredCatalog[] {
    return this.get<StoredCatalog>(this.getKey('catalogs'));
  }

  setCatalogs(catalogs: StoredCatalog[]): void {
    this.set(this.getKey('catalogs'), catalogs);
  }

  addCatalog(catalog: StoredCatalog): void {
    const catalogs = this.getCatalogs();
    const existingIndex = catalogs.findIndex(c => c.id === catalog.id);
    if (existingIndex >= 0) {
      catalogs[existingIndex] = catalog;
    } else {
      catalogs.push(catalog);
    }
    this.setCatalogs(catalogs);
  }

  deleteCatalog(id: string): void {
    const catalogs = this.getCatalogs().filter(c => c.id !== id);
    this.setCatalogs(catalogs);
  }

  // Catalog items methods
  getCatalogItems(): StoredCatalogItem[] {
    return this.get<StoredCatalogItem>(this.getKey('catalog_items'));
  }

  setCatalogItems(items: StoredCatalogItem[]): void {
    this.set(this.getKey('catalog_items'), items);
  }

  // External catalogs methods
  getExternalCatalogs(): StoredExternalCatalog[] {
    return this.get<StoredExternalCatalog>(this.getKey('external_catalogs'));
  }

  setExternalCatalogs(catalogs: StoredExternalCatalog[]): void {
    this.set(this.getKey('external_catalogs'), catalogs);
  }

  addExternalCatalog(catalog: StoredExternalCatalog): void {
    const catalogs = this.getExternalCatalogs();
    const existingIndex = catalogs.findIndex(c => c.id === catalog.id);
    if (existingIndex >= 0) {
      catalogs[existingIndex] = catalog;
    } else {
      catalogs.push(catalog);
    }
    this.setExternalCatalogs(catalogs);
  }

  deleteExternalCatalog(id: string): void {
    const catalogs = this.getExternalCatalogs().filter(c => c.id !== id);
    this.setExternalCatalogs(catalogs);
  }

  // PDF catalogs methods
  getPdfCatalogs(): StoredPdfCatalog[] {
    return this.get<StoredPdfCatalog>(this.getKey('pdf_catalogs'));
  }

  setPdfCatalogs(catalogs: StoredPdfCatalog[]): void {
    this.set(this.getKey('pdf_catalogs'), catalogs);
  }

  addPdfCatalog(catalog: StoredPdfCatalog): void {
    const catalogs = this.getPdfCatalogs();
    const existingIndex = catalogs.findIndex(c => c.id === catalog.id);
    if (existingIndex >= 0) {
      catalogs[existingIndex] = catalog;
    } else {
      catalogs.push(catalog);
    }
    this.setPdfCatalogs(catalogs);
  }

  deletePdfCatalog(id: string): void {
    const catalogs = this.getPdfCatalogs().filter(c => c.id !== id);
    this.setPdfCatalogs(catalogs);
  }

  // Clear all data and reinitialize
  clearAllData(): void {
    localStorage.removeItem(this.getKey('content'));
    localStorage.removeItem(this.getKey('catalogs'));
    localStorage.removeItem(this.getKey('catalog_items'));
    localStorage.removeItem(this.getKey('external_catalogs'));
    localStorage.removeItem(this.getKey('pdf_catalogs'));
  }

  // Initialize with default data
  initializeDefaultData(): void {
    // Force clear and reinitialize external catalogs to ensure only new ones appear
    this.clearAllData();
    
    // Initialize content if empty
    this.setContent([
      {
        id: "hero-1",
        section: "hero",
        title: "Transformando Espaços",
        description: "Móveis sob medida que refletem sua personalidade",
        image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop",
        object_position: "center",
        scale: 1
      },
      {
        id: "about-1",
        section: "about",
        title: "Nossa História",
        description: "Com mais de 20 anos de experiência, criamos móveis que contam histórias",
        image_url: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=2070&auto=format&fit=crop",
        object_position: "center",
        scale: 1
      },
      {
        id: "projects-1",
        section: "projects",
        title: "Sala de Estar Moderna",
        description: "Design contemporâneo com funcionalidade premium",
        image_url: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2127&auto=format&fit=crop",
        object_position: "center",
        scale: 1
      },
      {
        id: "projects-2",
        section: "projects",
        title: "Quarto de Luxo",
        description: "Conforto e elegância em cada detalhe",
        image_url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=2080&auto=format&fit=crop",
        object_position: "center",
        scale: 1
      },
      {
        id: "projects-3",
        section: "projects",
        title: "Escritório Minimalista",
        description: "Produtividade em um ambiente clean e organizado",
        image_url: "https://images.unsplash.com/photo-1593476550610-87baa860004a?q=80&w=1974&auto=format&fit=crop",
        object_position: "center",
        scale: 1
      },
      {
        id: "projects-4",
        section: "projects",
        title: "Experiência Gastronômica",
        description: "Mesa de jantar que reúne família e amigos",
        image_url: "https://images.unsplash.com/photo-1615800002234-05c4d488696c?q=80&w=1974&auto=format&fit=crop",
        object_position: "center",
        scale: 1
      }
    ]);

    // Initialize with only the three new external catalogs
    this.setExternalCatalogs([
      {
        id: "imcal-catalog",
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
        ],
        created_at: new Date().toISOString()
      },
      {
        id: "samec-estofados-catalog",
        title: "SAMEC – Estofados",
        description: "Excelente ergonomia, qualidade, design e grande variedade de revestimentos.",
        external_cover_image_url: "https://i.imgur.com/GpqwuEM.png",
        external_content_image_urls: [
          "https://i.imgur.com/KmM3FUd.jpeg",
          "https://i.imgur.com/bA9dhLm.jpeg",
          "https://i.imgur.com/C6un8O7.jpeg",
          "https://i.imgur.com/B5P8CTe.jpeg",
          "https://i.imgur.com/ht3z1sj.jpeg",
          "https://i.imgur.com/rLtXIsf.jpeg",
          "https://i.imgur.com/zT3javQ.jpeg",
          "https://i.imgur.com/BhflkVe.jpeg",
          "https://i.imgur.com/tEkaV3H.jpeg",
          "https://i.imgur.com/XrpgGPa.jpeg",
          "https://i.imgur.com/LbEh54q.jpeg",
          "https://i.imgur.com/jvKsepg.jpeg",
          "https://i.imgur.com/oAV89py.jpeg",
          "https://i.imgur.com/IoTHUk3.jpeg",
          "https://i.imgur.com/reL1fat.jpeg",
          "https://i.imgur.com/XhMDFqh.jpeg",
          "https://i.imgur.com/tJUcsyH.jpeg",
          "https://i.imgur.com/BHQbd4n.jpeg",
          "https://i.imgur.com/VCgOJxf.jpeg",
          "https://i.imgur.com/QmvZJPY.jpeg",
          "https://i.imgur.com/F5wDJS3.jpeg",
          "https://i.imgur.com/ffp86qz.jpeg",
          "https://i.imgur.com/YcGLGCI.jpeg",
          "https://i.imgur.com/8Y1kg3o.jpeg",
          "https://i.imgur.com/TGG3og1.jpeg",
          "https://i.imgur.com/AH0YvvC.jpeg",
          "https://i.imgur.com/fbDjFt7.jpeg",
          "https://i.imgur.com/FwHGYJe.jpeg",
          "https://i.imgur.com/H9ujCSD.jpeg",
          "https://i.imgur.com/dVMaBsy.jpeg",
          "https://i.imgur.com/u2r0O3R.jpeg",
          "https://i.imgur.com/uL4Wbt5.jpeg",
          "https://i.imgur.com/WpeZcwo.jpeg",
          "https://i.imgur.com/u5A4Jfh.jpeg",
          "https://i.imgur.com/rDWiGSu.jpeg",
          "https://i.imgur.com/ELOFzCV.jpeg",
          "https://i.imgur.com/iWHBBF4.jpeg",
          "https://i.imgur.com/LzvF4qL.jpeg",
          "https://i.imgur.com/x9CsdPV.jpeg",
          "https://i.imgur.com/NCI0Ci9.jpeg",
          "https://i.imgur.com/kxWsNuF.jpeg",
          "https://i.imgur.com/d61QSGD.jpeg",
          "https://i.imgur.com/SmEsNCE.jpeg",
          "https://i.imgur.com/jquCSXv.jpeg",
          "https://i.imgur.com/4k9SLEz.jpeg",
          "https://i.imgur.com/vwQiAyv.jpeg",
          "https://i.imgur.com/MfimbCQ.jpeg",
          "https://i.imgur.com/stEqYCg.jpeg",
          "https://i.imgur.com/SvmsuEV.jpeg",
          "https://i.imgur.com/ROlX183.jpeg",
          "https://i.imgur.com/xKn9KPS.jpeg",
          "https://i.imgur.com/sXkpMQ6.jpeg",
          "https://i.imgur.com/RaHLq8D.jpeg",
          "https://i.imgur.com/zEesktS.jpeg",
          "https://i.imgur.com/sPr87G8.jpeg",
          "https://i.imgur.com/JkCDrHF.jpeg",
          "https://i.imgur.com/vQPbm6q.jpeg",
          "https://i.imgur.com/zGj93YJ.jpeg",
          "https://i.imgur.com/fGTQkHs.jpeg",
          "https://i.imgur.com/9PUVsIH.jpeg",
          "https://i.imgur.com/94Q5c0H.jpeg",
          "https://i.imgur.com/nRdGgOk.jpeg",
          "https://i.imgur.com/gN3to7Q.jpeg",
          "https://i.imgur.com/3QvE60R.jpeg",
          "https://i.imgur.com/VJP5AD0.jpeg",
          "https://i.imgur.com/8ckCBz2.jpeg",
          "https://i.imgur.com/MBBaLiu.jpeg",
          "https://i.imgur.com/1ynDt33.jpeg",
          "https://i.imgur.com/iyfxqrh.jpeg",
          "https://i.imgur.com/0SNPAE9.jpeg",
          "https://i.imgur.com/YNul91f.jpeg",
          "https://i.imgur.com/lfo3ZY4.jpeg",
          "https://i.imgur.com/WP6Ocio.jpeg",
          "https://i.imgur.com/nDyECDS.jpeg",
          "https://i.imgur.com/UC2QiZ0.jpeg",
          "https://i.imgur.com/qYvHamY.jpeg",
          "https://i.imgur.com/aOR25SK.jpeg",
          "https://i.imgur.com/70laq6k.jpeg",
          "https://i.imgur.com/GwRLahz.jpeg",
          "https://i.imgur.com/aYM1Upn.jpeg",
          "https://i.imgur.com/htVDgiK.jpeg",
          "https://i.imgur.com/kOYcj4C.jpeg",
          "https://i.imgur.com/C0kv6aN.jpeg",
          "https://i.imgur.com/swtw7mp.jpeg",
          "https://i.imgur.com/BGtBGf5.jpeg",
          "https://i.imgur.com/0MAJO2A.jpeg",
          "https://i.imgur.com/Gc0VpjZ.jpeg",
          "https://i.imgur.com/Wj5KDbH.jpeg",
          "https://i.imgur.com/ebaFux6.jpeg",
          "https://i.imgur.com/KelLGQS.jpeg",
          "https://i.imgur.com/bOIjJ2S.jpeg",
          "https://i.imgur.com/NbIupa4.jpeg",
          "https://i.imgur.com/CyDNiBW.jpeg",
          "https://i.imgur.com/qhvtp6P.jpeg",
          "https://i.imgur.com/8M3neAY.jpeg",
          "https://i.imgur.com/q3lxL5m.jpeg",
          "https://i.imgur.com/wGolL45.jpeg",
          "https://i.imgur.com/7VGWLnX.jpeg",
          "https://i.imgur.com/m4bMoYx.jpeg",
          "https://i.imgur.com/f5ffSId.jpeg",
          "https://i.imgur.com/3EOiYLj.jpeg",
          "https://i.imgur.com/DQAKsY4.jpeg",
          "https://i.imgur.com/DAy1ut4.jpeg",
          "https://i.imgur.com/HbkuOHT.jpeg",
          "https://i.imgur.com/YiPj3TN.jpeg",
          "https://i.imgur.com/cmttiBR.jpeg",
          "https://i.imgur.com/NdNgDEJ.jpeg",
          "https://i.imgur.com/AnAGU5B.jpeg",
          "https://i.imgur.com/Ybm9V8o.jpeg",
          "https://i.imgur.com/ubBoXBY.jpeg",
          "https://i.imgur.com/k0OchZG.jpeg",
          "https://i.imgur.com/PVrCC2U.jpeg",
          "https://i.imgur.com/4G7rVb5.jpeg",
          "https://i.imgur.com/xBw5GVT.jpeg",
          "https://i.imgur.com/oTtnYmX.jpeg",
          "https://i.imgur.com/5LSoF7L.jpeg",
          "https://i.imgur.com/u80kihp.jpeg",
          "https://i.imgur.com/qC8WdO1.jpeg",
          "https://i.imgur.com/d5VFwSY.jpeg",
          "https://i.imgur.com/yLlpV63.jpeg",
          "https://i.imgur.com/MmZA69B.jpeg",
          "https://i.imgur.com/ZacaVrC.jpeg",
          "https://i.imgur.com/xHTEdRE.jpeg",
          "https://i.imgur.com/fEgSzZ2.jpeg",
          "https://i.imgur.com/LFtCSRI.jpeg",
          "https://i.imgur.com/weXy4EC.jpeg",
          "https://i.imgur.com/NX0BWE6.jpeg",
          "https://i.imgur.com/oBkrlbB.jpeg",
          "https://i.imgur.com/oSzDtlM.jpeg",
          "https://i.imgur.com/ydR3tyW.jpeg",
          "https://i.imgur.com/qhyqkgf.jpeg",
          "https://i.imgur.com/OoSMZem.jpeg",
          "https://i.imgur.com/3biVlZ4.jpeg",
          "https://i.imgur.com/IyIFLCN.jpeg",
          "https://i.imgur.com/W0SvHPD.jpeg",
          "https://i.imgur.com/1cn7rog.jpeg",
          "https://i.imgur.com/sd6zdof.jpeg",
          "https://i.imgur.com/Z23HKPC.jpeg",
          "https://i.imgur.com/sOIIeWU.jpeg",
          "https://i.imgur.com/oXwm2em.jpeg",
          "https://i.imgur.com/9rlMlFv.jpeg",
          "https://i.imgur.com/iQFWUMB.jpeg",
          "https://i.imgur.com/pDFSjy7.jpeg",
          "https://i.imgur.com/A8WzXs8.jpeg",
          "https://i.imgur.com/5X2qPiy.jpeg",
          "https://i.imgur.com/IvnFxr5.jpeg",
          "https://i.imgur.com/cAeZ61X.jpeg",
          "https://i.imgur.com/53HAMwV.jpeg",
          "https://i.imgur.com/LeA1Z7S.jpeg",
          "https://i.imgur.com/On8xTZt.jpeg",
          "https://i.imgur.com/vCXot19.jpeg",
          "https://i.imgur.com/3VBIkKu.jpeg",
          "https://i.imgur.com/fIH7foE.jpeg",
          "https://i.imgur.com/nzRoNhP.jpeg",
          "https://i.imgur.com/EmwnurQ.jpeg",
          "https://i.imgur.com/jVMMuJH.jpeg",
          "https://i.imgur.com/wxiUrOL.jpeg",
          "https://i.imgur.com/7HSwi4j.jpeg",
          "https://i.imgur.com/B0kAnNb.jpeg",
          "https://i.imgur.com/zQ5fphA.jpeg",
          "https://i.imgur.com/I8a68hQ.jpeg",
          "https://i.imgur.com/vbA69FG.jpeg",
          "https://i.imgur.com/CGtzeJK.jpeg",
          "https://i.imgur.com/MiA7T4Q.jpeg"
        ],
        created_at: new Date().toISOString()
      },
      {
        id: "king-konfort-catalog",
        title: "King Konfort",
        description: "Excelente ergonomia, qualidade, design e grande variedade de revestimentos.",
        external_cover_image_url: "https://i.imgur.com/cGScdPw.png",
        external_content_image_urls: [
          "https://i.imgur.com/UF57xsj.png",
          "https://i.imgur.com/q3MqMeV.png",
          "https://i.imgur.com/mfvGI3P.png",
          "https://i.imgur.com/5hsqhvE.jpeg",
          "https://i.imgur.com/hnZYjaW.png",
          "https://i.imgur.com/1l2yiwj.png",
          "https://i.imgur.com/faDHAI8.png",
          "https://i.imgur.com/7vLplkk.png",
          "https://i.imgur.com/cprFFbE.jpeg",
          "https://i.imgur.com/KmgUPuU.png",
          "https://i.imgur.com/52e2KQf.jpeg",
          "https://i.imgur.com/pZaE47i.png",
          "https://i.imgur.com/NRSjy39.png",
          "https://i.imgur.com/yCWQeQ9.png",
          "https://i.imgur.com/oduZNJx.jpeg",
          "https://i.imgur.com/B7CKmNY.jpeg",
          "https://i.imgur.com/n5kjDOz.jpeg",
          "https://i.imgur.com/QUsnlz2.png",
          "https://i.imgur.com/l2w9138.png",
          "https://i.imgur.com/8Dv2wHA.png",
          "https://i.imgur.com/DccWxxY.jpeg",
          "https://i.imgur.com/17pvzkY.png",
          "https://i.imgur.com/fR9DO1l.png",
          "https://i.imgur.com/MFVb8jZ.png",
          "https://i.imgur.com/VWnAqQr.png",
          "https://i.imgur.com/t8Rsbmv.png",
          "https://i.imgur.com/goloRSr.png",
          "https://i.imgur.com/yrnC3CP.png",
          "https://i.imgur.com/YnqpPAA.png"
        ],
        created_at: new Date().toISOString()
      }
    ]);
  }
}

export const localStorageService = new LocalStorageService();
