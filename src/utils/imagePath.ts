export const imagePath = (path: string) => {
  if (path.startsWith('http')) return path;

  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
};