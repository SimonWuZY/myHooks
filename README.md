# React Hooks Collection

一个包含多个实用 React Hooks 的 TypeScript 库。

## 安装

```bash
npm install @simonzywu/react-hooks-collection
```

## 包含的 Hooks

### useFetch
用于处理 HTTP 请求的 Hook

```tsx
import { useFetch } from '@simonzywu/react-hooks-collection';

function MyComponent() {
  const { data, loading, error, refetch } = useFetch<User[]>('/api/users');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map(user => <div key={user.id}>{user.name}</div>)}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### useDebounce
防抖 Hook，延迟更新值

```tsx
import { useDebounce } from '@simonzywu/react-hooks-collection';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // 执行搜索
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="搜索..."
    />
  );
}
```

### useDebounceState
防抖状态 Hook，直接提供防抖的 setState

```tsx
import { useDebounceState } from '@simonzywu/react-hooks-collection';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useDebounceState('', 500);

  useEffect(() => {
    if (searchTerm) {
      // 执行搜索，这里的 searchTerm 已经是防抖后的值
      console.log('搜索:', searchTerm);
    }
  }, [searchTerm]);

  return (
    <input
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="搜索..."
    />
  );
}
```

### useDebounceCallback
防抖回调 Hook，对回调函数进行防抖处理

```tsx
import { useDebounceCallback } from '@simonzywu/react-hooks-collection';

function FormComponent() {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const debouncedSave = useDebounceCallback(
    (data) => {
      console.log('保存数据:', data);
      // 执行保存逻辑
    },
    1000,
    [formData]
  );

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    debouncedSave(newData); // 防抖保存
  };

  return (
    <form>
      <input
        value={formData.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        placeholder="姓名"
      />
      <input
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        placeholder="邮箱"
      />
    </form>
  );
}
```

### useToggle
布尔值切换 Hook

```tsx
import { useToggle } from '@simonzywu/react-hooks-collection';

function ToggleComponent() {
  const [isVisible, toggle, setToggle] = useToggle(false);

  return (
    <div>
      <button onClick={toggle}>切换</button>
      <button onClick={() => setToggle(true)}>显示</button>
      <button onClick={() => setToggle(false)}>隐藏</button>
      {isVisible && <div>内容可见</div>}
    </div>
  );
}
```

### useLocalStorage
本地存储 Hook

```tsx
import { useLocalStorage } from '@simonzywu/react-hooks-collection';

function SettingsComponent() {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');

  return (
    <div>
      <p>当前主题: {theme}</p>
      <button onClick={() => setTheme('dark')}>暗色主题</button>
      <button onClick={() => setTheme('light')}>亮色主题</button>
      <button onClick={removeTheme}>重置</button>
    </div>
  );
}
```

### useSse
Server-Sent Events Hook

```tsx
import { useSse } from '@simonzywu/react-hooks-collection';

function EventsComponent() {
  const { 
    connectionState, 
    connectionError,
    isConnected,
    addListener, 
    closeConnection,
    reconnect 
  } = useSse('http://localhost:3000/events');

  useEffect(() => {
    const cleanup = addListener('message', (data) => {
      console.log('收到消息:', data);
    });

    return cleanup;
  }, [addListener]);

  return (
    <div>
      <p>连接状态: {connectionState}</p>
      <p>是否已连接: {isConnected ? '是' : '否'}</p>
      {connectionError && (
        <p style={{ color: 'red' }}>
          错误: {connectionError.timestamp} - ReadyState: {connectionError.readyState}
        </p>
      )}
      <button onClick={closeConnection}>关闭连接</button>
      <button onClick={reconnect}>重新连接</button>
    </div>
  );
}
```

## API 文档

### useFetch<T>(url: string, options?: RequestInit)
- `data: T | null` - 请求返回的数据
- `loading: boolean` - 加载状态
- `error: Error | null` - 错误信息
- `refetch: () => void` - 重新请求函数

### useDebounce<T>(value: T, delay: number): T
- `value` - 需要防抖的值
- `delay` - 延迟时间（毫秒）
- 返回防抖后的值

### useDebounceState<T>(defaultValue: T, time: number)
- 返回 `[value, debouncedSetValue]`
- `value: T` - 当前状态值
- `debouncedSetValue: (value: T | ((prev: T) => T)) => void` - 防抖的设置函数
- 直接提供防抖的状态管理，无需额外的 useEffect

### useDebounceCallback<T>(callback: T, delay: number, deps?: React.DependencyList)
- `callback` - 需要防抖的回调函数
- `delay` - 延迟时间（毫秒）
- `deps` - 依赖数组（可选）
- 返回防抖后的回调函数

### debounce<T>(fn: T, time: number)
- 通用防抖函数，可以在 React 外部使用
- `fn` - 需要防抖的函数
- `time` - 延迟时间（毫秒）
- 返回防抖后的函数

### useToggle(initialValue?: boolean)
- 返回 `[value, toggle, setToggle]`
- `value: boolean` - 当前值
- `toggle: () => void` - 切换函数
- `setToggle: (value?: boolean) => void` - 设置值函数

### useLocalStorage<T>(key: string, initialValue: T)
- 返回 `[value, setValue, removeValue]`
- `value: T` - 当前存储的值
- `setValue: (value: T | ((val: T) => T)) => void` - 设置值函数
- `removeValue: () => void` - 删除值函数

### useSse(url: string, options?: EventSourceInit)
- `connectionState: SseConnectionState` - 连接状态 ('CONNECTING' | 'OPEN' | 'CLOSED' | 'ERROR')
- `connectionError: SseError | null` - 详细的连接错误信息
- `isConnected: boolean` - 是否已连接的便捷属性
- `addListener: (eventName: string, handler: (data: string) => void) => (() => void) | undefined` - 添加事件监听器
- `getEventData: (eventName: string) => string | undefined` - 获取事件数据
- `closeConnection: () => void` - 关闭连接
- `reconnect: () => void` - 重新连接

## 开发

```bash
# 安装依赖
npm install

# 构建
npm run build

# 开发模式
npm run dev

# 类型检查
npm run type-check
```

## License

MIT