<?php
// Замените на свой токен бота
define('BOT_TOKEN, '6941115045:AAEfC22K5El2_ggic4X91EVKLPIGEOz-Oto);

// Получение входящего обновления от Telegram
$content = file_get_contents("php://input");
$update = json_decode($content, true);

// Если обновление не получено, завершаем выполнение скрипта
if (!$update) {
    exit("No data received from Telegram.");
}

// Извлечение данных из обновления
$message = isset($update['message']) ? $update['message'] : null;
$chat_id = isset($message['chat']['id']) ? $message['chat']['id'] : null;
$text = isset($message['text']) ? $message['text'] : '';

// Обработка команды /start
if ($text == '/start') {
    $response = "Привет! Это пример бота на PHP.";
    sendMessage($chat_id, $response);
}

// Функция для отправки сообщения пользователю через API Telegram
function sendMessage($chat_id, $text) {
    $url = "https://api.telegram.org/bot" . BOT_TOKEN . "/sendMessage?chat_id=$chat_id&text=" . urlencode($text);
    file_get_contents($url);
}

// Логирование входящего обновления (для отладки)
file_put_contents('log.txt', $content . PHP_EOL, FILE_APPEND | LOCK_EX);
?>
