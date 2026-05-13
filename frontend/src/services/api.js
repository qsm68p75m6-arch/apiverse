import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证 token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// 获取 API 列表
export const getApis = async (params = {}) => {
  try {
    const response = await api.get('/apis', { params });
    return response;
  } catch (error) {
    console.error('获取 API 列表失败:', error);
    throw error;
  }
};

// 获取单个 API 详情
export const getApiById = async (id) => {
  try {
    const response = await api.get(`/apis/${id}`);
    return response;
  } catch (error) {
    console.error('获取 API 详情失败:', error);
    throw error;
  }
};

// 获取分类列表
export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response;
  } catch (error) {
    console.error('获取分类失败:', error);
    // 返回默认分类
    return [
      { name: 'AI', icon: '🤖', count: 156 },
      { name: '数据', icon: '📊', count: 234 },
      { name: '金融', icon: '💰', count: 89 },
      { name: '天气', icon: '🌤️', count: 45 },
      { name: '地图', icon: '🗺️', count: 67 },
      { name: '社交', icon: '💬', count: 123 },
      { name: '支付', icon: '💳', count: 78 },
      { name: '翻译', icon: '🌐', count: 34 },
    ];
  }
};

// 获取热门 API
export const getPopularApis = async () => {
  try {
    const response = await api.get('/apis', { params: { sort: 'popular', limit: 6 } });
    return response;
  } catch (error) {
    console.error('获取热门 API 失败:', error);
    // 返回模拟数据
    return [
      {
        id: 1,
        name: 'OpenAI API',
        description: '强大的人工智能 API，支持文本生成、图像生成、代码生成等多种功能',
        category: 'AI',
        auth: 'apiKey',
        https: true,
        cors: 'yes',
      },
      {
        id: 2,
        name: 'OpenWeatherMap',
        description: '全球天气数据 API，提供实时天气、预报、历史数据等',
        category: '天气',
        auth: 'apiKey',
        https: true,
        cors: 'yes',
      },
      {
        id: 3,
        name: 'Google Maps API',
        description: '地图服务 API，支持地理编码、路径规划、街景等功能',
        category: '地图',
        auth: 'apiKey',
        https: true,
        cors: 'yes',
      },
      {
        id: 4,
        name: 'Stripe API',
        description: '支付处理 API，支持在线支付、订阅管理、发票生成等',
        category: '支付',
        auth: 'bearer',
        https: true,
        cors: 'yes',
      },
      {
        id: 5,
        name: 'Twitter API',
        description: '社交媒体 API，支持推文发布、用户信息、趋势分析等',
        category: '社交',
        auth: 'oauth',
        https: true,
        cors: 'yes',
      },
      {
        id: 6,
        name: 'CoinGecko API',
        description: '加密货币数据 API，提供价格、市值、交易量等实时数据',
        category: '金融',
        auth: null,
        https: true,
        cors: 'yes',
      },
    ];
  }
};

// 搜索 API
export const searchApis = async (query, params = {}) => {
  try {
    const response = await api.get('/apis/search', {
      params: { q: query, ...params },
    });
    return response;
  } catch (error) {
    console.error('搜索 API 失败:', error);
    throw error;
  }
};

// 调用 API（用于调试工作台）
export const callApi = async (url, method = 'GET', headers = {}, body = null) => {
  try {
    const response = await axios({
      url,
      method,
      headers,
      data: body,
      timeout: 30000,
    });
    return {
      status: response.status,
      headers: response.headers,
      data: response.data,
    };
  } catch (error) {
    return {
      status: error.response?.status || 500,
      headers: error.response?.headers || {},
      data: error.response?.data || { error: error.message },
      error: true,
    };
  }
};

// 生成代码（AI 功能）
export const generateCode = async (apiId, language = 'javascript') => {
  try {
    const response = await api.post(`/apis/${apiId}/generate-code`, { language });
    return response;
  } catch (error) {
    console.error('生成代码失败:', error);
    throw error;
  }
};

export default api;