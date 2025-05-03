import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { message } from 'antd';
import 'antd-notifications-messages/lib/styles/style.css';

message.config({
  duration: 2,
  maxCount: 3,
  prefixCls: 'my-message',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
)
