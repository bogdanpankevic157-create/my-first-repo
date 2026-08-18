const { test, expect } = require('@playwright/test');

test.describe('API-тесты для Restful-booker', () => {
  const baseURL = 'https://restful-booker.herokuapp.com';
  let bookingId;   
  let authToken;   

  
  const testBookingData = {
    firstname: "Ivan",
    lastname: "Petrov",
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: "2026-12-01",
      checkout: "2026-12-10"
    },
    additionalneeds: "Breakfast"
  };

  
  // ТЕСТ 1: Создание бронирования (CREATE - POST)

  test('1. Создание нового бронирования', async ({ request }) => {
    console.log('📤 Отправляем POST запрос на /booking...');
    
    const response = await request.post(`${baseURL}/booking`, {
      data: testBookingData
    });

    console.log(`📥 Статус-код: ${response.status()}`);

    // Проверка 1: Статус-код 200
    expect(response.status()).toBe(200);

    // Проверка 2: В ответе есть bookingid
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('bookingid');
    
    // Сохраняем bookingid для следующих тестов
    bookingId = responseBody.bookingid;
    console.log(`✅ Создано бронирование с ID: ${bookingId}`);

    // Проверка 3: Данные в ответе совпадают с отправленными
    expect(responseBody.booking).toMatchObject(testBookingData);
    console.log('✅ Данные совпадают');
  });

  
  // ТЕСТ 2: Получение бронирования (READ - GET)
 
  test('2. Получение информации о бронировании', async ({ request }) => {
    console.log(`📤 Отправляем GET запрос на /booking/${bookingId}...`);
    
    // Проверяем, что bookingId не пустой
    expect(bookingId).toBeDefined();

    const response = await request.get(`${baseURL}/booking/${bookingId}`);

    console.log(`📥 Статус-код: ${response.status()}`);

    // Проверка 1: Статус-код 200
    expect(response.status()).toBe(200);

    // Проверка 2: Данные совпадают с созданными
    const responseBody = await response.json();
    expect(responseBody).toMatchObject(testBookingData);
    
    console.log(`✅ Получены данные по бронированию ${bookingId}`);
  });

  // ТЕСТ 3: Обновление бронирования (UPDATE - PUT)
 
  test('3. Обновление информации о бронировании', async ({ request }) => {
    console.log('📤 Получаем токен авторизации...');
    
    // 1. Получаем токен авторизации
    const authResponse = await request.post(`${baseURL}/auth`, {
      data: {
        username: "admin",
        password: "password123"
      }
    });
    
    const authBody = await authResponse.json();
    authToken = authBody.token;
    console.log(`✅ Получен токен: ${authToken}`);

    // 2. Обновленные данные
    const updatedData = {
      firstname: "Petr",
      lastname: "Ivanov",
      totalprice: 250,
      depositpaid: false,
      bookingdates: {
        checkin: "2026-12-15",
        checkout: "2026-12-20"
      },
      additionalneeds: "Dinner"
    };

    console.log(`📤 Отправляем PUT запрос на /booking/${bookingId}...`);
    
    const response = await request.put(`${baseURL}/booking/${bookingId}`, {
      headers: {
        'Cookie': `token=${authToken}`,
        'Content-Type': 'application/json'
      },
      data: updatedData
    });

    console.log(`📥 Статус-код: ${response.status()}`);

    // Проверка 1: Статус-код 200
    expect(response.status()).toBe(200);

    // Проверка 2: Данные обновлены
    const responseBody = await response.json();
    expect(responseBody).toMatchObject(updatedData);
    
    console.log(`✅ Обновлено бронирование ${bookingId}`);
  });

  
  // ТЕСТ 4: Удаление бронирования (DELETE - DELETE)
  
  test('4. Удаление бронирования', async ({ request }) => {
    console.log(`📤 Отправляем DELETE запрос на /booking/${bookingId}...`);
    
    // Проверяем, что токен есть
    expect(authToken).toBeDefined();

    const response = await request.delete(`${baseURL}/booking/${bookingId}`, {
      headers: {
        'Cookie': `token=${authToken}`
      }
    });

    console.log(`📥 Статус-код: ${response.status()}`);

    // Проверка 1: Статус-код 201 (Created)
    expect(response.status()).toBe(201);
    console.log(`✅ Удалено бронирование ${bookingId}`);

    // Проверка 2: GET запрос возвращает 404 Not Found
    console.log(`📤 Проверяем, что бронирование ${bookingId} больше не существует...`);
    const getResponse = await request.get(`${baseURL}/booking/${bookingId}`);
    expect(getResponse.status()).toBe(404);
    console.log(`✅ Подтверждено: бронирование ${bookingId} больше не существует`);
  });

});