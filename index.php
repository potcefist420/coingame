<?php
// Получение данных из Telegram
$update = json_decode(file_get_contents('php://input'), true);

// Проверка, является ли запрос от Telegram
if (isset($update['message'])) {
    // Получение текста сообщения от пользователя
    $message = $update['message']['text'];

    // Получение и обработка команды от пользователя
    if ($message == '/start') {
        // Отправка приветственного сообщения
        sendMessage('Welcome to the Coin Clicker Game!');
    } elseif ($message == '/score') {
        // Получение и отправка списка игроков и их счетов
        $playerScores = json_decode(file_get_contents('playerScores.json'), true);
        $message = 'Список игроков и их счет:\n\n';
        foreach ($playerScores as $player => $score) {
            $message .= "$player: $score coins\n";
        }
        sendMessage($message);
    } elseif (substr($message, 0, 5) == '/ref ') {
        // Обработка команды на начисление реферальных бонусов
        $referralCode = substr($message, 5);
        processReferral($referralCode);
    }
}

// Функция отправки сообщения пользователю через Telegram API
function sendMessage($text) {
    $botToken = '6941115045:AAEfC22K5El2_ggic4X91EVKLPIGEOz-Oto'; // Ваш токен бота
    $chatId = '5831984004'; // ID чата с пользователем
    $url = "https://api.telegram.org/bot$botToken/sendMessage?chat_id=$chatId&text=" . urlencode($text);
    file_get_contents($url);
}

// Функция обработки реферальной системы
function processReferral($referralCode) {
    // Логика обработки реферального кода и начисления бонусов
    // Например, обновление данных в базе данных или файле
}
?>
