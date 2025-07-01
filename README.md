# myHooks

自己封装的一些React hooks，使用TypeScript编写。

## 安装

```bash
npm install
```

## 开发

```bash
# 安装依赖
npm install

# 类型检查
npm run type-check

# 构建项目
npm run build

# 开发模式（监听文件变化）
npm run dev

# 清理构建文件
npm run clean
```

## 可用的Hooks

### useSse

Server-Sent Events (SSE) 的React Hook。

```typescript
import { useSse } from 'myhooks';

function MyComponent() {
  const { connectionState, connectionError, addListener, getEventData, closeConnection } = useSse('https://api.example.com/events');

  useEffect(() => {
    addListener('message', (data) => {
      console.log('收到消息:', data);
    });
  }, [addListener]);

  return (
    <div>
      <p>连接状态: {connectionState}</p>
      <button onClick={closeConnection}>关闭连接</button>
    </div>
  );
}
```

## TypeScript支持

本项目完全使用TypeScript编写，提供完整的类型定义和智能提示。

## 构建

项目构建后会生成以下文件：
- `dist/index.js` - 编译后的JavaScript文件
- `dist/index.d.ts` - TypeScript类型定义文件
- `dist/index.js.map` - 源码映射文件
