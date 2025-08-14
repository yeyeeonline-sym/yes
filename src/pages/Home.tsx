import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { toast } from 'sonner';

// Define interface for Life Wheel Dimension
interface Dimension {
  id: string;
  name: string;
  description: string;
  rating: number;
  descriptions: string[];
}

// Default dimensions as specified in requirements
const DEFAULT_DIMENSIONS: Dimension[] = [
  { 
    id: '1', 
    name: '身体健康', 
    description: '指身体的健康状况，包括体能、营养、睡眠质量、疾病状况等方面', 
    rating: 5, 
    descriptions: ['', '', ''] 
  },
  { 
    id: '2', 
    name: '情绪健康', 
    description: '指情绪的稳定程度，包括压力管理能力、情绪调节能力、幸福感等方面', 
    rating: 5, 
    descriptions: ['', '', ''] 
  },
  { 
    id: '3', 
    name: '心智成长', 
    description: '指知识学习、技能提升和认知能力的发展，包括学习习惯、思维方式等', 
    rating: 5, 
    descriptions: ['', '', ''] 
  },
  { 
    id: '4', 
    name: '职业发展', 
    description: '指职业生涯的发展状况，包括工作满意度、职业规划、晋升空间等', 
    rating: 5, 
    descriptions: ['', '', ''] 
  },
  { 
    id: '5', 
    name: '财务状况', 
    description: '指个人财务的健康程度，包括收入水平、储蓄习惯、投资规划等', 
    rating: 5, 
    descriptions: ['', '', ''] 
  },
  { 
    id: '6', 
    name: '亲密关系', 
    description: '指与伴侣、家人之间的关系质量，包括沟通状况、情感支持等', 
    rating: 5, 
    descriptions: ['', '', ''] 
  },
  { 
    id: '7', 
    name: '社交友谊', 
    description: '指与朋友、同事等社会关系的状况，包括社交圈大小、人际关系质量等', 
    rating: 5, 
    descriptions: ['', '', ''] 
  },
  { 
    id: '8', 
    name: '精神价值', 
    description: '指个人的价值观、信仰和人生意义感，包括生活目标、理想追求等', 
    rating: 5, 
    descriptions: ['', '', ''] 
  },
];

// Generate unique ID for new dimensions
const generateId = () => Math.random().toString(36).substr(2, 9);

// Generate color array for chart visualization
const generateColors = (count: number) => {
  const baseColor = '#E3E4FF';
  return Array.from({ length: count }, (_, i) => {
    // Create variations of the base color
    const hue = ((i * 30) % 360).toString();
    return `hsl(${hue}, 70%, 90%)`;
  });
};

// Life quotes for inspiration
const LIFE_QUOTES = [
  "生命不是一场赛跑，而是一次旅行。重要的不是目的地，而是沿途的风景以及看风景的心情。",
  "人生苦短，我们应该珍惜每一个当下，活出真实的自己。",
  "生命的价值不在于活了多少天，而在于我们如何度过这些日子。",
  "昨天是历史，明天是谜团，而今天是礼物，这就是为什么它被称为'现在'。",
  "生命中最重要的不是你拥有多少，而是你如何珍惜你所拥有的。",
  "每一个不曾起舞的日子，都是对生命的辜负。",
  "生命的意义不在于长度，而在于深度和广度。",
  "我们无法增加生命的长度，但可以拓展它的宽度。"
];

// 维度相关性分析
const calculateDimensionCorrelations = (dimensions: Dimension[]) => {
  // 简单实现：计算每对维度之间的相关性
  const correlations: { [key: string]: { dimension: string, correlation: number }[] } = {};
  
  dimensions.forEach(dim1 => {
    correlations[dim1.id] = [];
    dimensions.forEach(dim2 => {
      if (dim1.id !== dim2.id) {
        // 生成-1到1之间的随机相关性值作为示例
        const correlation = (Math.random() - 0.5) * 2;
        correlations[dim1.id].push({
          dimension: dim2.name,
          correlation: parseFloat(correlation.toFixed(2))
        });
      }
    });
    // 按相关性排序
    correlations[dim1.id].sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  });
  
  return correlations;
};

// 获取年龄段比较基准
const getAgeBenchmark = (age: number) => {
  // 根据不同年龄段返回基准数据
  let benchmarks: { dimension: string, average: number }[] = [];
  
  if (age < 25) {
    benchmarks = [
      { dimension: '身体健康', average: 7.5 },
      { dimension: '情绪健康', average: 6.8 },
      { dimension: '心智成长', average: 7.2 },
      { dimension: '职业发展', average: 5.5 },
      { dimension: '财务状况', average: 4.8 },
      { dimension: '亲密关系', average: 6.2 },
      { dimension: '社交友谊', average: 7.0 },
      { dimension: '精神价值', average: 6.0 }
    ];
  } else if (age < 40) {
    benchmarks = [
      { dimension: '身体健康', average: 7.0 },
      { dimension: '情绪健康', average: 6.5 },
      { dimension: '心智成长', average: 7.5 },
      { dimension: '职业发展', average: 7.2 },
      { dimension: '财务状况', average: 6.5 },
      { dimension: '亲密关系', average: 7.0 },
      { dimension: '社交友谊', average: 6.5 },
      { dimension: '精神价值', average: 6.8 }
    ];
  } else if (age < 60) {
    benchmarks = [
      { dimension: '身体健康', average: 6.5 },
      { dimension: '情绪健康', average: 6.8 },
      { dimension: '心智成长', average: 7.0 },
      { dimension: '职业发展', average: 7.5 },
      { dimension: '财务状况', average: 7.2 },
      { dimension: '亲密关系', average: 7.5 },
      { dimension: '社交友谊', average: 6.0 },
      { dimension: '精神价值', average: 7.2 }
    ];
  } else {
    benchmarks = [
      { dimension: '身体健康', average: 6.0 },
      { dimension: '情绪健康', average: 7.0 },
      { dimension: '心智成长', average: 6.8 },
      { dimension: '职业发展', average: 6.5 },
      { dimension: '财务状况', average: 7.5 },
      { dimension: '亲密关系', average: 7.8 },
      { dimension: '社交友谊', average: 6.5 },
      { dimension: '精神价值', average: 7.5 }
    ];
  }
  
  return benchmarks;
};

// 获取改进资源推荐
const getImprovementResources = (dimensions: Dimension[]) => {
  // 为低分维度提供资源推荐
  const resources: { dimension: string, books: string[], courses: string[] }[] = [];
  
  dimensions.forEach(dim => {
    let books: string[] = [];
    let courses: string[] = [];
    
    switch(dim.name) {
      case "身体健康":
        books = ["《睡眠革命》", "《运动改造大脑》", "《中国居民膳食指南》"];
        courses = ["健康生活方式养成", "基础营养学", "居家健身训练"];
        break;
      case "情绪健康":
        books = ["《被讨厌的勇气》", "《非暴力沟通》", "《当下的力量》"];
        courses = ["情绪管理入门", "正念冥想实践", "压力缓解技巧"];
        break;
      case "心智成长":
        books = ["《终身成长》", "《思考，快与慢》", "《刻意练习》"];
        courses = ["批判性思维训练", "学习方法与效率提升", "创意思维培养"];
        break;
      case "职业发展":
        books = ["《原则》", "《高效能人士的七个习惯》", "《深度工作》"];
        courses = ["职业规划与发展", "领导力提升", "时间管理技巧"];
        break;
      case "财务状况":
        books = ["《小狗钱钱》", "《富爸爸穷爸爸》", "《投资学基础》"];
        courses = ["个人理财入门", "投资基础", "消费习惯优化"];
        break;
      case "亲密关系":
        books = ["《爱的五种语言》", "《亲密关系》", "《幸福的婚姻》"];
        courses = ["沟通技巧训练", "冲突解决方法", "亲密关系建立"];
        break;
      case "社交友谊":
        books = ["《人性的弱点》", "《如何赢得朋友及影响他人》", "《社交天性》"];
        courses = ["社交技巧提升", "人脉管理", "有效沟通"];
        break;
      case "精神价值":
        books = ["《活出生命的意义》", "《少有人走的路》", "《沉思录》"];
        courses = ["价值观探索", "生命意义思考", "冥想与反思实践"];
        break;
      default:
        books = ["《终身学习》", "《自我发现之旅》"];
        courses = ["个人成长基础", "目标设定与实现"];
    }
    
    resources.push({
      dimension: dim.name,
      books,
      courses
    });
  });
  
  return resources;
};

// Action plans based on dimension ratings
const generateActionPlans = (dimensions: Dimension[]) => {
  return dimensions.map(dimension => {
    let plan = "";
    
    if (dimension.rating <= 4) {
      switch(dimension.name) {
        case "身体健康":
          plan = "1. 每周至少进行150分钟中等强度有氧运动\n2. 保证每晚7-8小时的优质睡眠\n3. 改善饮食习惯，增加蔬果摄入\n4. 定期进行体检";
          break;
        case "情绪健康":
          plan = "1. 每天进行10分钟的冥想或深呼吸练习\n2. 培养至少一项兴趣爱好\n3. 建立情绪日记，记录情绪变化\n4. 必要时寻求专业心理咨询";
          break;
        case "心智成长":
          plan = "1. 每月阅读一本新书\n2. 学习一项新技能或语言\n3. 尝试每天写学习笔记\n4. 参与线上或线下课程";
          break;
        case "职业发展":
          plan = "1. 制定3-5年职业规划\n2. 提升核心工作技能\n3. 拓展职业人脉网络\n4. 寻求导师指导或职业咨询";
          break;
        case "财务状况":
          plan = "1. 制定月度预算并严格执行\n2. 建立应急基金\n3. 学习基础理财知识\n4. 制定储蓄和投资计划";
          break;
        case "亲密关系":
          plan = "1. 每周安排一次高质量陪伴时间\n2. 改善沟通方式，学习积极倾听\n3. 表达感谢和赞赏\n4. 共同参与新活动或旅行";
          break;
        case "社交友谊":
          plan = "1. 每月至少参加一次社交活动\n2. 主动联系久未见面的朋友\n3. 加入兴趣小组或社区组织\n4. 学习有效的社交技巧";
          break;
        case "精神价值":
          plan = "1. 探索并明确个人价值观\n2. 建立每日反思习惯\n3. 参与志愿服务或公益活动\n4. 寻找生活的意义和目标";
          break;
        default:
          plan = "1. 深入分析该领域低分原因\n2. 设定具体可实现的改进目标\n3. 寻找相关资源和支持\n4. 制定行动计划并定期评估进展";
      }
    }
    
    return {
      dimension: dimension.name,
      plan,
      quote: `生命中最美好的事物，往往是在我们付出努力后才会出现。专注于提升${dimension.name}，你会看到积极的改变。`
    };
  }).filter(plan => plan.plan);
};

export default function LifeWheelAssessment() {
  const [dimensions, setDimensions] = useState<Dimension[]>(DEFAULT_DIMENSIONS);
  const [newDimensionName, setNewDimensionName] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [expectedLifespan, setExpectedLifespan] = useState('80');
  const [remainingTime, setRemainingTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [lifeQuote, setLifeQuote] = useState("");
  const colors = generateColors(dimensions.length);
  const timerRef = useRef<number | null>(null);

  // Generate random life quote
  useEffect(() => {
    const randomQuote = LIFE_QUOTES[Math.floor(Math.random() * LIFE_QUOTES.length)];
    setLifeQuote(randomQuote);
  }, []);

  // Update rating for a dimension
  const handleRatingChange = (id: string, value: number) => {
    setDimensions(prev => 
      prev.map(dim => dim.id === id ? { ...dim, rating: value } : dim)
    );
  };

  // Update description for a dimension
  const handleDescriptionChange = (id: string, index: number, value: string) => {
    setDimensions(prev => 
      prev.map(dim => {
        if (dim.id === id) {
          const newDescriptions = [...dim.descriptions];
          newDescriptions[index] = value;
          return { ...dim, descriptions: newDescriptions };
        }
        return dim;
      })
    );
  };

  // Add new custom dimension
  const addDimension = () => {
    if (!newDimensionName.trim()) {
      toast.error('请输入维度名称');
      return;
    }
    
    if (dimensions.some(dim => dim.name === newDimensionName.trim())) {
      toast.error('该维度已存在');
      return;
    }
    
    const newDimension: Dimension = {
      id: generateId(),
      name: newDimensionName.trim(),
      rating: 5,
      descriptions: ['', '', ''],
      description: ''
    };
    
    setDimensions(prev => [...prev, newDimension]);
    setNewDimensionName('');
    toast.success(`已添加新维度: ${newDimensionName.trim()}`);
  };

  // Remove a dimension
  const removeDimension = (id: string) => {
    const dimensionToRemove = dimensions.find(dim => dim.id === id);
    if (!dimensionToRemove) return;
    
    // Don't allow removal of last dimension
    if (dimensions.length <= 1) {
      toast.error('至少保留一个维度');
      return;
    }
    
    setDimensions(prev => prev.filter(dim => dim.id !== id));
    toast.success(`已移除维度: ${dimensionToRemove.name}`);
  };

  // Calculate remaining life time
  const calculateRemainingTime = (currentAge: number, expectedAge: number) => {
    const remainingYears = expectedAge - currentAge;
    const totalSeconds = remainingYears * 365 * 24 * 60 * 60;
    
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    
    return { days, hours, minutes, seconds };
  };

  // Update countdown timer
  const updateCountdown = () => {
    if (!age || !expectedLifespan || parseInt(age) >= parseInt(expectedLifespan)) return;
    
    const now = new Date();
    const birthYear = now.getFullYear() - parseInt(age);
    const birthDate = new Date(birthYear, now.getMonth(), now.getDate());
    const expectedDeathDate = new Date(birthYear + parseInt(expectedLifespan), now.getMonth(), now.getDate());
    
    const diffTime = expectedDeathDate.getTime() - now.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);
    
    setRemainingTime({
      days: diffDays,
      hours: diffHours,
      minutes: diffMinutes,
      seconds: diffSeconds
    });
  };

  // Generate assessment report
  const generateReport = () => {
    // Validate personal information
    if (!name || !age || !expectedLifespan) {
      toast.error('请填写完整的个人信息');
      return;
    }
    
    if (parseInt(age) >= parseInt(expectedLifespan)) {
      toast.error('年龄不能大于或等于预期寿命');
      return;
    }
    
    const hasEmptyDescriptions = dimensions.some(dim => 
      dim.descriptions.some(desc => !desc.trim())
    );
    
    if (hasEmptyDescriptions) {
      toast.warning('部分描述尚未填写，仍要生成报告吗？');
    }
    
    // Start countdown timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    updateCountdown();
    timerRef.current = setInterval(updateCountdown, 1000);
    
    const timestamp = new Date();
    const formattedDate = timestamp.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Calculate average rating
    const averageRating = dimensions.reduce((sum, dim) => sum + dim.rating, 0) / dimensions.length;
    
    // Determine life balance level
    let balanceLevel = '';
    if (averageRating >= 8) balanceLevel = '优秀';
    else if (averageRating >= 6) balanceLevel = '良好';
    else if (averageRating >= 4) balanceLevel = '一般';
    else balanceLevel = '需要改善';
    
    // Generate action plans
    const actionPlans = generateActionPlans(dimensions);
    
    // Create report data
    const newReportData = {
      timestamp,
      formattedDate,
      averageRating: averageRating.toFixed(1),
      balanceLevel,
      dimensions: [...dimensions],
      strengths: dimensions
        .filter(dim => dim.rating >= 8)
        .map(dim => dim.name),
      areasForImprovement: dimensions
        .filter(dim => dim.rating <= 4)
        .map(dim => dim.name),
      personalInfo: {
        name,
        age: parseInt(age),
        expectedLifespan: parseInt(expectedLifespan)
      },
       actionPlans,
       // 新增：维度相关性分析
       correlations: calculateDimensionCorrelations(dimensions),
       // 新增：年龄段比较基准
       ageBenchmark: getAgeBenchmark(parseInt(age)),
       // 新增：改进资源推荐
       improvementResources: getImprovementResources(dimensions.filter(d => d.rating <= 4)),
       lifeQuote: LIFE_QUOTES[Math.floor(Math.random() * LIFE_QUOTES.length)]
    };
    
    setReportData(newReportData);
    setReportGenerated(true);
    setShowReport(true);
    
    // Save report to local storage
    const savedReports = JSON.parse(localStorage.getItem('lifeWheelReports') || '[]');
    savedReports.push(newReportData);
    localStorage.setItem('lifeWheelReports', JSON.stringify(savedReports));
    
    toast.success('分析报告已生成');
  };

  // Clean up timer when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Share to WeChat with image and text
  const shareToWeChat = () => {
    if (!reportData) return;
    
    // Generate report summary for sharing
    const reportSummary = `我的生命之轮评估报告 (${reportData.formattedDate}):
平均评分: ${reportData.averageRating}
平衡等级: ${reportData.balanceLevel}

优势领域: ${reportData.strengths.length > 0 ? reportData.strengths.join(', ') : '无'}
需要提升: ${reportData.areasForImprovement.length > 0 ? reportData.areasForImprovement.join(', ') : '无'}

${reportData.lifeQuote}

点击查看完整报告和分析建议`;
    
    navigator.clipboard.writeText(reportSummary)
      .then(() => {
        toast.success('报告摘要已复制到剪贴板，可粘贴到微信发送');
      })
      .catch(err => {
        toast.error('复制失败，请手动复制报告内容');
      });
  };

  // Back to top functionality
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Download report as JSON
  const downloadReport = () => {
    if (!reportData) return;
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `生命之轮评估报告_${reportData.formattedDate.replace(/\s+/g, '_').replace(/:/g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Submit assessment and show report option
  const handleSubmit = () => {
    setShowReport(true);
  };

  // Reset assessment
  const resetAssessment = () => {
    setDimensions([...DEFAULT_DIMENSIONS]);
    setShowReport(false);
    setReportGenerated(false);
    setReportData(null);
    setName('');
    setAge('');
    setExpectedLifespan('80');
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">生命之轮</h1>
        <p className="text-xl text-gray-600">平衡你的生活</p>
        <div className="w-24 h-1 bg-[#E3E4FF] mx-auto mt-4 rounded-full"></div>
      </header>

      {/* Personal Information Section */}
      <section className="bg-white rounded-2xl border border-[#E3E4FF] p-6 shadow-sm mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">个人信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="name">姓名</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入您的姓名"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3E4FF] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="age">年龄</label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="请输入您的年龄"
              min="0"
              max="120"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3E4FF] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="expectedLifespan">期待寿命</label>
            <input
              type="number"
              id="expectedLifespan"
              value={expectedLifespan}
              onChange={(e) => setExpectedLifespan(e.target.value)}
              placeholder="请输入您的期待寿命"
              min="0"
              max="120"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3E4FF] focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700 italic text-center">{lifeQuote}</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="space-y-12">
        {/* Introduction */}
        <section className="bg-[#E3E4FF] bg-opacity-50 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">关于生命之轮</h2>
          <p className="text-gray-700 mb-4">
            生命之轮是一个帮助你评估生活各方面平衡状况的工具。通过对不同生活维度进行评分和描述，
            你可以清晰地看到自己生活的优势和需要改进的领域，从而实现更平衡、更有意义的生活。
          </p>
        </section>

        {/* Dimension Management */}
        <section className="bg-white rounded-2xl border border-[#E3E4FF] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">生活维度</h2>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newDimensionName}
                onChange={(e) => setNewDimensionName(e.target.value)}
                placeholder="添加自定义维度"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3E4FF] focus:border-transparent"
              />
              <button
                onClick={addDimension}
                className="bg-[#E3E4FF] hover:bg-[#d0d2ff] text-gray-800 font-medium px-4 py-2 rounded-lg transition-colors"
              >
                添加
              </button>
            </div>
          </div>

          {/* Dimensions List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dimensions.map((dimension) => (
              <div 
                key={dimension.id}
                className="bg-white border border-[#E3E4FF] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative"
              >
                <button
                  onClick={() => removeDimension(dimension.id)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="删除维度"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
                
                 <div className="mb-4">
                   <div className="flex items-center">
                     <h3 className="text-xl font-medium text-gray-800">{dimension.name}</h3>
                     <button 
                       className="ml-2 text-gray-400 hover:text-gray-600"
                       onClick={(e) => {
                         e.stopPropagation();
                         toast.info(dimension.description);
                       }}
                     >
                       <i className="fa-solid fa-info-circle"></i>
                     </button>
                   </div>
                   <p className="text-sm text-gray-500 mt-1">{dimension.description}</p>
                 </div>{/* Rating Slider */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>1分 - 不满意</span>
                    <span className="font-medium">{dimension.rating}分</span>
                    <span>10分 - 非常满意</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={dimension.rating}
                    onChange={(e) => handleRatingChange(dimension.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E3E4FF]"
                  />
                </div>
                
                {/* Description Inputs */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">描述 (最多3点):</p>
                  {dimension.descriptions.map((desc, descIndex) => (
                    <input
                      key={descIndex}
                      type="text"
                      value={desc}
                      onChange={(e) => handleDescriptionChange(dimension.id, descIndex, e.target.value)}
                      placeholder={`描述 ${descIndex + 1}`}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3E4FF] focus:border-transparent"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Submit Section */}
        <section className="text-center">
          <button
            onClick={handleSubmit}
            className="bg-[#E3E4FF] hover:bg-[#d0d2ff] text-gray-800 font-semibold px-8 py-3 rounded-lg text-lg transition-colors shadow-md hover:shadow-lg"
          >
            提交评估
          </button>
        </section>

        {/* Report Section */}
        {showReport && (
          <section className="bg-white rounded-2xl border border-[#E3E4FF] p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              {reportGenerated ? '生命之轮分析报告' : '生成分析报告'}
            </h2>
            
            {!reportGenerated ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-8">您的评估已提交，点击下方按钮生成详细分析报告</p>
                <button
                  onClick={generateReport}
                  className="bg-[#E3E4FF] hover:bg-[#d0d2ff] text-gray-800 font-semibold px-8 py-3 rounded-lg text-lg transition-colors shadow-md hover:shadow-lg"
                >
                  生成分析报告
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Life Expectancy Visualization */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">生命长度可视化</h3>
                  
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">出生</span>
                      <span className="text-gray-700 font-medium">{reportData.personalInfo.name}，{reportData.personalInfo.age}岁</span>
                      <span className="text-gray-700 font-medium">预期寿命: {reportData.personalInfo.expectedLifespan}岁</span>
                    </div>
                    
                    {/* Life bar visualization */}
                    <div className="relative h-12 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-[#E3E4FF]"
                        style={{ width: '100%' }}
                      ></div>
                      
                      <div 
                        className="absolute top-0 left-0 h-full bg-red-500 transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${(reportData.personalInfo.age / reportData.personalInfo.expectedLifespan) * 100}%`,
                          boxShadow: '2px 0 4px rgba(0,0,0,0.3)'
                        }}
                      ></div>
                      
                      <div 
                        className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2"
                        style={{ left: `${(reportData.personalInfo.age / reportData.personalInfo.expectedLifespan) * 100}%` }}
                      >
                        <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-md"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Remaining time counter */}
                  <div className="text-center">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">
                      {reportData.personalInfo.name}的生命还剩:
                    </h4>
                    <div className="grid grid-cols-4 gap-4 mb-6">
                       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-[150%]">
                         <div className="text-3xl font-bold text-gray-800">{remainingTime.days}</div>
                         <div className="text-sm text-gray-600">天</div>
                       </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="text-3xl font-bold text-gray-800">{remainingTime.hours}</div>
                        <div className="text-sm text-gray-600">时</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="text-3xl font-bold text-gray-800">{remainingTime.minutes}</div>
                        <div className="text-sm text-gray-600">分</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="text-3xl font-bold text-gray-800">{remainingTime.seconds}</div>
                        <div className="text-sm text-gray-600">秒</div>
                      </div>
                    </div>
                    
                    <div className="bg-[#E3E4FF] bg-opacity-30 p-4 rounded-lg">
                      <p className="text-lg text-gray-800 italic">{reportData.lifeQuote}</p>
                    </div>
                  </div>
                </div>

                {/* Report Header */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                  <div>
                    <p className="text-gray-600">评估日期: {reportData.formattedDate}</p>
                    <p className="text-gray-600">平均评分: {reportData.averageRating}</p>
                    <p className="text-gray-600">生活平衡等级: <span className="font-semibold">{reportData.balanceLevel}</span></p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={downloadReport}
                      className="flex items-center text-gray-700 hover:text-[#E3E4FF] transition-colors"
                      aria-label="下载报告"
                    >
                      <i className="fa-solid fa-download mr-1"></i> 保存报告
                    </button>
                    <button
                      onClick={shareToWeChat}
                      className="flex items-center text-gray-700 hover:text-[#E3E4FF] transition-colors"
                      aria-label="分享到微信"
                    >
                      <i className="fa-brands fa-weixin mr-1"></i> 分享
                    </button>
                  </div>
                </div>

                {/* Visualization Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-50 p-4 rounded-xl h-80">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">生命之轮雷达图</h3>
                    <ResponsiveContainer width="100%" height="85%">
                     <RadarChart cx="50%" cy="50%" outerRadius="80%" data={reportData.dimensions}>
                       <PolarGrid stroke="#e0e0e0" />
                       <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
                       <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fontSize: 10 }} />
                       <Radar
                         name="当前评分"
                         dataKey="rating"
                         stroke="#E3E4FF"
                         fill="#E3E4FF"
                         fillOpacity={0.6}
                         animationDuration={1500}
                         animationEasing="ease-in-out"
                       />
                       <Legend verticalAlign="bottom" height={36} />
                     </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl h-80">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">生活平衡饼图</h3>
                    <ResponsiveContainer width="100%" height="85%">
                     <PieChart>
                       <Pie
                         data={reportData.dimensions}
                         cx="50%"
                         cy="50%"
                         innerRadius={60}
                         outerRadius={80}
                         paddingAngle={2}
                         dataKey="rating"
                         label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                         labelLine={false}
                         animationDuration={1500}
                         animationEasing="ease-in-out"
                       >
                         {reportData.dimensions.map((entry, index) => (
                           <Cell 
                             key={`cell-${index}`} 
                             fill={`hsl(${(index * 45) % 360}, 70%, 90%)`} 
                             animationDuration={1500}
                           />
                         ))}
                       </Pie>
                       <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12 }} />
                     </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Key Insights */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">优势领域</h3>
                    {reportData.strengths.length > 0 ? (
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {reportData.strengths.map((strength: string, index: number) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">未识别到明显优势领域，各维度发展较为均衡</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">需要提升的领域</h3>
                    {reportData.areasForImprovement.length > 0 ? (
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {reportData.areasForImprovement.map((area: string, index: number) => (
                          <li key={index}>{area}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">所有领域发展良好，继续保持当前状态</p>
                    )}
                  </div>
                </div>

                {/* Action Plans */}
                {reportData.actionPlans.length > 0 && (
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">个性化行动计划</h3>
                    <div className="space-y-6">
                      {reportData.actionPlans.map((plan: any, index: number) => (
                        <div key={index} className="bg-white p-5 rounded-lg border border-[#E3E4FF]">
                          <h4 className="text-lg font-medium text-gray-800 mb-3">{plan.dimension}</h4>
                          <pre className="text-sm text-gray-700 whitespace-pre-line mb-3">{plan.plan}</pre>
                          <p className="text-gray-600 italic text-sm">{plan.quote}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dimension Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">各维度详情</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportData.dimensions.map((dim: Dimension) => (
                      <div key={dim.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-800">{dim.name}</h4>
                          <span className="bg-[#E3E4FF] text-gray-800 text-xs px-2 py-1 rounded-full">
                            {dim.rating}分
                          </span>
                        </div>
                        {dim.descriptions.some(d => d.trim()) ? (
                          <ul className="text-sm text-gray-700 space-y-1">
                            {dim.descriptions
                              .filter(d => d.trim())
                              .map((desc, descIndex) => (
                                <li key={descIndex} className="flex items-start">
                                  <i className="fa-solid fa-circle text-xs mt-1.5 mr-2 text-[#E3E4FF]"></i>
                                  <span>{desc}</span>
                                </li>
                              ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-400 italic">无描述信息</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 bg-[#E3E4FF] hover:bg-[#d0d2ff] text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="回到顶部"
        title="回到顶部"
      >
        <i className="fa-solid fa-arrow-up"></i>
      </button>

      {/* Page Footer */}
       <footer className="mt-16 text-center">
         <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
           <button
             onClick={scrollToTop}
             className="bg-[#E3E4FF] hover:bg-[#d0d2ff] text-gray-800 font-semibold px-8 py-3 rounded-lg text-lg transition-colors shadow-md hover:shadow-lg"
           >
             回到顶部
           </button>
           <button
             onClick={() => {
               toast.info('正在准备一键发布...', { duration: 2000 });
               setTimeout(() => {
                 window.open('https://vercel.com/new', '_blank');
               }, 2000);
             }}
             className="bg-[#E3E4FF] hover:bg-[#d0d2ff] text-gray-800 font-semibold px-8 py-3 rounded-lg text-lg transition-colors shadow-md hover:shadow-lg"
           >
             一键发布网页
           </button>
         </div>
         <p className="text-gray-500 text-sm mt-4">
           生命之轮评估 &copy; {new Date().getFullYear()} - 帮助你平衡生活的各个方面
         </p>
      </footer>
   </div>
  );
}