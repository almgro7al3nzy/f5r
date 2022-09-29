export const formatDate = date => {
  const splited = date.split('');
  let arrDate = splited.filter((_, i) => i < 10);
  arrDate = arrDate.join('');
  arrDate = arrDate.split('-').reverse();
  date = arrDate.join('/');
  return date;
};
