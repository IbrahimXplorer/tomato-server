export const isValidPhone = (phone: string): boolean => {
  return /^(01)[0-9]{9}$/.test(phone);
};
