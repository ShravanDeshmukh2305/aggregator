export const parseEmailAddress = (emailStr) => {
  if (!emailStr) return '';
  const match = emailStr.match(/<(.+?)>/);
  return match ? match[1] : emailStr;
};

export const extractNameFromEmail = (emailStr) => {
  if (!emailStr) return '';
  const match = emailStr.match(/(.+?)\s*<.+?>/);
  return match ? match[1] : '';
};