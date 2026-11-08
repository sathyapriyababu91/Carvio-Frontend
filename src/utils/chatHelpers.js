import { API_URL } from './config';

const AVATAR_COLORS = [
  '#2F6FED',
  '#7C3AED',
  '#0EA5A4',
  '#F59E0B',
  '#EF4444',
  '#10B981',
];

export const getVehicleName = (car) =>
  car?.title ||
  `${car?.brand || ''} ${car?.modelName || ''}`.trim() ||
  'Vehicle';

export const formatPrice = (price) => {
  if (price == null || price === '' || Number.isNaN(Number(price))) {
    return '';
  }

  return `₹${Number(price).toLocaleString('en-IN')}`;
};

export const getInitial = (name) =>
  (name || '?').trim().charAt(0).toUpperCase() || '?';

export const getAvatarColor = (seed = '') => {
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

// First car image as a usable uri, or null (callers show a placeholder).
export const getImageUri = (car) => {
  const first = Array.isArray(car?.images) ? car.images[0] : car?.image;
  const raw = typeof first === 'string' ? first : first?.url || first?.uri || '';

  if (!raw || typeof raw !== 'string') return null;

  if (/^https?:\/\//i.test(raw)) return raw;

  return `${API_URL}/${raw.replace(/\\/g, '/').replace(/^\/+/, '')}`;
};

export const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

const startOfDay = (d) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

// "Today", "Yesterday", or a short date.
export const getDayLabel = (date) => {
  const d = new Date(date);
  const diffDays = Math.round(
    (startOfDay(new Date()) - startOfDay(d)) / 86400000
  );

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';

  return d.toLocaleDateString([], {
    day: 'numeric',
    month: 'short',
    year: d.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  });
};

// Chat list: time for today's chats, otherwise the day label.
export const formatChatListTime = (date) => {
  const label = getDayLabel(date);

  return label === 'Today' ? formatTime(date) : label;
};