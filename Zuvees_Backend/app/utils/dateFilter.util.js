const getDateFilter = (periodValue) => {
  const now = new Date();

  switch (periodValue) {
    case "today": {
      const startOfToday = new Date(now.setHours(0, 0, 0, 0));
      const endOfToday = new Date(now.setHours(23, 59, 59, 999));
      return { createdAt: { $gte: startOfToday, $lte: endOfToday } };
    }

    case "sevenDays": {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return { createdAt: { $gte: sevenDaysAgo } };
    }

    case "thisMonth": {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return { createdAt: { $gte: startOfMonth } };
    }

    case "thisYear": {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      return { createdAt: { $gte: startOfYear } };
    }

    case "All":
    default:
      return {}; 
  }
};

module.exports = { 
  getDateFilter 
};
