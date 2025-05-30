import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CatalogImage {
  url: string;
  title: string;
}

interface Catalog {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  images: CatalogImage[];
}

const catalogsData: Catalog[] = [
  {
    id: '1',
    name: 'IMCAL',
    description: 'Criando ambientes que tocam os sentidos e emocionam.',
    coverImage: 'https://i.imgur.com/7l0H29Q.jpeg',
    images: [
      { url: 'https://i.imgur.com/X09OW6n.jpeg', title: 'Página 1' },
      { url: 'https://i.imgur.com/dNpw2Y5.jpeg', title: 'Página 2' },
      { url: 'https://i.imgur.com/fqnuiCo.jpeg', title: 'Página 3' },
      { url: 'https://i.imgur.com/l8S2wqm.jpeg', title: 'Página 4' },
      { url: 'https://i.imgur.com/dznxeDV.jpeg', title: 'Página 5' },
      { url: 'https://i.imgur.com/5ORtQJ1.jpeg', title: 'Página 6' },
      { url: 'https://i.imgur.com/dRTdRHA.jpeg', title: 'Página 7' },
      { url: 'https://i.imgur.com/4Ej7hRU.jpeg', title: 'Página 8' },
      { url: 'https://i.imgur.com/rWMfDqd.jpeg', title: 'Página 9' },
      { url: 'https://i.imgur.com/zGENPD2.jpeg', title: 'Página 10' },
      { url: 'https://i.imgur.com/fb6ZGZA.jpeg', title: 'Página 11' },
      { url: 'https://i.imgur.com/8eUJRDR.jpeg', title: 'Página 12' },
      { url: 'https://i.imgur.com/oPR2mPB.jpeg', title: 'Página 13' },
      { url: 'https://i.imgur.com/cRX6ndx.jpeg', title: 'Página 14' },
      { url: 'https://i.imgur.com/BCPdI5I.jpeg', title: 'Página 15' },
      { url: 'https://i.imgur.com/J0garDp.jpeg', title: 'Página 16' },
      { url: 'https://i.imgur.com/UWli8XE.jpeg', title: 'Página 17' },
      { url: 'https://i.imgur.com/YSwLgSY.jpeg', title: 'Página 18' },
      { url: 'https://i.imgur.com/wu3uZR1.jpeg', title: 'Página 19' },
      { url: 'https://i.imgur.com/VJK7kuG.jpeg', title: 'Página 20' },
      { url: 'https://i.imgur.com/R727cGl.jpeg', title: 'Página 21' },
      { url: 'https://i.imgur.com/RD4trM1.jpeg', title: 'Página 22' },
      { url: 'https://i.imgur.com/KyTzj4E.jpeg', title: 'Página 23' },
      { url: 'https://i.imgur.com/8XXf77i.jpeg', title: 'Página 24' },
      { url: 'https://i.imgur.com/7RLrLfQ.jpeg', title: 'Página 25' },
      { url: 'https://i.imgur.com/lCG82SV.jpeg', title: 'Página 26' },
      { url: 'https://i.imgur.com/xO7eiUs.jpeg', title: 'Página 27' },
      { url: 'https://i.imgur.com/trlXrzF.jpeg', title: 'Página 28' },
      { url: 'https://i.imgur.com/Hr83FNG.jpeg', title: 'Página 29' },
      { url: 'https://i.imgur.com/ggyA8G1.jpeg', title: 'Página 30' },
      { url: 'https://i.imgur.com/o1pCfbh.jpeg', title: 'Página 31' },
      { url: 'https://i.imgur.com/6KHtnKu.jpeg', title: 'Página 32' },
      { url: 'https://i.imgur.com/w1pgBo8.jpeg', title: 'Página 33' },
      { url: 'https://i.imgur.com/FHfJvDx.jpeg', title: 'Página 34' },
      { url: 'https://i.imgur.com/pFYWfEc.jpeg', title: 'Página 35' },
      { url: 'https://i.imgur.com/n1KBIJ3.jpeg', title: 'Página 36' },
      { url: 'https://i.imgur.com/z9yIqy6.jpeg', title: 'Página 37' },
      { url: 'https://i.imgur.com/HiPqGz6.jpeg', title: 'Página 38' },
      { url: 'https://i.imgur.com/9ZXoIVy.jpeg', title: 'Página 39' },
      { url: 'https://i.imgur.com/T6D05lV.jpeg', title: 'Página 40' },
      { url: 'https://i.imgur.com/FzwWpgr.jpeg', title: 'Página 41' },
      { url: 'https://i.imgur.com/tVtb59Y.jpeg', title: 'Página 42' },
      { url: 'https://i.imgur.com/bqkKWPI.jpeg', title: 'Página 43' },
      { url: 'https://i.imgur.com/rrE5pHu.jpeg', title: 'Página 44' },
      { url: 'https://i.imgur.com/0oQPX9q.jpeg', title: 'Página 45' },
      { url: 'https://i.imgur.com/NeKUxJD.jpeg', title: 'Página 46' },
      { url: 'https://i.imgur.com/mkrpH12.jpeg', title: 'Página 47' },
      { url: 'https://i.imgur.com/rzLlgQR.jpeg', title: 'Página 48' },
      { url: 'https://i.imgur.com/HKM5CpQ.jpeg', title: 'Página 49' },
      { url: 'https://i.imgur.com/qjXrOXF.jpeg', title: 'Página 50' },
      { url: 'https://i.imgur.com/ZfCAmAK.jpeg', title: 'Página 51' },
      { url: 'https://i.imgur.com/C9jkMF6.jpeg', title: 'Página 52' },
      { url: 'https://i.imgur.com/zzt1wct.jpeg', title: 'Página 53' },
      { url: 'https://i.imgur.com/VNMxQzU.jpeg', title: 'Página 54' },
      { url: 'https://i.imgur.com/TFX5OEa.jpeg', title: 'Página 55' },
      { url: 'https://i.imgur.com/M5JYuux.jpeg', title: 'Página 56' },
      { url: 'https://i.imgur.com/ZELlPWN.jpeg', title: 'Página 57' },
      { url: 'https://i.imgur.com/p6wIgjF.jpeg', title: 'Página 58' },
      { url: 'https://i.imgur.com/0xeqeCP.jpeg', title: 'Página 59' },
      { url: 'https://i.imgur.com/8BrAJ9J.jpeg', title: 'Página 60' },
      { url: 'https://i.imgur.com/TG0SuUg.jpeg', title: 'Página 61' },
      { url: 'https://i.imgur.com/AVfuATg.jpeg', title: 'Página 62' },
      { url: 'https://i.imgur.com/GwX0uYM.jpeg', title: 'Página 63' },
      { url: 'https://i.imgur.com/oS0KKnG.jpeg', title: 'Página 64' },
      { url: 'https://i.imgur.com/R52pdZU.jpeg', title: 'Página 65' },
      { url: 'https://i.imgur.com/g2O9edq.jpeg', title: 'Página 66' },
      { url: 'https://i.imgur.com/hcHb2J9.jpeg', title: 'Página 67' },
      { url: 'https://i.imgur.com/foRmZ8L.jpeg', title: 'Página 68' },
      { url: 'https://i.imgur.com/eKP16bI.jpeg', title: 'Página 69' },
      { url: 'https://i.imgur.com/leuXKtH.jpeg', title: 'Página 70' },
      { url: 'https://i.imgur.com/TQShmIe.jpeg', title: 'Página 71' }
    ]
  },
  {
    id: '2',
    name: 'SAMEC – Estofados',
    description: 'Excelente ergonomia, qualidade, design e grande variedade de revestimentos.',
    coverImage: 'https://i.imgur.com/GpqwuEM.png',
    images: [
      { url: 'https://i.imgur.com/KmM3FUd.jpeg', title: 'Página 1' },
      { url: 'https://i.imgur.com/bA9dhLm.jpeg', title: 'Página 2' },
      { url: 'https://i.imgur.com/C6un8O7.jpeg', title: 'Página 3' },
      { url: 'https://i.imgur.com/B5P8CTe.jpeg', title: 'Página 4' },
      { url: 'https://i.imgur.com/ht3z1sj.jpeg', title: 'Página 5' },
      { url: 'https://i.imgur.com/rLtXIsf.jpeg', title: 'Página 6' },
      { url: 'https://i.imgur.com/zT3javQ.jpeg', title: 'Página 7' },
      { url: 'https://i.imgur.com/BhflkVe.jpeg', title: 'Página 8' },
      { url: 'https://i.imgur.com/tEkaV3H.jpeg', title: 'Página 9' },
      { url: 'https://i.imgur.com/XrpgGPa.jpeg', title: 'Página 10' },
      { url: 'https://i.imgur.com/LbEh54q.jpeg', title: 'Página 11' },
      { url: 'https://i.imgur.com/jvKsepg.jpeg', title: 'Página 12' },
      { url: 'https://i.imgur.com/oAV89py.jpeg', title: 'Página 13' },
      { url: 'https://i.imgur.com/IoTHUk3.jpeg', title: 'Página 14' },
      { url: 'https://i.imgur.com/reL1fat.jpeg', title: 'Página 15' },
      { url: 'https://i.imgur.com/XhMDFqh.jpeg', title: 'Página 16' },
      { url: 'https://i.imgur.com/tJUcsyH.jpeg', title: 'Página 17' },
      { url: 'https://i.imgur.com/BHQbd4n.jpeg', title: 'Página 18' },
      { url: 'https://i.imgur.com/VCgOJxf.jpeg', title: 'Página 19' },
      { url: 'https://i.imgur.com/QmvZJPY.jpeg', title: 'Página 20' },
      { url: 'https://i.imgur.com/F5wDJS3.jpeg', title: 'Página 21' },
      { url: 'https://i.imgur.com/ffp86qz.jpeg', title: 'Página 22' },
      { url: 'https://i.imgur.com/YcGLGCI.jpeg', title: 'Página 23' },
      { url: 'https://i.imgur.com/8Y1kg3o.jpeg', title: 'Página 24' },
      { url: 'https://i.imgur.com/TGG3og1.jpeg', title: 'Página 25' },
      { url: 'https://i.imgur.com/AH0YvvC.jpeg', title: 'Página 26' },
      { url: 'https://i.imgur.com/fbDjFt7.jpeg', title: 'Página 27' },
      { url: 'https://i.imgur.com/FwHGYJe.jpeg', title: 'Página 28' },
      { url: 'https://i.imgur.com/H9ujCSD.jpeg', title: 'Página 29' },
      { url: 'https://i.imgur.com/dVMaBsy.jpeg', title: 'Página 30' },
      { url: 'https://i.imgur.com/u2r0O3R.jpeg', title: 'Página 31' },
      { url: 'https://i.imgur.com/uL4Wbt5.jpeg', title: 'Página 32' },
      { url: 'https://i.imgur.com/WpeZcwo.jpeg', title: 'Página 33' },
      { url: 'https://i.imgur.com/u5A4Jfh.jpeg', title: 'Página 34' },
      { url: 'https://i.imgur.com/rDWiGSu.jpeg', title: 'Página 35' },
      { url: 'https://i.imgur.com/ELOFzCV.jpeg', title: 'Página 36' },
      { url: 'https://i.imgur.com/iWHBBF4.jpeg', title: 'Página 37' },
      { url: 'https://i.imgur.com/LzvF4qL.jpeg', title: 'Página 38' },
      { url: 'https://i.imgur.com/x9CsdPV.jpeg', title: 'Página 39' },
      { url: 'https://i.imgur.com/NCI0Ci9.jpeg', title: 'Página 40' },
      { url: 'https://i.imgur.com/kxWsNuF.jpeg', title: 'Página 41' },
      { url: 'https://i.imgur.com/d61QSGD.jpeg', title: 'Página 42' },
      { url: 'https://i.imgur.com/SmEsNCE.jpeg', title: 'Página 43' },
      { url: 'https://i.imgur.com/jquCSXv.jpeg', title: 'Página 44' },
      { url: 'https://i.imgur.com/4k9SLEz.jpeg', title: 'Página 45' },
      { url: 'https://i.imgur.com/vwQiAyv.jpeg', title: 'Página 46' },
      { url: 'https://i.imgur.com/MfimbCQ.jpeg', title: 'Página 47' },
      { url: 'https://i.imgur.com/stEqYCg.jpeg', title: 'Página 48' },
      { url: 'https://i.imgur.com/SvmsuEV.jpeg', title: 'Página 49' },
      { url: 'https://i.imgur.com/ROlX183.jpeg', title: 'Página 50' },
      { url: 'https://i.imgur.com/xKn9KPS.jpeg', title: 'Página 51' },
      { url: 'https://i.imgur.com/sXkpMQ6.jpeg', title: 'Página 52' },
      { url: 'https://i.imgur.com/RaHLq8D.jpeg', title: 'Página 53' },
      { url: 'https://i.imgur.com/zEesktS.jpeg', title: 'Página 54' },
      { url: 'https://i.imgur.com/sPr87G8.jpeg', title: 'Página 55' },
      { url: 'https://i.imgur.com/JkCDrHF.jpeg', title: 'Página 56' },
      { url: 'https://i.imgur.com/vQPbm6q.jpeg', title: 'Página 57' },
      { url: 'https://i.imgur.com/zGj93YJ.jpeg', title: 'Página 58' },
      { url: 'https://i.imgur.com/fGTQkHs.jpeg', title: 'Página 59' },
      { url: 'https://i.imgur.com/9PUVsIH.jpeg', title: 'Página 60' },
      { url: 'https://i.imgur.com/94Q5c0H.jpeg', title: 'Página 61' },
      { url: 'https://i.imgur.com/nRdGgOk.jpeg', title: 'Página 62' },
      { url: 'https://i.imgur.com/gN3to7Q.jpeg', title: 'Página 63' },
      { url: 'https://i.imgur.com/3QvE60R.jpeg', title: 'Página 64' },
      { url: 'https://i.imgur.com/VJP5AD0.jpeg', title: 'Página 65' },
      { url: 'https://i.imgur.com/8ckCBz2.jpeg', title: 'Página 66' },
      { url: 'https://i.imgur.com/MBBaLiu.jpeg', title: 'Página 67' },
      { url: 'https://i.imgur.com/1ynDt33.jpeg', title: 'Página 68' },
      { url: 'https://i.imgur.com/iyfxqrh.jpeg', title: 'Página 69' }
    ]
  },
  {
    id: '3',
    name: 'King Konfort',
    description: 'Excelente ergonomia, qualidade, design e grande variedade de revestimentos.',
    coverImage: 'https://i.imgur.com/cGScdPw.png',
    images: [
      { url: 'https://i.imgur.com/UF57xsj.png', title: 'Página 1' },
      { url: 'https://i.imgur.com/q3MqMeV.png', title: 'Página 2' },
      { url: 'https://i.imgur.com/mfvGI3P.png', title: 'Página 3' },
      { url: 'https://i.imgur.com/5hsqhvE.jpeg', title: 'Página 4' },
      { url: 'https://i.imgur.com/hnZYjaW.png', title: 'Página 5' },
      { url: 'https://i.imgur.com/1l2yiwj.png', title: 'Página 6' },
      { url: 'https://i.imgur.com/faDHAI8.png', title: 'Página 7' },
      { url: 'https://i.imgur.com/7vLplkk.png', title: 'Página 8' },
      { url: 'https://i.imgur.com/cprFFbE.jpeg', title: 'Página 9' },
      { url: 'https://i.imgur.com/KmgUPuU.png', title: 'Página 10' },
      { url: 'https://i.imgur.com/52e2KQf.jpeg', title: 'Página 11' },
      { url: 'https://i.imgur.com/pZaE47i.png', title: 'Página 12' },
      { url: 'https://i.imgur.com/NRSjy39.png', title: 'Página 13' },
      { url: 'https://i.imgur.com/yCWQeQ9.png', title: 'Página 14' },
      { url: 'https://i.imgur.com/oduZNJx.jpeg', title: 'Página 15' },
      { url: 'https://i.imgur.com/B7CKmNY.jpeg', title: 'Página 16' },
      { url: 'https://i.imgur.com/n5kjDOz.jpeg', title: 'Página 17' },
      { url: 'https://i.imgur.com/QUsnlz2.png', title: 'Página 18' },
      { url: 'https://i.imgur.com/l2w9138.png', title: 'Página 19' },
      { url: 'https://i.imgur.com/8Dv2wHA.png', title: 'Página 20' },
      { url: 'https://i.imgur.com/DccWxxY.jpeg', title: 'Página 21' },
      { url: 'https://i.imgur.com/17pvzkY.png', title: 'Página 22' },
      { url: 'https://i.imgur.com/fR9DO1l.png', title: 'Página 23' },
      { url: 'https://i.imgur.com/MFVb8jZ.png', title: 'Página 24' },
      { url: 'https://i.imgur.com/VWnAqQr.png', title: 'Página 25' },
      { url: 'https://i.imgur.com/t8Rsbmv.png', title: 'Página 26' },
      { url: 'https://i.imgur.com/goloRSr.png', title: 'Página 27' },
      { url: 'https://i.imgur.com/yrnC3CP.png', title: 'Página 28' },
      { url: 'https://i.imgur.com/YnqpPAA.png', title: 'Página 29' }
    ]
  }
];

const CatalogSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCatalog = () => {
    setCurrentIndex((prev) => (prev + 1) % catalogsData.length);
  };

  const prevCatalog = () => {
    setCurrentIndex((prev) => (prev - 1 + catalogsData.length) % catalogsData.length);
  };

  const handleCatalogClick = (catalog: Catalog) => {
    console.log('Catalog clicked:', catalog.name);
    // Modal functionality has been removed
  };

  const currentCatalog = catalogsData[currentIndex];

  return (
    <section id="catalogs" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos Catálogos</h2>
          <div className="w-20 h-1 bg-furniture-yellow mx-auto mb-8"></div>
          <p className="max-w-2xl mx-auto text-gray-600">
            Navegue por nossos catálogos e veja como nossos móveis transformam espaços.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Arrows */}
          <Button
            onClick={prevCatalog}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 text-gray-800 hover:bg-white rounded-full p-3 shadow-lg border"
            size="icon"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            onClick={nextCatalog}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 text-gray-800 hover:bg-white rounded-full p-3 shadow-lg border"
            size="icon"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Catalog Card */}
          <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
            <div className="aspect-[16/9] w-full">
              <img
                src={currentCatalog.coverImage}
                alt={currentCatalog.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
            
            {/* Overlay content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 lg:p-8">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
                {currentCatalog.name}
              </h3>
              <p className="text-white/80 text-sm sm:text-base mb-4 line-clamp-2">
                {currentCatalog.description}
              </p>
              <div>
                <Button
                  onClick={() => handleCatalogClick(currentCatalog)}
                  className="bg-furniture-yellow hover:bg-furniture-yellow/90 text-black text-sm sm:text-base px-6 py-2"
                >
                  Ver Catálogo
                </Button>
              </div>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-6">
            {catalogsData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full mx-2 transition-colors ${
                  currentIndex === index ? 'bg-furniture-green' : 'bg-gray-300'
                }`}
                aria-label={`Ir para catálogo ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CatalogSection;
