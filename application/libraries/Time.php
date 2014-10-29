<?php
if (!defined("BASEPATH")) exit("No direct script access allowed");
/**
 * class Time
 */
class Time
{
    /**
     * Количество секунд в минуте
     */
    const SECONDS_IN_MINUTE = 60;
    const NO_VALUE = 0;

    /**
     * Получить количество секунд в минутах
     *
     * @param $minutes
     * @return mixed
     */
    public function getCountNumberOfSecondsInMinute($minutes)
    {
        return $minutes * self::SECONDS_IN_MINUTE;
    }

    /**
     * Подсчитать остаток времени в секундах
     *
     * @param $totalSeconds
     * @return mixed
     */
    public function calculateRemainingTimeInSeconds($totalSeconds)
    {
        $remainingTime = $totalSeconds - time();

        if ($remainingTime <= self::NO_VALUE) {
            return self::NO_VALUE;
        } else {
            return $remainingTime;
        }
    }

    /**
     * Получить временную метку окончания продления времени по минутам
     *
     * @param $minute
     * @return int
     */
    public function getTimestampProlongedByMinute($minute)
    {
        return mktime(date("H"), date("i") + $minute, date("s"), date("m"), date("d"), date("Y"));
    }

    /**
     * Получить временную метку окончания продления времени по секундам
     *
     * @param $seconds
     * @return int
     */
    public function getTimestampProlongedBySeconds($seconds)
    {
        return mktime(date("H"), date("i"), date("s") + $seconds, date("m"), date("d"), date("Y"));
    }

    /**
     * Получить текущую временную метку
     * @return int
     */
    public function getCurrentTimestamp()
    {
        return mktime(date("H"), date("i"), date("s"), date("m"), date("d"), date("Y"));
    }

    /**
     * Конвертировать временную метку в дату и время
     *
     * @param $timestamp
     * @return string
     */
    public function convertTimestampToDateAndTime($timestamp)
    {
        return date('Y-m-d H:i:s', $timestamp);
    }

    /**
     * Получить сформированную текущую дату и время
     *
     * @return string
     */
    public function getCurrentFormedDateAndTime()
    {
        return date('Y-m-d H:i:s');
    }

    /**
     * @return string
     */
    public static function getCurrentDateInTimestamp()
    {
        return date('Y-m-d');
    }

	/**
	 * @param string $timestamp
	 * @param bool $fullNameMonth
	 * @param bool $viewYear
	 * @return bool|string
	 */
	public static function getTranslateDate($timestamp, $fullNameMonth = true, $viewYear = true)
    {
        $month = array();
        $format = '';

        $monthTemplate = lang("monthNames");
        $date = date('Y-m-d', $timestamp);

        $expDate = explode("-", $date);
        $day = $expDate[2];
        $intMonth = $expDate[1];
        $intYear = $expDate[0];

        if ($fullNameMonth === true) {
            $format = 'wide';
        } else {
            $format = 'abbreviated';
        }

        if (!empty($expDate) AND
            !empty($monthTemplate) AND
            $format != ''
        ) {
            foreach ($monthTemplate[$format] as $key => $nameMonth) {
                if ($key == $intMonth) {
                    $month = $nameMonth;
                }
            }
        } else {
            return $date;
        }

        if ($viewYear === true) {
            $year = $intYear;
        }else{
            $year = '';
        }

        return $day . ' ' . mb_ucfirst($month) . ' ' . $year;
    }
}
