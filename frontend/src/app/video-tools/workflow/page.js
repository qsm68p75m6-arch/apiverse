'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';

// 简化版节点编辑器（不依赖React Flow）
const initialNodes = [
  { id: '1', type: 'input', x: 50, y: 200, label: '📝 剧本输入', description: '输入故事剧本或文字描述', status: 'ready' },
  { id: '2', x: 250, y: 200, label: '🎭 分镜拆解', description: 'AI自动拆解分镜脚本', status: 'idle' },
  { id: '3', x: 450, y: 120, label: '🖼️ 画面生成', description: '生成每个分镜的画面', status: 'idle' },
  { id: '4', x: 450, y: 280, label: '🎵 音频生成', description: '生成配音和背景音乐', status: 'idle' },
  { id: '5', x: 650, y: 200, label: '🎬 视频合成', description: '将画面和音频合成视频', status: 'idle' },
  { id: '6', type: 'output', x: 850, y: 200, label: '📦 导出视频', description: '导出最终视频文件', status: 'idle' },
];

const initialEdges = [
  { from: '1', to: '2' },
  { from: '2', to: '3' },
  { from: '2', to: '4' },
  { from: '3', to: '5' },
  { from: '4', to: '5' },
  { from: '5', to: '6' },
];

// 可用节点库
const nodeLibrary = [
  { type: 'input', label: '📝 文本输入', category: '输入', description: '输入文本内容' },
  { type: 'input', label: '🖼️ 图片输入', category: '输入', description: '上传图片素材' },
  { type: 'input', label: '🎵 音频输入', category: '输入', description: '上传音频文件' },
  { type: 'process', label: '🤖 AI剧本生成', category: 'AI处理', description: '使用AI生成剧本' },
  { type: 'process', label: '🎭 角色设计', category: 'AI处理', description: 'AI设计角色形象' },
  { type: 'process', label: '🎨 风格转换', category: 'AI处理', description: '转换画面风格' },
  { type: 'process', label: '✨ 动画生成', category: 'AI处理', description: '生成动画效果' },
  { type: 'process', label: '🗣️ 语音合成', category: '音频', description: '文字转语音' },
  { type: 'process', label: '🎵 音乐生成', category: '音频', description: 'AI生成背景音乐' },
  { type: 'output', label: '📦 视频导出', category: '输出', description: '导出视频文件' },
  { type: 'output', label: '🖼️ 图片导出', category: '输出', description: '导出图片序列' },
];

export default function WorkflowEditor() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [showLibrary, setShowLibrary] = useState(true);

  // 添加节点
  const addNode = useCallback((nodeType) => {
    const newNode = {
      id: `node-${Date.now()}`,
      x: 300 + Math.random() * 200,
      y: 150 + Math.random() * 200,
      label: nodeType.label,
      description: nodeType.description,
      type: nodeType.type,
      status: 'idle'
    };
    setNodes(prev => [...prev, newNode]);
    addLog(`添加节点: ${nodeType.label}`);
  }, []);

  // 删除节点
  const deleteNode = useCallback((nodeId) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setEdges(prev => prev.filter(e => e.from !== nodeId && e.to !== nodeId));
    setSelectedNode(null);
    addLog(`删除节点: ${nodeId}`);
  }, []);

  // 添加日志
  const addLog = (message) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-50), { time, message }]);
  };

  // 模拟运行工作流
  const runWorkflow = async () => {
    setIsRunning(true);
    setLogs([]);
    addLog('🚀 开始执行工作流...');

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      setNodes(prev => prev.map(n => 
        n.id === node.id ? { ...n, status: 'running' } : n
      ));
      addLog(`⏳ 正在处理: ${node.label}`);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setNodes(prev => prev.map(n => 
        n.id === node.id ? { ...n, status: 'completed' } : n
      ));
      addLog(`✅ 完成: ${node.label}`);
    }

    addLog('🎉 工作流执行完成！');
    setIsRunning(false);
  };

  // 重置工作流
  const resetWorkflow = () => {
    setNodes(prev => prev.map(n => ({ ...n, status: 'idle' })));
    setLogs([]);
    addLog('🔄 工作流已重置');
  };

  // 获取节点颜色
  const getNodeColor = (status) => {
    switch (status) {
      case 'running': return 'border-yellow-500 bg-yellow-900/30';
      case 'completed': return 'border-green-500 bg-green-900/30';
      case 'error': return 'border-red-500 bg-red-900/30';
      default: return 'border-gray-600 bg-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 顶部工具栏 */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/video-tools" className="text-gray-400 hover:text-white">
              ← 返回
            </Link>
            <h1 className="text-lg font-semibold">AI视频工作流编辑器</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetWorkflow}
              disabled={isRunning}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm disabled:opacity-50"
            >
              🔄 重置
            </button>
            <button
              onClick={runWorkflow}
              disabled={isRunning}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm disabled:opacity-50"
            >
              {isRunning ? '⏳ 运行中...' : '▶️ 运行工作流'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-57px)]">
        {/* 左侧节点库 */}
        {showLibrary && (
          <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">节点库</h2>
              <button
                onClick={() => setShowLibrary(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            {['输入', 'AI处理', '音频', '输出'].map(category => (
              <div key={category} className="mb-4">
                <h3 className="text-xs text-gray-400 uppercase mb-2">{category}</h3>
                <div className="space-y-2">
                  {nodeLibrary
                    .filter(n => n.category === category)
                    .map((node, idx) => (
                      <button
                        key={idx}
                        onClick={() => addNode(node)}
                        className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                      >
                        {node.label}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 中间画布区域 */}
        <div className="flex-1 relative overflow-auto bg-gray-900 p-8">
          {!showLibrary && (
            <button
              onClick={() => setShowLibrary(true)}
              className="absolute top-4 left-4 px-3 py-1 bg-gray-700 rounded-lg text-sm"
            >
              ☰ 节点库
            </button>
          )}

          {/* 网格背景 */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #374151 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />

          {/* 节点和连线 */}
          <div className="relative" style={{ minWidth: '1000px', minHeight: '500px' }}>
            {/* 连线 */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {edges.map((edge, idx) => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                
                const fromX = fromNode.x + 100;
                const fromY = fromNode.y + 30;
                const toX = toNode.x;
                const toY = toNode.y + 30;
                
                return (
                  <path
                    key={idx}
                    d={`M${fromX},${fromY} C${fromX + 50},${fromY} ${toX - 50},${toY} ${toX},${toY}`}
                    stroke="#4B5563"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                  />
                );
              })}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
                </marker>
              </defs>
            </svg>

            {/* 节点 */}
            {nodes.map(node => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`absolute cursor-pointer transition-all duration-300 ${getNodeColor(node.status)} ${
                  selectedNode?.id === node.id ? 'ring-2 ring-primary-500' : ''
                }`}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: '200px'
                }}
              >
                <div className="px-4 py-3 rounded-lg border">
                  <div className="font-medium text-sm">{node.label}</div>
                  <div className="text-xs text-gray-400 mt-1">{node.description}</div>
                  {node.status === 'running' && (
                    <div className="mt-2">
                      <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧属性面板 */}
        <div className="w-72 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
          <h2 className="font-semibold mb-4">属性面板</h2>
          
          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400">节点名称</label>
                <div className="mt-1 p-2 bg-gray-700 rounded text-sm">{selectedNode.label}</div>
              </div>
              <div>
                <label className="text-xs text-gray-400">描述</label>
                <div className="mt-1 p-2 bg-gray-700 rounded text-sm">{selectedNode.description}</div>
              </div>
              <div>
                <label className="text-xs text-gray-400">状态</label>
                <div className="mt-1">
                  <span className={`px-2 py-1 rounded text-xs ${
                    selectedNode.status === 'running' ? 'bg-yellow-900 text-yellow-300' :
                    selectedNode.status === 'completed' ? 'bg-green-900 text-green-300' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {selectedNode.status === 'running' ? '运行中' :
                     selectedNode.status === 'completed' ? '已完成' : '待运行'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => deleteNode(selectedNode.id)}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm"
              >
                🗑️ 删除节点
              </button>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">
              点击节点查看属性
            </div>
          )}

          {/* 执行日志 */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2 text-sm">执行日志</h3>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className="text-xs">
                  <span className="text-gray-500">{log.time}</span>
                  <span className="ml-2 text-gray-300">{log.message}</span>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-xs text-gray-500">暂无日志</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
