type MaxDays = {
  maxCount: number;
  countFromLast: number;
};
export function getMaxConsecutiveDays(dates: Date[]): MaxDays {
  if (dates.length <= 1) {
    return {
      maxCount: dates.length,
      countFromLast: dates.length,
    };
  }

  dates.sort((a, b) => a.getTime() - b.getTime());

  let maxCount = 1;
  let dp = [1];

  for (let i = 1; i < dates.length; i++) {
    const diff = dates[i].getTime() - dates[i - 1].getTime();

    if (diff === 24 * 3600 * 1000) {
      dp[i] = dp[i - 1] + 1;
    } else {
      dp[i] = 1;
    }

    if (dp[i] > maxCount) {
      maxCount = dp[i];
    }
  }

  return {
    maxCount,
    countFromLast: dp[dp.length - 1],
  };
}
