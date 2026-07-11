const BASE_URL = '/api/subscriptions';

export const subscriptionApi = {
    // 1. Получить все подписки
    getAll: async () => {
        const res = await fetch(BASE_URL);
        if (!res.ok) throw new Error('Ошибка при получении списка подписок');
        return res.json();
    },

    // 2. Создать подписку
    create: async (data) => {
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Ошибка при создании подписки (400 Bad Request)');
        return res.json();
    },

    // 3. Изменить подписку
    update: async (id, data) => {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Ошибка при обновлении подписки');
        return res.json();
    },

    // 4. Удалить подписку
    delete: async (id) => {
        const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Ошибка при удалении подписки');
        return true;
    },

    // 5. Получить сумму расходов в месяц (приведенную бэкендом)
    getTotalExpenses: async () => {
        const res = await fetch(`${BASE_URL}/total`);
        if (!res.ok) throw new Error('Ошибка при получении общей суммы');
        return res.json(); // Возвращает число (например, 600)
    }
};