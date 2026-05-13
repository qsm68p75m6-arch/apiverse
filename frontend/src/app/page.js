'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import CategoryTags from '@/components/CategoryTags';
import ApiCard from '@/components/ApiCard';
import { getPopularApis, getCategories } from '@/services/api';

export default function HomePage() {
  const [popularApis, setPopularApis] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [apis, cats] = await Promise.all([
          getPopularApis(),
          getCategories(),
        ]);
        setPopularApis(apis);
        setCategories(cats);
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero 区域 */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-40 left-40 w-80 h-80 bg-accent-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
              APIVerse
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              探索无限 API 宇宙
            </p>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
              发现、测试和集成最优质的 API，构建强大的应用程序。
              从数千个 API 中找到最适合你项目的工具。
            </p>
          </div>

          {/* 搜索框 */}
          <div className="animate-slide-up max-w-2xl mx-auto mb-16">
            <SearchBar />
          </div>

          {/* 分类标签 */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CategoryTags categories={categories} />
          </div>
        </div>
      </section>

      {/* 热门 API 区域 */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">🔥 热门 API</h2>
              <p className="text-gray-400">探索最受欢迎的 API</p>
            </div>
            <Link
              href="/apis"
              className="text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-2"
            >
              查看全部
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-4" />
                  <div className="h-3 bg-gray-700 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-700 rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularApis.map((api, index) => (
                <div
                  key={api.id || index}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ApiCard api={api} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 特性介绍 */}
      <section className="py-16 px-4 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">为什么选择 APIVerse？</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-500/20 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">智能搜索</h3>
              <p className="text-gray-400">快速找到你需要的 API，支持关键词、分类、标签多维度筛选</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary-500/20 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">🧪</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">在线测试</h3>
              <p className="text-gray-400">内置 API 调试工作台，无需离开浏览器即可测试 API</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent-500/20 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI 代码生成</h3>
              <p className="text-gray-400">AI 自动生成 API 调用代码，支持多种编程语言</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}