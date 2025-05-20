
import React, { useEffect, useState } from 'react';

const Manager = () => {
  const [manager, setManager] = useState<any>(null);

  // Load content from localStorage
  useEffect(() => {
    const storedContent = localStorage.getItem('moveis_oeste_content');
    if (storedContent) {
      const allContent = JSON.parse(storedContent);
      const managerItem = allContent.find((item: any) => item.section === 'manager');
      if (managerItem) {
        setManager(managerItem);
      }
    }
  }, []);

  if (!manager) {
    return null;
  }

  return (
    <section id="team" className="pt-8 pb-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Conheça Nossa Gerente</h2>
          <div className="w-20 h-1 bg-furniture-yellow mx-auto mb-8"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-50 rounded-xl overflow-hidden shadow-lg">
            <div className="w-full md:w-2/5 pt-6 md:pt-0 px-6 md:px-0">
              <img 
                src={manager.image} 
                alt="Gerente da Loja" 
                className="w-full h-64 md:h-full object-cover object-center rounded-lg md:rounded-none"
                style={{ 
                  objectPosition: manager.objectPosition || 'center',
                  transform: manager.scale ? `scale(${manager.scale})` : 'scale(1)'
                }}
              />
            </div>
            <div className="p-8 w-full md:w-3/5">
              <h3 className="text-2xl font-bold text-primary mb-2">{manager.title}</h3>
              <p className="text-gray-500 mb-4">Gerente da Loja</p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {manager.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Manager;
