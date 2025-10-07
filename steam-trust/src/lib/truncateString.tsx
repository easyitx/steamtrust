export function truncateString(str: string = '') {
    if (str.length > 9) {
        // Проверяем, что длина строки больше 9
        const start = str.slice(0, 3); // Первые 6 символов
        const end = str.slice(-3); // Последние 3 символа

        return `${start}....${end}`; // Формируем новую строку
    }

    return str; // Если строка короткая, возвращаем её без изменений
}
