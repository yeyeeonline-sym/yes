import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">关于我们</h1>
        <div className="w-24 h-1 bg-[#E3E4FF] mx-auto mt-4 rounded-full"></div>
      </header>
      
      <main className="prose max-w-none">
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">生命之轮项目介绍</h2>
          <p className="text-gray-700 mb-4">
            生命之轮是一个帮助人们平衡生活各方面的工具，通过评估生活中的不同维度，
            帮助用户了解自己的生活状态，发现需要改进的领域，从而实现更平衡、更有意义的生活。
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">如何生成HTML页面</h2>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-medium mb-3 text-gray-800">1. 单页应用构建</h3>
            <p className="text-gray-700 mb-3">
              本项目是单页应用(SPA)，运行以下命令构建项目：
            </p>
            <pre className="bg-gray-800 text-white p-4 rounded-lg mb-4">npm run build</pre>
            <p className="text-gray-700 mb-3">
              构建完成后，会在项目根目录生成dist文件夹，其中包含生成的HTML文件(index.html)及其他资源。
            </p>
            
            <h3 className="text-xl font-medium mb-3 text-gray-800">2. 添加新页面</h3>
            <p className="text-gray-700 mb-3">
              通过React Router添加新页面：
            </p>
            <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
              <li>创建新的页面组件(如About.tsx)</li>
              <li>在App.tsx中导入并添加路由</li>
              <li>访问对应路径即可查看新页面</li>
            </ol>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;