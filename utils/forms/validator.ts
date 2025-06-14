export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validatePhoneNumber(phone_number: string): boolean {
  const regex = /^08\d{8,11}$/;
  return regex.test(phone_number);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

export function isLoggedIn(): boolean {
  return localStorage.getItem("currentUser") ? true : false;
}
