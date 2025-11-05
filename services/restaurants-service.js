import {API_URL} from '../config';

const BASE_API = 'api/restaurant'

export const getRestaurantsTypes = async (cityId) => {
    try {
        const res = await fetch(`${API_URL}/${BASE_API}/categories/by-city/${cityId}`);
        if (!res.ok) {
            alert(res.status)
            throw new Error('حدث خطأ اثناء تحميل اصناف المطاعم');
        }
        return await res.json();
    } catch (error) {
        throw new Error('حدث خطأ اثناء تحميل اصناف المطاعم');
    }
}

export const getRestaurantsByTypeAndCity = async (cityId, categoryId) => {
    try {
        const res = await fetch(`${API_URL}/${BASE_API}/by-category-and-city/${categoryId}/${cityId}`);
        if (!res.ok) {
            alert(res.status)
            throw new Error('حدث خطأ اثناء تحميل المطاعم');
        }
        return await res.json();
    } catch (error) {
        throw new Error('حدث خطأ اثناء تحميل اصناف المطاعم');
    }
}

export const getRestaurantMenu = async (restaurantId) => {
    try {
        const res = await fetch(`${API_URL}/${BASE_API}/${restaurantId}/menu`);
        if (!res.ok) {
            alert(res.status)
            throw new Error('حدث خطأ اثناء تحميل المطاعم');
        }
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

export const searchRestaurants = async (cityId, query, perPage = 10) => {
  try {
    const res = await fetch(
      `${API_URL}/${BASE_API}/search/${cityId}?q=${encodeURIComponent(query)}&per_page=${perPage}&type=restaurant`
    );

    if (!res.ok) {
      throw new Error('حدث خطأ أثناء البحث عن المطاعم');
    }

    return await res.json();
  } catch (error) {
    throw new Error('حدث خطأ أثناء البحث عن المطاعم');
  }
};