// Guest username stored in localStorage. No auth.
const KEY = "hieu_ngoc_username";

export const USERNAME_REGEX = /^[A-Za-zÀ-ỹ0-9_-]{1,30}$/;

export function getUsername(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY);
}

export function setUsername(name: string): void {
  localStorage.setItem(KEY, name);
  window.dispatchEvent(new CustomEvent("hieu-ngoc-username-changed", { detail: name }));
}

export function validateUsername(name: string): string | null {
  if (!name) return "Vui lòng nhập tên hiển thị.";
  if (name.length > 30) return "Tối đa 30 ký tự.";
  if (/\s/.test(name)) return "Không được chứa khoảng trắng.";
  if (!USERNAME_REGEX.test(name))
    return "Chỉ dùng chữ, số, dấu _ hoặc - (không khoảng trắng, không ký tự đặc biệt).";
  return null;
}
