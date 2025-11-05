import {API_URL} from '../config';

const BASE_API = 'api/stores'

export const getStoresTypes = async (cityId) => {
    try {
        const res = await fetch(`${API_URL}/${BASE_API}/categories/by-city/${cityId}`);
        if (!res.ok) {
            alert(res.status)
            throw new Error('حدث خطأ اثناء تحميل اصناف المتاجر');
        }
        return await res.json();
    } catch (error) {
        throw new Error('حدث خطأ اثناء تحميل اصناف المتاجر');
    }
};

export const getCities = async () => {
    try {
        const res = await fetch(`${API_URL}/api/countries/cities`);
        if (!res.ok) {
            alert(res.status)
            throw new Error('حدث خطأ اثناء تحميل المدن');
        }
        return await res.json();
    } catch (error) {
        throw new Error('حدث خطأ اثناء تحميل المدن');
    }
}

export const getStoresByTypeAndCity = async (cityId, categoryId) => {
    try {
        const res = await fetch(`${API_URL}/${BASE_API}/by-category-and-city/${categoryId}/${cityId}`);
        if (!res.ok) {
            alert(res.status)
            throw new Error('حدث خطأ اثناء تحميل المتاجر');
        }
        return await res.json();
    } catch (error) {
        throw new Error('حدث خطأ اثناء تحميل اصناف المطاعم');
    }
}

export const searchStores = async (cityId, query, perPage = 10) => {
  try {
    const res = await fetch(
      `${API_URL}/api/restaurant/search/${cityId}?q=${encodeURIComponent(query)}&per_page=${perPage}&type=store`
    );
    if (!res.ok) {
      throw new Error("حدث خطأ أثناء البحث عن المتاجر");
    }
    return await res.json();
  } catch (error) {
    throw new Error("حدث خطأ أثناء البحث عن المتاجر");
  }
};

