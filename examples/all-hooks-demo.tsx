import React, { useState, useEffect } from 'react';
import {
  useFetch,
  useDebounce,
  useDebounceState,
  useDebounceCallback,
  useToggle,
  useLocalStorage,
  useSse,
  debounce
} from '@simonzywutt/react-hooks-collection';

// 用户数据类型
interface User {
  id: number;
  name: string;
  email: string;
}

function AllHooksDemo() {
  // 1. useFetch 示例
  const { data: users, loading, error, refetch } = useFetch<User[]>('/api/users');

  // 2. useDebounce 示例
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 3. useDebounceState 示例
  const [query, setQuery] = useDebounceState('', 300);

  // 4. useToggle 示例
  const [isVisible, toggle, setVisible] = useToggle(false);
  const [isDarkMode, toggleDarkMode] = useToggle(false);

  // 5. useLocalStorage 示例
  const [theme, setTheme, removeTheme] = useLocalStorage('app-theme', 'light');
  const [userPrefs, setUserPrefs] = useLocalStorage('user-preferences', {
    notifications: true,
    autoSave: false
  });

  // 6. useSse 示例
  const { connectionState, addListener, closeConnection } = useSse('http://localhost:3000/events');

  // 7. useDebounceCallback 示例
  const debouncedSave = useDebounceCallback(
    (data: any) => {
      console.log('保存数据:', data);
      // 模拟保存到服务器
    },
    1000
  );

  // 8. 普通 debounce 函数示例
  const handleSearch = debounce((term: string) => {
    console.log('执行搜索:', term);
  }, 500);

  // 监听防抖搜索词变化
  useEffect(() => {
    if (debouncedSearchTerm) {
      console.log('搜索:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  // 监听防抖状态变化
  useEffect(() => {
    if (query) {
      console.log('查询:', query);
    }
  }, [query]);

  // SSE 事件监听
  useEffect(() => {
    const cleanup = addListener('message', (data) => {
      console.log('收到 SSE 消息:', data);
    });

    return cleanup;
  }, [addListener]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>React Hooks Collection Demo</h1>

      {/* useFetch 示例 */}
      <section style={{ marginBottom: '30px' }}>
        <h2>1. useFetch Hook</h2>
        <button onClick={refetch}>刷新用户数据</button>
        {loading && <p>加载中...</p>}
        {error && <p style={{ color: 'red' }}>错误: {error.message}</p>}
        {users && (
          <ul>
            {users.map(user => (
              <li key={user.id}>{user.name} - {user.email}</li>
            ))}
          </ul>
        )}
      </section>

      {/* useDebounce 示例 */}
      <section style={{ marginBottom: '30px' }}>
        <h2>2. useDebounce Hook</h2>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="输入搜索词 (500ms 防抖)"
        />
        <p>当前输入: {searchTerm}</p>
        <p>防抖后的值: {debouncedSearchTerm}</p>
      </section>

      {/* useDebounceState 示例 */}
      <section style={{ marginBottom: '30px' }}>
        <h2>3. useDebounceState Hook</h2>
        <input
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入查询 (300ms 防抖)"
        />
        <p>防抖查询: {query}</p>
      </section>

      {/* useToggle 示例 */}
      <section style={{ marginBottom: '30px' }}>
        <h2>4. useToggle Hook</h2>
        <div>
          <button onClick={toggle}>切换显示/隐藏</button>
          <button onClick={() => setVisible(true)}>显示</button>
          <button onClick={() => setVisible(false)}>隐藏</button>
          {isVisible && <p>内容可见!</p>}
        </div>
        <div style={{ marginTop: '10px' }}>
          <button onClick={toggleDarkMode}>
            切换到 {isDarkMode ? '亮色' : '暗色'} 模式
          </button>
        </div>
      </section>

      {/* useLocalStorage 示例 */}
      <section style={{ marginBottom: '30px' }}>
        <h2>5. useLocalStorage Hook</h2>
        <div>
          <p>当前主题: {theme}</p>
          <button onClick={() => setTheme('dark')}>暗色主题</button>
          <button onClick={() => setTheme('light')}>亮色主题</button>
          <button onClick={removeTheme}>重置主题</button>
        </div>
        <div style={{ marginTop: '10px' }}>
          <p>用户偏好: {JSON.stringify(userPrefs)}</p>
          <button onClick={() => setUserPrefs(prev => ({ ...prev, notifications: !prev.notifications }))}>
            切换通知设置
          </button>
        </div>
      </section>

      {/* useSse 示例 */}
      <section style={{ marginBottom: '30px' }}>
        <h2>6. useSse Hook</h2>
        <p>连接状态: {connectionState}</p>
        <button onClick={closeConnection}>关闭 SSE 连接</button>
        <p>查看控制台以查看 SSE 消息</p>
      </section>

      {/* useDebounceCallback 示例 */}
      <section style={{ marginBottom: '30px' }}>
        <h2>7. useDebounceCallback Hook</h2>
        <button onClick={() => debouncedSave({ timestamp: Date.now() })}>
          保存数据 (1秒防抖)
        </button>
        <p>查看控制台以查看保存日志</p>
      </section>

      {/* debounce 函数示例 */}
      <section style={{ marginBottom: '30px' }}>
        <h2>8. debounce 函数</h2>
        <input
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="输入搜索 (普通防抖函数)"
        />
        <p>查看控制台以查看搜索日志</p>
      </section>
    </div>
  );
}

export default AllHooksDemo;