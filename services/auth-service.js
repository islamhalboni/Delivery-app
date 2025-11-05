import { API_URL } from '../config';

const BASE_API = 'api/auth';

// 🔑 تسجيل الدخول
export const login = async (phone, password) => {
  try {
    const res = await fetch(`${API_URL}/${BASE_API}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ phone, password }),
    });

    const text = await res.text();
    console.log("🔎 Login response:", res.status, text);

    if (!res.ok) {
      throw new Error(text || 'حدث خطأ اثناء تسجيل الدخول');
    }

    return JSON.parse(text);
  } catch (error) {
    console.log("❌ Login API error:", error.message);
    throw new Error('يرجى التأكد من رقم الهاتف وكلمة المرور');
  }
};

// 📝 تسجيل مستخدم جديد (بدون إيميل)
export const register = async (name, phone, password) => {
  try {
    const res = await fetch(`${API_URL}/${BASE_API}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        phone,
        password,
        password_confirmation: password,
      }),
    });

    const text = await res.text();
    console.log("🔎 Register response:", res.status, text);

    if (!res.ok) {
      throw new Error(text || 'هذا المستخدم موجود');
    }

    return JSON.parse(text);
  } catch (error) {
    console.log("❌ Register API error:", error.message);
    throw new Error('حدث خطأ اثناء التسجيل');
  }
};

// 🚪 تسجيل الخروج
export const logout = async () => {
  try {
    const res = await fetch(`${API_URL}/${BASE_API}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const text = await res.text();
    console.log("🔎 Logout response:", res.status, text);

    if (!res.ok) {
      throw new Error(`فشل تسجيل الخروج (status ${res.status})`);
    }

    // لو السيرفر بيرجع JSON
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (error) {
    console.log("❌ Logout API error:", error.message);
    throw new Error('حدث خطأ أثناء تسجيل الخروج');
  }
};
