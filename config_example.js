// БОТ МОЖЕТ ПУБЛИКОВАТЬ NSFW-КОНТЕНТ / N-WORD'ы (все, что написали участники хранится в /img (изображения), /data (текст))

// Заполните все поля снизу до первого запуска. Этот файл будет переименован в config.js после запуска (если файл config.js имеется - не будет).
module.exports = {
    token: "", // Токен вашего клиента

    // Сохранение данных
    saveAnyData: true, // Сохранять ли ВСЕ данные?
    imgSaveAndUse: true, // Сохранять ли & использовать изображения?
    ourFile: false, // Общий ли файл с текстом для разных гильдий?
    // Если нет: файлы делятся на ${айди гильдии}_data.txt.
    // Если да: все хранится в одном файле.

    // Настройка сохранения данных
    limitToImgOnce: 3, // Если пользователь отправил указанное кол-во (или >) изображений в одном сообщении, они не сохраняются, лимит - 10
    maxLenghtToWrite: 100, // Если в сообщении > указанного кол-ва символов, клиент не записывает сообщение в файл.
    limitimg: 100, // Лимит на кол-во сохраненных изображений.
    msgFilter: '', // Фильтр текста на контент, 2 типа -
    // 'links' - ссылки
    // 'none' - никакая
    imageFilter: 'none', // Фильтр изображений на NSFW-контент, 2 типа -
    // Встроенная проверка NSFW в разработке
    // 'none' - без проверки на NSFW-контент

    // Настройки использования сообщений:
    idChanneltoSaveAndWrite: [""], // ID канала/ов, куда будут писаться сообщения при пинге/случайном сообщении и читаться оттуда, например, ['1', '2']
    randomMessage: false, // Может ли появится сообщения без упоминания клиента
    messageChance: 5, // Шанс на сообщение (от 0-10: 1 - 100%, 5 - половина)

    // Статус клиента:
    bottextStatus: "", // Текст, который будет отображен в статусе клиента
    botonlineStatus: "", // Устанавливает статус клиента: "online", "idle", "dnd", "invisible"
    typeofStatus: 3, // Тип статуса: 0: "Играет", 1: "Стримит" (только твич), 2: "Слушает", 3: "Смотрит", 5: "Соревнуется в"

    // Пользовательские команды.
    commandsEnable: true, // Включены ли команды?
    commandsPrefix: 'roz.', // Префикс команд.
    commandsAccess: [''], // Тот, кто имеет доступ к DEV-коммандам
};