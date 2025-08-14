import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">联系我们</h1>
        <div className="w-24 h-1 bg-[#E3E4FF] mx-auto mt-4 rounded-full"></div>
      </header>
      
      <main className="max-w-2xl mx-auto">
        <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">联系方式</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-[#E3E4FF] p-3 rounded-full mr-4">
                <i className="fa-solid fa-envelope text-gray-800"></i>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">电子邮箱</h3>
                <p className="text-gray-700">contact@lifewheelapp.com</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-[#E3E4FF] p-3 rounded-full mr-4">
                <i className="fa-solid fa-phone text-gray-800"></i>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">电话</h3>
                <p className="text-gray-700">+86 123 4567 8910</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-[#E3E4FF] p-3 rounded-full mr-4">
                <i className="fa-solid fa-map-marker-alt text-gray-800"></i>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">地址</h3>
                <p className="text-gray-700">北京市朝阳区创意园区A座1001室</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;