import { Experience, Project } from './types';

export const NAV_ITEMS = [
  { label: '首页', href: '#home' },
  { label: '关于我', href: '#about' },
  { label: '求学经历', href: '#education' },
  { label: '竞赛与荣誉', href: '#awards' },
  { label: '科研与项目', href: '#projects' },
];

export const EDUCATION: Experience[] = [
  {
    id: 'edu1',
    title: '计算机科学与技术 (保送研究生)',
    institution: '顶尖知名大学',
    date: '2024 - 至今',
    description: '即将攻读硕士学位，主攻人工智能与机器学习方向。',
    tags: ['Machine Learning', 'Computer Vision', 'NLP']
  },
  {
    id: 'edu2',
    title: '计算机科学与技术 (学士)',
    institution: '知名大学',
    date: '2020 - 2024',
    description: 'GPA: 3.9/4.0 (专业前 1%)，连续三年获得国家奖学金。',
    tags: ['Data Structures', 'Algorithms', 'OS', 'Networks']
  }
];

export const AWARDS: Experience[] = [
  {
    id: 'award1',
    title: 'ICPC 国际大学生程序设计竞赛',
    institution: '亚洲区域赛',
    date: '2023',
    description: '获得金牌 (Rank 5)。负责团队核心算法设计与动态规划题目攻克。',
    tags: ['C++', 'Algorithms', 'Teamwork']
  },
  {
    id: 'award2',
    title: 'Kaggle 全球数据科学竞赛',
    institution: 'Kaggle',
    date: '2022',
    description: 'Feedback Prize - Predicting Effective Arguments 银牌。使用 BERT 变体模型进行文本分类。',
    tags: ['Python', 'PyTorch', 'Transformers']
  },
  {
    id: 'award3',
    title: '美国大学生数学建模竞赛 (MCM/ICM)',
    institution: 'COMAP',
    date: '2022',
    description: '获得 Finalist 奖项。负责数学模型构建与论文撰写。',
    tags: ['Matlab', 'Latex', 'Modeling']
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'proj1',
    title: '基于多模态大模型的医疗诊断辅助系统',
    category: 'Research',
    description: '提出了一种新的跨模态注意力机制，融合医学影像与电子病历文本，显著提升了诊断准确率。成果已投稿至 CVPR。',
    techStack: ['PyTorch', 'Multimodal Learning', 'React', 'FastAPI'],
    image: 'https://picsum.photos/600/400?random=1'
  },
  {
    id: 'proj2',
    title: '分布式高性能深度学习训练框架',
    category: 'Innovation',
    description: '设计并实现了一个轻量级分布式训练系统，优化了通信开销，在 8 节点集群上实现 90% 的线性加速比。',
    techStack: ['C++', 'CUDA', 'MPI', 'System Design'],
    image: 'https://picsum.photos/600/400?random=2'
  },
  {
    id: 'proj3',
    title: 'CampusLife - 智慧校园助手',
    category: 'Innovation',
    description: '集成课程表、校园导航、活动发布于一体的小程序，日活用户突破 5000+。',
    techStack: ['Flutter', 'Spring Boot', 'MySQL'],
    image: 'https://picsum.photos/600/400?random=3'
  }
];