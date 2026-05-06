import type { TimerMode } from '../types';

export function requestNotificationPermission(): void {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

export function sendNotification(mode: TimerMode): void {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const isWork = mode === 'work';
  const title = isWork ? '休息时间到啦！' : '休息结束！';
  const body = isWork
    ? '你已经专注了一段时间，该休息一下了'
    : '休息好了，继续开始专注工作吧！';

  const notification = new Notification(title, { body });
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
}
