import React, { useEffect } from 'react';
import useSse from '../useSse';

const App = () => {
  const { connectionState, connectionError, addListener, getEventData, closeConnection } = useSse('/events', {
    withCredentials: false
  });

  useEffect(() => {
    // 添加事件监听器
    const cleanup = addListener('MyEvent', (data) => {
      console.log('收到SSE数据:', data);
    });
    
    // 返回清理函数
    return cleanup;
  }, [addListener]);

  // 获取事件数据
  const data = getEventData('MyEvent');

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>myHooks - SSE测试</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>连接状态</h2>
        <p>状态: <span style={{ 
          color: connectionState === 'OPEN' ? 'green' : 
                 connectionState === 'CONNECTING' ? 'orange' : 'red',
          fontWeight: 'bold'
        }}>{connectionState}</span></p>
        
        {connectionError && (
          <p style={{ color: 'red' }}>错误: {connectionError.type}</p>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>接收到的数据</h2>
        <p>最新数据: <code>{data || '暂无数据'}</code></p>
      </div>

      <div>
        <button 
          onClick={closeConnection}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          关闭连接
        </button>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>打开浏览器控制台查看详细日志</p>
      </div>
    </div>
  );
};

export default App; 